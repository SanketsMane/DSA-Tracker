'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Code, Calendar, Activity, Clock, Target } from 'lucide-react'

interface ActivityItem {
  _id: string
  type: 'problem' | 'goal' | 'snippet' | 'achievement'
  title: string
  description?: string
  status?: string
  difficulty?: string
  createdAt: string
  updatedAt: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent data from multiple endpoints
      const [problemsRes, goalsRes, snippetsRes, achievementsRes] = await Promise.all([
        fetch('/api/problems?limit=3'),
        fetch('/api/goals?limit=2'),
        fetch('/api/snippets?limit=2'),
        fetch('/api/achievements?limit=2')
      ])

      const activities: ActivityItem[] = []

      if (problemsRes.ok) {
        const problemsData = await problemsRes.json()
        const problems = Array.isArray(problemsData) ? problemsData : problemsData.problems || []
        problems.forEach((problem: any) => {
          activities.push({
            _id: problem._id,
            type: 'problem',
            title: problem.title,
            status: problem.status,
            difficulty: problem.difficulty,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt || problem.createdAt
          })
        })
      } else {
        console.log('Problems API failed:', await problemsRes.text())
      }

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json()
        const goals = Array.isArray(goalsData) ? goalsData : []
        goals.forEach((goal: any) => {
          activities.push({
            _id: goal._id,
            type: 'goal',
            title: goal.title,
            description: goal.description,
            status: goal.status,
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt || goal.createdAt
          })
        })
      } else {
        console.log('Goals API failed:', await goalsRes.text())
      }

      if (snippetsRes.ok) {
        const snippetsData = await snippetsRes.json()
        const snippets = Array.isArray(snippetsData) ? snippetsData : []
        snippets.forEach((snippet: any) => {
          activities.push({
            _id: snippet._id,
            type: 'snippet',
            title: snippet.title,
            description: snippet.description,
            createdAt: snippet.createdAt,
            updatedAt: snippet.updatedAt || snippet.createdAt
          })
        })
      } else {
        console.log('Snippets API failed:', await snippetsRes.text())
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json()
        const achievements = Array.isArray(achievementsData) ? achievementsData : []
        achievements.forEach((achievement: any) => {
          activities.push({
            _id: achievement._id,
            type: 'achievement',
            title: achievement.title,
            description: achievement.description,
            createdAt: achievement.createdAt,
            updatedAt: achievement.updatedAt || achievement.createdAt
          })
        })
      } else {
        console.log('Achievements API failed:', await achievementsRes.text())
      }

      // Sort by most recent and take top 5
      activities.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setActivities(activities.slice(0, 5))
      
      console.log('Recent activities:', activities)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'problem': return CheckCircle
      case 'goal': return Target
      case 'snippet': return Code
      case 'achievement': return Activity
      default: return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Not Started':
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No recent activity</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start solving problems, creating goals, or saving code snippets to see your activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type)
              return (
                <div key={activity._id} className="flex items-center space-x-4">
                  <IconComponent className="h-8 w-8 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                      {activity.status && (
                        <Badge variant="secondary" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                      {activity.difficulty && (
                        <Badge variant="outline" className={getDifficultyColor(activity.difficulty)}>
                          {activity.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgo(activity.updatedAt)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
