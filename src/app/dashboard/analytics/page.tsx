'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Calendar, CheckCircle, BarChart3, PieChart, Activity } from 'lucide-react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
)

interface Analytics {
  totalProblems: number
  completedProblems: number
  streakDays: number
  completionRate: number
  difficultyBreakdown: { easy: number; medium: number; hard: number }
  weeklyProgress: { date: string; solved: number }[]
  topicProgress: { topic: string; solved: number; total: number }[]
  monthlyGoals: { month: string; target: number; achieved: number }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchAnalytics()
  }, [timeFrame])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        // No analytics data available yet
        setAnalytics({
          totalProblems: 0,
          completedProblems: 0,
          streakDays: 0,
          completionRate: 0,
          difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
          weeklyProgress: [],
          topicProgress: [],
          monthlyGoals: []
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Default empty state
      setAnalytics({
        totalProblems: 0,
        completedProblems: 0,
        streakDays: 0,
        completionRate: 0,
        difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
        weeklyProgress: [],
        topicProgress: [],
        monthlyGoals: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No analytics data</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start solving problems to see your analytics and progress.
        </p>
      </div>
    )
  }

  // Check if user has any data
  const hasData = analytics.totalProblems > 0

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your progress and performance
          </p>
        </div>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No data to analyze yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start solving problems and your analytics will appear here automatically.
              </p>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Start Solving Problems
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progressData = {
    labels: analytics.weeklyProgress.map(p => new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Problems Solved',
        data: analytics.weeklyProgress.map(p => p.solved),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [analytics.difficultyBreakdown.easy, analytics.difficultyBreakdown.medium, analytics.difficultyBreakdown.hard],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  }

  const topicData = {
    labels: analytics.topicProgress.map(t => t.topic),
    datasets: [
      {
        label: 'Solved',
        data: analytics.topicProgress.map(t => t.solved),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Remaining',
        data: analytics.topicProgress.map(t => t.total - t.solved),
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your progress and performance
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={timeFrame === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFrame(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Problems</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalProblems}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completedProblems}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.streakDays} days</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={progressData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Difficulty Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={difficultyData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Progress and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Topic Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={topicData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.month}</span>
                    <span className="text-sm text-gray-600">
                      {goal.achieved}/{goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((goal.achieved / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <Badge variant={goal.achieved >= goal.target ? "default" : "secondary"}>
                      {goal.achieved >= goal.target ? "Completed" : "In Progress"}
                    </Badge>
                    <span className="text-gray-500">
                      {((goal.achieved / goal.target) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Topic Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topicProgress.map((topic, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{topic.topic}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">
                    {topic.solved}/{topic.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(topic.solved / topic.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((topic.solved / topic.total) * 100).toFixed(1)}% complete
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
