'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Plus, Edit2, Trash2, Copy, Search, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface CodeSnippet {
  _id: string
  title: string
  description: string
  code: string
  language: string
  topic: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  createdAt: string
  updatedAt: string
}

const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust', 'TypeScript']
const topics = ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching', 'Strings', 'Math']
const difficulties = ['Easy', 'Medium', 'Hard'] as const

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLanguage, setFilterLanguage] = useState<string>('')
  const [filterTopic, setFilterTopic] = useState<string>('')
  const [formData, setFormData] = useState<{
    title: string
    description: string
    code: string
    language: string
    topic: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    tags: string
  }>({
    title: '',
    description: '',
    code: '',
    language: '',
    topic: '',
    difficulty: 'Medium',
    tags: ''
  })

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/snippets')
      if (response.ok) {
        const data = await response.json()
        setSnippets(data)
      } else {
        setSnippets([])
      }
    } catch (error) {
      console.error('Error fetching snippets:', error)
      setSnippets([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      
      if (!formData.title || !formData.code || !formData.language) {
        alert('Please fill in all required fields')
        return
      }

      const snippetData = {
        ...formData,
        tags: tagsArray
      }

      // Here you would make API call to save snippet
      console.log('Saving snippet:', snippetData)
      
      await fetchSnippets()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving snippet:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return

    try {
      // Here you would make API call to delete snippet
      setSnippets(prev => prev.filter(snippet => snippet._id !== id))
    } catch (error) {
      console.error('Error deleting snippet:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      language: '',
      topic: '',
      difficulty: 'Medium',
      tags: ''
    })
    setEditingSnippet(null)
  }

  const openEditDialog = (snippet: CodeSnippet) => {
    setEditingSnippet(snippet)
    setFormData({
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      topic: snippet.topic,
      difficulty: snippet.difficulty,
      tags: snippet.tags.join(', ')
    })
    setIsDialogOpen(true)
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLanguage = !filterLanguage || snippet.language === filterLanguage
    const matchesTopic = !filterTopic || snippet.topic === filterTopic
    
    return matchesSearch && matchesLanguage && matchesTopic
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Code Snippets</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Save and organize your code solutions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSnippet ? 'Edit Snippet' : 'Add New Snippet'}
              </DialogTitle>
              <DialogDescription>
                {editingSnippet ? 'Update your code snippet details.' : 'Add a new code snippet to your collection.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Binary Search"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Select 
                    value={formData.topic} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, topic: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, difficulty: value as 'Easy' | 'Medium' | 'Hard' }))}
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
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the code..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="code">Code *</Label>
                <Textarea
                  id="code"
                  value={formData.code}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Paste your code here..."
                  rows={10}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., binary-search, algorithms, arrays"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSnippet ? 'Update' : 'Create'} Snippet
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

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search snippets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterLanguage || "all"} onValueChange={(value: string) => setFilterLanguage(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTopic || "all"} onValueChange={(value: string) => setFilterTopic(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Snippets List */}
      {loading ? (
        <div className="text-center py-8">Loading snippets...</div>
      ) : filteredSnippets.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || filterLanguage || filterTopic ? 'No matching snippets' : 'No code snippets yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm || filterLanguage || filterTopic 
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Start building your code library by adding your first snippet.'
                }
              </p>
              {!searchTerm && !filterLanguage && !filterTopic && (
                <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Snippet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet._id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    {snippet.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {snippet.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(snippet.code)}
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(snippet)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(snippet._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{snippet.language}</Badge>
                  {snippet.topic && <Badge variant="outline">{snippet.topic}</Badge>}
                  <Badge className={getDifficultyColor(snippet.difficulty)}>
                    {snippet.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {snippet.code}
                  </pre>
                </div>
                {snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {snippet.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  Created: {new Date(snippet.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
