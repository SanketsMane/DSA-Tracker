'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Target, Plus, Edit2, Trash2, CheckCircle, Clock, Calendar, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Goal {
  _id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  target: number
  current: number
  unit: string
  deadline: string
  status: 'active' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

const goalTypes = ['daily', 'weekly', 'monthly', 'yearly'] as const
const priorities = ['low', 'medium', 'high'] as const
const statuses = ['active', 'completed', 'paused'] as const

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const [formData, setFormData] = useState<{
    title: string
    description: string
    type: 'daily' | 'weekly' | 'monthly' | 'yearly'
    target: string
    unit: string
    deadline: string
    priority: 'low' | 'medium' | 'high'
  }>({
    title: '',
    description: '',
    type: 'weekly',
    target: '',
    unit: 'problems',
    deadline: '',
    priority: 'medium'
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/goals')
      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      } else {
        setGoals([])
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!formData.title || !formData.target || !formData.deadline) {
        alert('Please fill in all required fields')
        return
      }

      const goalData = {
        ...formData,
        target: parseInt(formData.target),
        current: editingGoal?.current || 0,
        status: editingGoal?.status || 'active'
      }

      // Here you would make API call to save goal
      console.log('Saving goal:', goalData)
      
      await fetchGoals()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving goal:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      // Here you would make API call to delete goal
      setGoals(prev => prev.filter(goal => goal._id !== id))
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const updateProgress = async (goalId: string, newCurrent: number) => {
    try {
      setGoals(prev => prev.map(goal => 
        goal._id === goalId 
          ? { 
              ...goal, 
              current: newCurrent,
              status: newCurrent >= goal.target ? 'completed' : goal.status
            }
          : goal
      ))
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const toggleStatus = async (goalId: string) => {
    try {
      setGoals(prev => prev.map(goal => 
        goal._id === goalId 
          ? { 
              ...goal, 
              status: goal.status === 'active' ? 'paused' : 'active'
            }
          : goal
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'weekly',
      target: '',
      unit: 'problems',
      deadline: '',
      priority: 'medium'
    })
    setEditingGoal(null)
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      type: goal.type,
      target: goal.target.toString(),
      unit: goal.unit,
      deadline: goal.deadline,
      priority: goal.priority
    })
    setIsDialogOpen(true)
  }

  const filteredGoals = goals.filter(goal => {
    const matchesStatus = !filterStatus || goal.status === filterStatus
    const matchesType = !filterType || goal.type === filterType
    return matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysLeft = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Set and track your learning objectives
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Daily Coding Practice"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, type: value as typeof formData.type }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, priority: value as typeof formData.priority }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority} className="capitalize">{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target">Target *</Label>
                  <Input
                    id="target"
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="problems"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingGoal ? 'Update' : 'Create'} Goal
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter(g => g.status === 'active').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter(g => g.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={filterStatus || "all"} onValueChange={(value: string) => setFilterStatus(value === "all" ? "" : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterType || "all"} onValueChange={(value: string) => setFilterType(value === "all" ? "" : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {goalTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      {loading ? (
        <div className="text-center py-8">Loading goals...</div>
      ) : filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {filterStatus || filterType ? 'No matching goals' : 'No goals set yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {filterStatus || filterType 
                  ? 'Try adjusting your filters to find what you\'re looking for.'
                  : 'Set your first goal to start tracking your DSA learning progress.'
                }
              </p>
              {!filterStatus && !filterType && (
                <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your First Goal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.current, goal.target)
            const daysLeft = getDaysLeft(goal.deadline)
            
            return (
              <Card key={goal._id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      {goal.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(goal)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(goal._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className={getStatusColor(goal.status)} variant="secondary">
                      {goal.status}
                    </Badge>
                    <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                      {goal.priority} priority
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {goal.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {progressPercentage.toFixed(1)}% complete
                      </p>
                    </div>

                    {/* Update Progress */}
                    {goal.status === 'active' && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Update progress"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = parseInt(e.currentTarget.value)
                              if (value >= 0) {
                                updateProgress(goal._id, value)
                                e.currentTarget.value = ''
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(goal._id)}
                        >
                          {goal.status === 'active' ? 'Pause' : 'Resume'}
                        </Button>
                      </div>
                    )}

                    {/* Deadline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <span className={`font-medium ${daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                         daysLeft === 0 ? 'Due today' : 
                         `${daysLeft} days left`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
