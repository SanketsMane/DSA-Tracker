import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { User } from '@/models/User'
import Chapter from '@/models/Chapter'
import UserPreferences from '@/models/UserPreferences'

// GET /api/achievements - Get achievements for user
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

    // Get user data
    const problems = await Problem.find({ userId: user._id })
    const chapters = await Chapter.find({ userId: user._id })
    const userPrefs = await UserPreferences.findOne({ userId: user._id })

    const completedProblems = problems.filter(p => p.status === 'Completed').length
    const easyProblems = problems.filter(p => p.difficulty === 'Easy' && p.status === 'Completed').length
    const mediumProblems = problems.filter(p => p.difficulty === 'Medium' && p.status === 'Completed').length
    const hardProblems = problems.filter(p => p.difficulty === 'Hard' && p.status === 'Completed').length
    const completedChapters = chapters.filter(c => c.isCompleted).length
    const currentStreak = userPrefs?.currentStreak || 0

    // Define achievements
    const achievements = [
      {
        _id: '1',
        title: 'First Steps',
        description: 'Solve your first problem',
        icon: 'target',
        category: 'milestones',
        difficulty: 'bronze',
        requirement: 1,
        progress: Math.min(completedProblems, 1),
        isUnlocked: completedProblems >= 1,
        unlockedAt: completedProblems >= 1 ? new Date().toISOString() : undefined,
        points: 10
      },
      {
        _id: '2',
        title: 'Problem Solver',
        description: 'Solve 10 problems',
        icon: 'trophy',
        category: 'milestones',
        difficulty: 'bronze',
        requirement: 10,
        progress: Math.min(completedProblems, 10),
        isUnlocked: completedProblems >= 10,
        unlockedAt: completedProblems >= 10 ? new Date().toISOString() : undefined,
        points: 50
      },
      {
        _id: '3',
        title: 'Dedicated Learner',
        description: 'Solve 50 problems',
        icon: 'award',
        category: 'milestones',
        difficulty: 'silver',
        requirement: 50,
        progress: Math.min(completedProblems, 50),
        isUnlocked: completedProblems >= 50,
        unlockedAt: completedProblems >= 50 ? new Date().toISOString() : undefined,
        points: 200
      },
      {
        _id: '4',
        title: 'Algorithm Master',
        description: 'Solve 100 problems',
        icon: 'crown',
        category: 'milestones',
        difficulty: 'gold',
        requirement: 100,
        progress: Math.min(completedProblems, 100),
        isUnlocked: completedProblems >= 100,
        unlockedAt: completedProblems >= 100 ? new Date().toISOString() : undefined,
        points: 500
      },
      {
        _id: '5',
        title: 'Easy Rider',
        description: 'Solve 25 easy problems',
        icon: 'star',
        category: 'problem-solving',
        difficulty: 'bronze',
        requirement: 25,
        progress: Math.min(easyProblems, 25),
        isUnlocked: easyProblems >= 25,
        unlockedAt: easyProblems >= 25 ? new Date().toISOString() : undefined,
        points: 75
      },
      {
        _id: '6',
        title: 'Medium Champion',
        description: 'Solve 25 medium problems',
        icon: 'medal',
        category: 'problem-solving',
        difficulty: 'silver',
        requirement: 25,
        progress: Math.min(mediumProblems, 25),
        isUnlocked: mediumProblems >= 25,
        unlockedAt: mediumProblems >= 25 ? new Date().toISOString() : undefined,
        points: 150
      },
      {
        _id: '7',
        title: 'Hard Core',
        description: 'Solve 25 hard problems',
        icon: 'crown',
        category: 'problem-solving',
        difficulty: 'gold',
        requirement: 25,
        progress: Math.min(hardProblems, 25),
        isUnlocked: hardProblems >= 25,
        unlockedAt: hardProblems >= 25 ? new Date().toISOString() : undefined,
        points: 300
      },
      {
        _id: '8',
        title: 'Streak Starter',
        description: 'Maintain a 7-day solving streak',
        icon: 'calendar',
        category: 'streaks',
        difficulty: 'bronze',
        requirement: 7,
        progress: Math.min(currentStreak, 7),
        isUnlocked: currentStreak >= 7,
        unlockedAt: currentStreak >= 7 ? new Date().toISOString() : undefined,
        points: 100
      },
      {
        _id: '9',
        title: 'Consistency King',
        description: 'Maintain a 30-day solving streak',
        icon: 'medal',
        category: 'streaks',
        difficulty: 'gold',
        requirement: 30,
        progress: Math.min(currentStreak, 30),
        isUnlocked: currentStreak >= 30,
        unlockedAt: currentStreak >= 30 ? new Date().toISOString() : undefined,
        points: 800
      },
      {
        _id: '10',
        title: 'Chapter Master',
        description: 'Complete 5 chapters',
        icon: 'target',
        category: 'consistency',
        difficulty: 'silver',
        requirement: 5,
        progress: Math.min(completedChapters, 5),
        isUnlocked: completedChapters >= 5,
        unlockedAt: completedChapters >= 5 ? new Date().toISOString() : undefined,
        points: 400
      }
    ]

    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
