import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { User } from '@/models/User'
import Chapter from '@/models/Chapter'
import UserPreferences from '@/models/UserPreferences'

// GET /api/user/stats - Get user statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user preferences
    let userPrefs = await UserPreferences.findOne({ userId: user._id })
    if (!userPrefs) {
      userPrefs = new UserPreferences({ userId: user._id })
      await userPrefs.save()
    }

    // Get all problems and chapters
    const problems = await Problem.find({ userId: user._id })
    const chapters = await Chapter.find({ userId: user._id })

    // Calculate stats
    const totalProblems = problems.length
    const completedProblems = problems.filter(p => p.status === 'Completed').length
    const completionRate = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0
    const totalChapters = chapters.length
    const completedChapters = chapters.filter(c => c.isCompleted).length

    // Calculate total time spent (in minutes)
    const totalTimeSpent = problems.reduce((total, problem) => {
      return total + (problem.timeSpent || 0)
    }, 0)

    // Calculate weekly goal progress (assuming weekly goal is number of problems)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const problemsThisWeek = problems.filter(p => 
      p.status === 'Completed' && 
      p.completedAt && 
      new Date(p.completedAt) >= oneWeekAgo
    ).length
    
    const weeklyGoal = userPrefs.weeklyGoal || 5
    const weeklyGoalProgress = (problemsThisWeek / weeklyGoal) * 100

    // Calculate level based on points
    const basePointsPerLevel = 100
    const currentLevel = Math.floor(userPrefs.totalPoints / basePointsPerLevel) + 1
    const nextLevelPoints = currentLevel * basePointsPerLevel

    const stats = {
      // Stats for StatsCards component
      totalProblems,
      completedProblems,
      completionRate,
      currentStreak: userPrefs.currentStreak || 0,
      totalTimeSpent, // in minutes
      weeklyGoalProgress,
      
      // Additional stats
      totalPoints: userPrefs.totalPoints || 0,
      totalAchievements: 10, // This should be dynamically calculated based on actual achievements
      unlockedAchievements: 0, // This should be dynamically calculated
      longestStreak: userPrefs.longestStreak || 0,
      totalChapters,
      completedChapters,
      currentLevel,
      nextLevelPoints
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
