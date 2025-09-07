import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'
import UserPreferences from '@/models/UserPreferences'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let preferences = await UserPreferences.findOne({ userId: user._id })
    
    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await UserPreferences.create({
        userId: user._id,
        emailRemindersEnabled: false,
        dailyEmailReminder: false,
        weeklyProgressEmail: false,
        achievementNotifications: false,
        reminderTime: '09:00',
        weeklyGoal: 5,
        preferredDifficulty: 'Medium',
        studyTimeGoal: 60
      })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const {
      emailRemindersEnabled,
      dailyEmailReminder,
      weeklyProgressEmail,
      achievementNotifications,
      reminderTime,
      weeklyGoal,
      preferredDifficulty,
      studyTimeGoal
    } = body

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update or create preferences
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: user._id },
      {
        emailRemindersEnabled: Boolean(emailRemindersEnabled),
        dailyEmailReminder: Boolean(dailyEmailReminder),
        weeklyProgressEmail: Boolean(weeklyProgressEmail),
        achievementNotifications: Boolean(achievementNotifications),
        reminderTime: reminderTime || '09:00',
        weeklyGoal: Math.max(1, Math.min(50, parseInt(weeklyGoal) || 5)),
        preferredDifficulty: preferredDifficulty || 'Medium',
        studyTimeGoal: Math.max(15, Math.min(480, parseInt(studyTimeGoal) || 60))
      },
      { 
        new: true, 
        upsert: true 
      }
    )

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
