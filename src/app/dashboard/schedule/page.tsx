'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Task {
  _id: string
  date: string
  tasks: string[]
  notes?: string
  completed: boolean
  createdAt: string
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    date: '',
    tasks: [''],
    notes: ''
  })

  useEffect(() => {
    fetchSchedules()
  }, [selectedDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/schedule?month=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const filteredTasks = formData.tasks.filter(task => task.trim() !== '')
      
      if (filteredTasks.length === 0) {
        alert('Please add at least one task')
        return
      }

      const url = editingSchedule ? `/api/schedule/${editingSchedule._id}` : '/api/schedule'
      const method = editingSchedule ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tasks: filteredTasks
        })
      })

      if (response.ok) {
        await fetchSchedules()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      const response = await fetch(`/api/schedule/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchSchedules()
      }
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  const toggleComplete = async (schedule: Task) => {
    try {
      const response = await fetch(`/api/schedule/${schedule._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !schedule.completed })
      })

      if (response.ok) {
        await fetchSchedules()
      }
    } catch (error) {
      console.error('Error updating schedule:', error)
    }
  }

  const resetForm = () => {
    setFormData({ date: '', tasks: [''], notes: '' })
    setEditingSchedule(null)
  }

  const openEditDialog = (schedule: Task) => {
    setEditingSchedule(schedule)
    setFormData({
      date: schedule.date.split('T')[0],
      tasks: schedule.tasks,
      notes: schedule.notes || ''
    })
    setIsDialogOpen(true)
  }

  const addTaskField = () => {
    setFormData(prev => ({ ...prev, tasks: [...prev.tasks, ''] }))
  }

  const updateTask = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }))
  }

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Plan and track your study sessions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label>Tasks</Label>
                {formData.tasks.map((task, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={task}
                      onChange={(e) => updateTask(index, e.target.value)}
                      placeholder={`Task ${index + 1}`}
                    />
                    {formData.tasks.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTask(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTaskField}
                  className="mt-2"
                >
                  Add Task
                </Button>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSchedule ? 'Update' : 'Create'} Schedule
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Schedules</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Input
                type="month"
                value={selectedDate.slice(0, 7)}
                onChange={(e) => setSelectedDate(e.target.value + '-01')}
                className="w-auto"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading schedules...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No schedules found for this month. Create your first schedule!
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {new Date(schedule.date).toLocaleDateString()}
                        </h3>
                        <Badge 
                          variant={schedule.completed ? "default" : "secondary"}
                          className={schedule.completed ? "bg-green-100 text-green-800" : ""}
                        >
                          {schedule.completed ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 mb-2">
                        {schedule.tasks.map((task, index) => (
                          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {task}
                          </div>
                        ))}
                      </div>
                      
                      {schedule.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {schedule.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleComplete(schedule)}
                      >
                        {schedule.completed ? 'Mark Pending' : 'Mark Complete'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(schedule)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(schedule._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
