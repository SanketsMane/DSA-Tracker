'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Award, Star, Target, Zap, Calendar, Medal, Crown } from 'lucide-react'

interface Achievement {
  _id: string
  title: string
  description: string
  icon: string
  category: 'problem-solving' | 'streaks' | 'milestones' | 'speed' | 'consistency'
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum'
  requirement: number
  progress: number
  isUnlocked: boolean
  unlockedAt?: string
  points: number
}

interface UserStats {
  totalPoints: number
  totalAchievements: number
  unlockedAchievements: number
  currentStreak: number
  longestStreak: number
  totalProblems: number
  currentLevel: number
  nextLevelPoints: number
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchAchievements()
    fetchUserStats()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achievements')
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      } else {
        setAchievements([])
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      setAchievements([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      } else {
        setUserStats({
          totalPoints: 0,
          totalAchievements: 0,
          unlockedAchievements: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalProblems: 0,
          currentLevel: 1,
          nextLevelPoints: 100
        })
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      setUserStats({
        totalPoints: 0,
        totalAchievements: 0,
        unlockedAchievements: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalProblems: 0,
        currentLevel: 1,
        nextLevelPoints: 100
      })
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy
      case 'award': return Award
      case 'star': return Star
      case 'target': return Target
      case 'zap': return Zap
      case 'calendar': return Calendar
      case 'medal': return Medal
      case 'crown': return Crown
      default: return Trophy
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestones': return 'bg-blue-100 text-blue-800'
      case 'streaks': return 'bg-green-100 text-green-800'
      case 'speed': return 'bg-red-100 text-red-800'
      case 'consistency': return 'bg-purple-100 text-purple-800'
      case 'problem-solving': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100)
  }

  const categories = ['milestones', 'streaks', 'speed', 'consistency', 'problem-solving']

  const filteredAchievements = achievements.filter(achievement => 
    !selectedCategory || achievement.category === selectedCategory
  )

  if (loading) {
    return <div className="text-center py-8">Loading achievements...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your progress and unlock rewards
          </p>
        </div>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalPoints}</p>
                  <p className="text-xs text-gray-500">Level {userStats.currentLevel}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {userStats.nextLevelPoints - userStats.totalPoints} points to next level
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Achievements</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStats.unlockedAchievements}/{userStats.totalAchievements}
                  </p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.currentStreak} days</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Problems Solved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalProblems}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const IconComponent = getIcon(achievement.icon)
          const progressPercentage = getProgressPercentage(achievement.progress, achievement.requirement)
          
          return (
            <Card 
              key={achievement._id} 
              className={`relative overflow-hidden transition-all duration-200 ${
                achievement.isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
                  : 'hover:shadow-md'
              }`}
            >
              {achievement.isUnlocked && (
                <div className="absolute top-2 right-2">
                  <div className="bg-yellow-500 text-white p-1 rounded-full">
                    <Trophy className="h-4 w-4" />
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-full ${
                    achievement.isUnlocked ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      achievement.isUnlocked ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-lg ${
                      achievement.isUnlocked ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </CardTitle>
                    <p className={`text-sm mt-1 ${
                      achievement.isUnlocked ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getDifficultyColor(achievement.difficulty)} variant="outline">
                    {achievement.difficulty}
                  </Badge>
                  <Badge className={getCategoryColor(achievement.category)} variant="secondary">
                    {achievement.category.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {achievement.points} pts
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {achievement.progress} / {achievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          achievement.isUnlocked ? 'bg-yellow-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {progressPercentage.toFixed(1)}% complete
                    </p>
                  </div>

                  {/* Unlock Date */}
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="bg-yellow-50 p-2 rounded-md">
                      <p className="text-xs text-yellow-800">
                        🎉 Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Remaining Progress */}
                  {!achievement.isUnlocked && (
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-600">
                        {achievement.requirement - achievement.progress} more to unlock
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAchievements.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {selectedCategory ? 'No achievements in this category' : 'No achievements yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {selectedCategory 
                  ? 'Try exploring other categories to see available achievements.'
                  : 'Start solving problems to unlock your first achievements and earn points!'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
