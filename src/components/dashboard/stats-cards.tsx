'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react'

interface UserStats {
  totalProblems: number
  completedProblems: number
  currentStreak: number
  totalTimeSpent: number
  weeklyGoalProgress: number
  completionRate: number
}

export function StatsCards() {
  const [stats, setStats] = useState<UserStats>({
    totalProblems: 0,
    completedProblems: 0,
    currentStreak: 0,
    totalTimeSpent: 0,
    weeklyGoalProgress: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    if (!minutes || isNaN(minutes)) {
      return '0h 0m'
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const statsData = [
    {
      title: 'Problems Solved',
      value: loading ? '...' : `${stats.completedProblems}`,
      change: loading ? '...' : `${(stats.completionRate || 0).toFixed(1)}% completion rate`,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Current Streak',
      value: loading ? '...' : `${stats.currentStreak} days`,
      change: loading ? '...' : stats.currentStreak > 0 ? 'Keep it up!' : 'Start your streak',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'Time Spent',
      value: loading ? '...' : formatTime(stats.totalTimeSpent),
      change: loading ? '...' : 'This week',
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Weekly Goal',
      value: loading ? '...' : `${Math.round(stats.weeklyGoalProgress || 0)}%`,
      change: loading ? '...' : (stats.weeklyGoalProgress || 0) >= 100 ? 'Goal achieved!' : 'Keep going!',
      icon: Target,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
