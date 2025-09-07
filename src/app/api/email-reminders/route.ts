import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'
import UserPreferences from '@/models/UserPreferences'
import { Problem } from '@/models/Problem'
import Chapter from '@/models/Chapter'
import { emailService } from '@/lib/email'

// Daily reminder job - check for users who need reminders
export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called by a cron job service
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Find users who have email reminders enabled and haven't logged in today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const usersNeedingReminders = await UserPreferences.find({
      dailyEmailReminder: true,
      emailRemindersEnabled: true
    }).populate('userId')

    let sentCount = 0
    let errorCount = 0

    for (const userPrefs of usersNeedingReminders) {
      try {
        const user = userPrefs.userId
        if (!user || !user.email) continue

        // Check if user has logged in today (you might need to track this)
        // For now, we'll send to all users with reminders enabled
        const lastLoginToday = false // You can implement login tracking

        if (!lastLoginToday) {
          const result = await emailService.sendDailyReminder(
            user.email,
            user.name || user.email.split('@')[0]
          )

          if (result.success) {
            sentCount++
          } else {
            errorCount++
            console.error(`Failed to send reminder to ${user.email}:`, result.error)
          }
        }
      } catch (error) {
        errorCount++
        console.error('Error processing user reminder:', error)
      }
    }

    return NextResponse.json({
      message: 'Daily reminders processed',
      sent: sentCount,
      errors: errorCount
    })
  } catch (error) {
    console.error('Error processing daily reminders:', error)
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    )
  }
}

// Weekly progress report job
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Find users who have weekly reports enabled
    const usersWantingReports = await UserPreferences.find({
      weeklyProgressEmail: true,
      emailRemindersEnabled: true
    }).populate('userId')

    let sentCount = 0
    let errorCount = 0

    for (const userPrefs of usersWantingReports) {
      try {
        const user = userPrefs.userId
        if (!user || !user.email) continue

        // Calculate weekly stats
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const [problemsSolved, totalTimeSpent, completedChapters] = await Promise.all([
          Problem.countDocuments({
            userId: user._id,
            status: 'Completed',
            completedAt: { $gte: oneWeekAgo }
          }),
          Problem.aggregate([
            {
              $match: {
                userId: user._id,
                timeSpent: { $exists: true },
                updatedAt: { $gte: oneWeekAgo }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$timeSpent' }
              }
            }
          ]),
          Chapter.countDocuments({
            userId: user._id,
            progress: 100,
            updatedAt: { $gte: oneWeekAgo }
          })
        ])

        const stats = {
          problemsSolved,
          totalTime: totalTimeSpent[0]?.total || 0,
          streakDays: userPrefs.currentStreak || 0,
          completedChapters
        }

        const result = await emailService.sendWeeklyProgressReport(
          user.email,
          user.name || user.email.split('@')[0],
          stats
        )

        if (result.success) {
          sentCount++
        } else {
          errorCount++
          console.error(`Failed to send report to ${user.email}:`, result.error)
        }
      } catch (error) {
        errorCount++
        console.error('Error processing user report:', error)
      }
    }

    return NextResponse.json({
      message: 'Weekly reports processed',
      sent: sentCount,
      errors: errorCount
    })
  } catch (error) {
    console.error('Error processing weekly reports:', error)
    return NextResponse.json(
      { error: 'Failed to process reports' },
      { status: 500 }
    )
  }
}

// Manual test endpoint (authenticated users can trigger their own reminder)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'daily'

    if (type === 'daily') {
      const result = await emailService.sendDailyReminder(
        session.user.email,
        session.user.name || session.user.email.split('@')[0]
      )
      return NextResponse.json(result)
    } else if (type === 'weekly') {
      // Get user stats for test
      await connectDB()
      const user = await User.findOne({ email: session.user.email })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const [problemsSolved, totalTimeSpent, completedChapters] = await Promise.all([
        Problem.countDocuments({
          userId: user._id,
          status: 'Completed',
          completedAt: { $gte: oneWeekAgo }
        }),
        Problem.aggregate([
          {
            $match: {
              userId: user._id,
              timeSpent: { $exists: true },
              updatedAt: { $gte: oneWeekAgo }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$timeSpent' }
            }
          }
        ]),
        Chapter.countDocuments({
          userId: user._id,
          progress: 100,
          updatedAt: { $gte: oneWeekAgo }
        })
      ])

      const stats = {
        problemsSolved,
        totalTime: totalTimeSpent[0]?.total || 0,
        streakDays: 5, // Mock streak for testing
        completedChapters
      }

      const result = await emailService.sendWeeklyProgressReport(
        session.user.email,
        session.user.name || session.user.email.split('@')[0],
        stats
      )
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
