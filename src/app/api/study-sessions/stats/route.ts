import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'
import mongoose from 'mongoose'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

// Study Session Schema (same as in route.ts)
const studySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  duration: { type: Number, required: true },
  topics: [{ type: String }],
  notes: { type: String },
  problemsSolved: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Mixed'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema)

// GET /api/study-sessions/stats - Get user's study statistics
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

    const today = format(new Date(), 'yyyy-MM-dd')
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd')
    const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd')
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')

    // Get all user's study sessions
    const allSessions = await StudySession.find({ userId: user._id })

    // Today's stats
    const todaySession = allSessions.find(s => s.date === today)
    const todayDuration = todaySession?.duration || 0
    const todayProblems = todaySession?.problemsSolved || 0

    // Yesterday's stats
    const yesterdaySession = allSessions.find(s => s.date === yesterday)
    const yesterdayDuration = yesterdaySession?.duration || 0

    // This week's stats
    const thisWeekSessions = allSessions.filter(s => s.date >= weekStart && s.date <= weekEnd)
    const weekDuration = thisWeekSessions.reduce((total, session) => total + session.duration, 0)
    const weekProblems = thisWeekSessions.reduce((total, session) => total + session.problemsSolved, 0)

    // Last 30 days stats
    const last30DaysSessions = allSessions.filter(s => s.date >= thirtyDaysAgo)
    const monthDuration = last30DaysSessions.reduce((total, session) => total + session.duration, 0)
    const monthProblems = last30DaysSessions.reduce((total, session) => total + session.problemsSolved, 0)

    // All time stats
    const totalDuration = allSessions.reduce((total, session) => total + session.duration, 0)
    const totalProblems = allSessions.reduce((total, session) => total + session.problemsSolved, 0)
    const totalSessions = allSessions.length

    // Streak calculation
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    // Generate dates from today backwards
    const dates = []
    for (let i = 0; i < 365; i++) {
      dates.push(format(subDays(new Date(), i), 'yyyy-MM-dd'))
    }

    let streakBroken = false
    for (const date of dates) {
      const hasSession = allSessions.some(s => s.date === date)
      
      if (hasSession) {
        tempStreak++
        if (!streakBroken) {
          currentStreak++
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
        }
        tempStreak = 0
        streakBroken = true
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
    }

    // Weekly chart data (last 7 days)
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      const daySession = allSessions.find(s => s.date === date)
      weeklyData.push({
        date,
        duration: daySession?.duration || 0,
        problems: daySession?.problemsSolved || 0
      })
    }

    // Top topics
    const topicCounts: { [key: string]: number } = {}
    allSessions.forEach(session => {
      session.topics.forEach((topic: string) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1
      })
    })

    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))

    const stats = {
      daily: {
        today: todayDuration,
        yesterday: yesterdayDuration,
        change: yesterdayDuration > 0 ? ((todayDuration - yesterdayDuration) / yesterdayDuration * 100) : 0,
        problemsToday: todayProblems
      },
      weekly: {
        duration: weekDuration,
        problems: weekProblems,
        sessions: thisWeekSessions.length
      },
      monthly: {
        duration: monthDuration,
        problems: monthProblems,
        sessions: last30DaysSessions.length
      },
      allTime: {
        duration: totalDuration,
        problems: totalProblems,
        sessions: totalSessions
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      chart: {
        weekly: weeklyData
      },
      topTopics
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching study session stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
