'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, Code, Edit2, Trash2, Link, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Chapter {
  _id: string;
  title: string;
}

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  chapterId?: {
    _id: string;
    title: string;
  };
  status: 'Not Started' | 'In Progress' | 'Completed';
  notes?: string;
  url?: string;
  timeSpent?: number;
  completedAt?: string;
  createdAt: string;
}

const difficulties = ['Easy', 'Medium', 'Hard'] as const;
const statuses = ['Not Started', 'In Progress', 'Completed'] as const;

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<{
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topics: string;
    chapterId: string;
    notes: string;
    url: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
  }>({
    title: '',
    difficulty: 'Medium',
    topics: '',
    chapterId: 'none',
    notes: '',
    url: '',
    status: 'Not Started'
  });

  useEffect(() => {
    fetchProblems();
    fetchChapters();
  }, [filterChapter, filterDifficulty, filterStatus]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterChapter !== 'all') params.append('chapterId', filterChapter);
      if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/problems?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems || data);
      } else {
        setProblems([]);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await fetch('/api/chapters');
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.difficulty) {
        alert('Please fill in the title and difficulty');
        return;
      }

      const topicsArray = formData.topics.split(',').map(topic => topic.trim()).filter(topic => topic !== '');

      const problemData = {
        ...formData,
        topics: topicsArray,
        chapterId: formData.chapterId && formData.chapterId !== 'none' ? formData.chapterId : undefined
      };

      const url = editingProblem ? `/api/problems/${editingProblem._id}` : '/api/problems';
      const method = editingProblem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemData)
      });

      if (response.ok) {
        await fetchProblems();
        setIsDialogOpen(false);
        resetForm();
      } else {
        alert('Error saving problem');
      }
    } catch (error) {
      console.error('Error saving problem:', error);
      alert('Error saving problem');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      const response = await fetch(`/api/problems/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchProblems();
      } else {
        alert('Error deleting problem');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      alert('Error deleting problem');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      difficulty: 'Medium',
      topics: '',
      chapterId: 'none',
      notes: '',
      url: '',
      status: 'Not Started'
    });
    setEditingProblem(null);
  };

  const openEditDialog = (problem: Problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      difficulty: problem.difficulty,
      topics: problem.topics.join(', '),
      chapterId: problem.chapterId?._id || 'none',
      notes: problem.notes || '',
      url: problem.url || '',
      status: problem.status
    });
    setIsDialogOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Problems</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
            Track and manage your problem-solving progress
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { resetForm(); setIsDialogOpen(true) }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Problem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingProblem ? 'Edit Problem' : 'Add New Problem'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Problem title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, difficulty: value as typeof formData.difficulty }))}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chapter">Chapter</Label>
                  <Select 
                    value={formData.chapterId} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, chapterId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Chapter</SelectItem>
                      {chapters.map(chapter => (
                        <SelectItem key={chapter._id} value={chapter._id}>{chapter.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value as typeof formData.status }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="topics">Topics (comma-separated)</Label>
                <Input
                  id="topics"
                  value={formData.topics}
                  onChange={(e) => setFormData(prev => ({ ...prev, topics: e.target.value }))}
                  placeholder="e.g., arrays, binary search, dynamic programming"
                />
              </div>

              <div>
                <Label htmlFor="url">Problem URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add your notes, approach, or solution here..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProblem ? 'Update' : 'Create'} Problem
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Search</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select value={filterChapter} onValueChange={setFilterChapter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  {chapters.map(chapter => (
                    <SelectItem key={chapter._id} value={chapter._id}>{chapter.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Problems List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Problems</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading problems...</div>
          ) : problems.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No problems yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start your DSA journey by adding your first problem to track.
              </p>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Problem
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {problems.map((problem) => (
                <div key={problem._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {problem.title}
                      </h3>
                      {problem.url && (
                        <a 
                          href={problem.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex-shrink-0 w-fit"
                        >
                          <Link className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(problem.status)}>
                        {problem.status}
                      </Badge>
                      {problem.chapterId && (
                        <Badge variant="outline">
                          {problem.chapterId.title}
                        </Badge>
                      )}
                    </div>

                    {problem.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {problem.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {problem.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {problem.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>Created: {new Date(problem.createdAt).toLocaleDateString()}</span>
                      {problem.completedAt && (
                        <span>Completed: {new Date(problem.completedAt).toLocaleDateString()}</span>
                      )}
                      {problem.timeSpent && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{problem.timeSpent} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(problem)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(problem._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
