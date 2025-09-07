'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line } from 'react-chartjs-2'
import { TrendingUp } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyticsData {
  labels: string[]
  problemsSolved: number[]
  studyHours: number[]
}

export function ProgressChart() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    labels: [],
    problemsSolved: [],
    studyHours: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?period=week')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const data = {
    labels: analytics.labels && analytics.labels.length > 0 ? analytics.labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Problems Solved',
        data: analytics.problemsSolved && analytics.problemsSolved.length > 0 ? analytics.problemsSolved : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Study Hours',
        data: analytics.studyHours && analytics.studyHours.length > 0 ? analytics.studyHours : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // Check if there's any actual data
  const hasData = (analytics.problemsSolved && analytics.problemsSolved.some(value => value > 0)) || 
                  (analytics.studyHours && analytics.studyHours.some(value => value > 0))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : !hasData ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No progress data yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start solving problems and tracking study time to see your progress chart.
            </p>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </CardContent>
    </Card>
  )
}
