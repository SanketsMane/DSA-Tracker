'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Target,
  Play,
  Award,
  Calendar,
  Link
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Topic {
  name: string
  totalProblems: number
  completedProblems: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  isCompleted: boolean
}

interface Resource {
  title: string
  url: string
  type: 'video' | 'article' | 'book' | 'course'
}

interface Chapter {
  _id: string
  title: string
  description: string
  topics: Topic[]
  order: number
  estimatedDays: number
  prerequisites: any[]
  resources: Resource[]
  progress: number
  isCompleted: boolean
  startedAt?: string
  completedAt?: string
  createdAt: string
}

const difficulties = ['Easy', 'Medium', 'Hard'] as const
const resourceTypes = ['video', 'article', 'book', 'course'] as const

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    estimatedDays: number
    topics: { name: string; totalProblems: number; difficulty: 'Easy' | 'Medium' | 'Hard' }[]
    resources: { title: string; url: string; type: 'video' | 'article' | 'book' | 'course' }[]
  }>({
    title: '',
    description: '',
    estimatedDays: 7,
    topics: [{ name: '', totalProblems: 0, difficulty: 'Medium' }],
    resources: [{ title: '', url: '', type: 'article' }]
  })

  useEffect(() => {
    fetchChapters()
  }, [])

  const fetchChapters = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chapters')
      if (response.ok) {
        const data = await response.json()
        setChapters(data)
      } else {
        setChapters([])
      }
    } catch (error) {
      console.error('Error fetching chapters:', error)
      setChapters([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const filteredTopics = formData.topics.filter(topic => topic.name.trim() !== '')
      const filteredResources = formData.resources.filter(resource => 
        resource.title.trim() !== '' && resource.url.trim() !== ''
      )

      if (!formData.title || filteredTopics.length === 0) {
        alert('Please fill in the title and at least one topic')
        return
      }

      const chapterData = {
        ...formData,
        topics: filteredTopics.map(topic => ({
          ...topic,
          completedProblems: 0,
          isCompleted: false
        })),
        resources: filteredResources
      }

      const url = editingChapter ? `/api/chapters/${editingChapter._id}` : '/api/chapters'
      const method = editingChapter ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chapterData)
      })

      if (response.ok) {
        await fetchChapters()
        setIsDialogOpen(false)
        resetForm()
      } else {
        alert('Error saving chapter')
      }
    } catch (error) {
      console.error('Error saving chapter:', error)
      alert('Error saving chapter')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return

    try {
      const response = await fetch(`/api/chapters/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchChapters()
      } else {
        alert('Error deleting chapter')
      }
    } catch (error) {
      console.error('Error deleting chapter:', error)
      alert('Error deleting chapter')
    }
  }

  const updateTopicProgress = async (chapterId: string, topicIndex: number, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicIndex, isCompleted })
      })

      if (response.ok) {
        await fetchChapters()
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      estimatedDays: 7,
      topics: [{ name: '', totalProblems: 0, difficulty: 'Medium' }],
      resources: [{ title: '', url: '', type: 'article' }]
    })
    setEditingChapter(null)
  }

  const openEditDialog = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setFormData({
      title: chapter.title,
      description: chapter.description,
      estimatedDays: chapter.estimatedDays,
      topics: chapter.topics.map(topic => ({
        name: topic.name,
        totalProblems: topic.totalProblems,
        difficulty: topic.difficulty
      })),
      resources: chapter.resources.length > 0 ? chapter.resources.map(resource => ({
        title: resource.title,
        url: resource.url,
        type: resource.type
      })) : [{ title: '', url: '', type: 'article' }]
    })
    setIsDialogOpen(true)
  }

  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, { name: '', totalProblems: 0, difficulty: 'Medium' }]
    }))
  }

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', url: '', type: 'article' }]
    }))
  }

  const updateTopic = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.map((topic, i) => 
        i === index ? { ...topic, [field]: value } : topic
      )
    }))
  }

  const updateResource = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }))
  }

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }))
  }

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥'
      case 'article': return '📄'
      case 'book': return '📚'
      case 'course': return '🎓'
      default: return '📄'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DSA Chapters</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Organize your learning journey with structured chapters
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Chapter Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Arrays and Strings"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDays">Estimated Days</Label>
                  <Input
                    id="estimatedDays"
                    type="number"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: parseInt(e.target.value) }))}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this chapter covers..."
                  rows={3}
                />
              </div>

              {/* Topics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Topics *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTopic}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Topic
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.topics.map((topic, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Input
                          value={topic.name}
                          onChange={(e) => updateTopic(index, 'name', e.target.value)}
                          placeholder="Topic name"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={topic.totalProblems}
                          onChange={(e) => updateTopic(index, 'totalProblems', parseInt(e.target.value) || 0)}
                          placeholder="Problems"
                          min="0"
                        />
                      </div>
                      <div className="col-span-3">
                        <Select 
                          value={topic.difficulty} 
                          onValueChange={(value) => updateTopic(index, 'difficulty', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map(diff => (
                              <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        {formData.topics.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeTopic(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Learning Resources</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addResource}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Resource
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.resources.map((resource, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-4">
                        <Input
                          value={resource.title}
                          onChange={(e) => updateResource(index, 'title', e.target.value)}
                          placeholder="Resource title"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={resource.url}
                          onChange={(e) => updateResource(index, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="col-span-2">
                        <Select 
                          value={resource.type} 
                          onValueChange={(value) => updateResource(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {resourceTypes.map(type => (
                              <SelectItem key={type} value={type} className="capitalize">
                                {getResourceIcon(type)} {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeResource(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingChapter ? 'Update' : 'Create'} Chapter
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

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Chapters</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chapters.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {chapters.filter(c => c.isCompleted).length}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {chapters.filter(c => c.startedAt && !c.isCompleted).length}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {chapters.length > 0 ? Math.round(chapters.reduce((acc, c) => acc + c.progress, 0) / chapters.length) : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapters List */}
      {loading ? (
        <div className="text-center py-8">Loading chapters...</div>
      ) : chapters.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No chapters yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first chapter to start organizing your DSA learning journey.
              </p>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Chapter
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {chapters.map((chapter) => (
            <Card key={chapter._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{chapter.title}</CardTitle>
                      <Badge variant={chapter.isCompleted ? "default" : chapter.startedAt ? "secondary" : "outline"}>
                        {chapter.isCompleted ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : chapter.startedAt ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Not Started
                          </>
                        )}
                      </Badge>
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {chapter.description}
                      </p>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{chapter.progress}%</span>
                      </div>
                      <Progress value={chapter.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{chapter.estimatedDays} days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{chapter.topics.length} topics</span>
                      </div>
                      {chapter.startedAt && (
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          <span>Started {new Date(chapter.startedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(chapter)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(chapter._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Topics */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Topics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {chapter.topics.map((topic, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{topic.name}</h5>
                          <button
                            onClick={() => updateTopicProgress(chapter._id, index, !topic.isCompleted)}
                            className={`p-1 rounded ${
                              topic.isCompleted 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-200 text-gray-400 hover:bg-green-100 hover:text-green-600'
                            }`}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <Badge className={getDifficultyColor(topic.difficulty)} variant="secondary">
                            {topic.difficulty}
                          </Badge>
                          <span className="text-gray-500">
                            {topic.completedProblems}/{topic.totalProblems} problems
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                {chapter.resources.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Learning Resources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chapter.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-lg">{getResourceIcon(resource.type)}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{resource.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                          </div>
                          <Link className="h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
