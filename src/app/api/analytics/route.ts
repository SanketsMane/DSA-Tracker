import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { User } from '@/models/User'
import Chapter from '@/models/Chapter'
import UserPreferences from '@/models/UserPreferences'

// GET /api/analytics - Get analytics data for user
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

    // Get all problems for the user
    const problems = await Problem.find({ userId: user._id })
    const chapters = await Chapter.find({ userId: user._id })
    const userPrefs = await UserPreferences.findOne({ userId: user._id })

    // Calculate basic stats
    const totalProblems = problems.length
    const completedProblems = problems.filter(p => p.status === 'Completed').length
    const inProgressProblems = problems.filter(p => p.status === 'In Progress').length
    
    // Difficulty breakdown
    const difficultyBreakdown = {
      easy: problems.filter(p => p.difficulty === 'Easy' && p.status === 'Completed').length,
      medium: problems.filter(p => p.difficulty === 'Medium' && p.status === 'Completed').length,
      hard: problems.filter(p => p.difficulty === 'Hard' && p.status === 'Completed').length
    }

    // Weekly progress (last 7 days)
    const weeklyProgress = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const solved = problems.filter(p => 
        p.completedAt && 
        p.completedAt.toISOString().split('T')[0] === dateStr
      ).length
      
      weeklyProgress.push({
        date: dateStr,
        solved
      })
    }

    // Topic progress from chapters
    const topicProgress = chapters.map(chapter => ({
      topic: chapter.title,
      solved: chapter.topics.filter((t: any) => t.isCompleted).length,
      total: chapter.topics.length
    }))

    // Monthly goals (last 3 months)
    const monthlyGoals = []
    for (let i = 2; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'long' })
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const achieved = problems.filter(p => 
        p.completedAt && 
        p.completedAt >= monthStart && 
        p.completedAt <= monthEnd
      ).length
      
      monthlyGoals.push({
        month: monthName,
        target: 30, // Default target, could be made dynamic
        achieved
      })
    }

    const analytics = {
      totalProblems,
      completedProblems,
      inProgressProblems,
      streakDays: userPrefs?.currentStreak || 0,
      completionRate: totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0,
      difficultyBreakdown,
      weeklyProgress,
      topicProgress,
      monthlyGoals,
      chaptersCompleted: chapters.filter(c => c.isCompleted).length,
      totalChapters: chapters.length
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
