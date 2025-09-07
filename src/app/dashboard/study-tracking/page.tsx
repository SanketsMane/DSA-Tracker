'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock, Plus, Save, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface StudySession {
  _id?: string;
  date: string;
  duration: number; // in minutes
  topics: string[];
  notes?: string;
  problemsSolved: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  createdAt?: string;
}

interface Chapter {
  _id: string;
  title: string;
}

export default function StudyTrackingPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 60,
    topics: '',
    notes: '',
    problemsSolved: 0,
    difficulty: 'Medium' as const
  });

  const [todayStats, setTodayStats] = useState({
    totalTime: 0,
    problemsSolved: 0,
    sessionsCount: 0
  });

  useEffect(() => {
    fetchStudySessions();
    fetchChapters();
  }, []);

  useEffect(() => {
    calculateTodayStats();
  }, [sessions]);

  const fetchStudySessions = async () => {
    try {
      const response = await fetch('/api/study-sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching study sessions:', error);
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

  const calculateTodayStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySessions = sessions.filter(session => 
      session.date === today
    );

    const stats = {
      totalTime: todaySessions.reduce((total, session) => total + session.duration, 0),
      problemsSolved: todaySessions.reduce((total, session) => total + session.problemsSolved, 0),
      sessionsCount: todaySessions.length
    };

    setTodayStats(stats);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const topicsArray = formData.topics.split(',').map(topic => topic.trim()).filter(topic => topic !== '');

      const sessionData = {
        ...formData,
        topics: topicsArray,
        duration: parseInt(formData.duration.toString()) || 0,
        problemsSolved: parseInt(formData.problemsSolved.toString()) || 0
      };

      const response = await fetch('/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        await fetchStudySessions();
        resetForm();
        alert('Study session logged successfully!');
      } else {
        alert('Error logging study session');
      }
    } catch (error) {
      console.error('Error saving study session:', error);
      alert('Error saving study session');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: 60,
      topics: '',
      notes: '',
      problemsSolved: 0,
      difficulty: 'Medium'
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(session => 
      new Date(session.date) >= oneWeekAgo
    );

    return {
      totalTime: weekSessions.reduce((total, session) => total + session.duration, 0),
      problemsSolved: weekSessions.reduce((total, session) => total + session.problemsSolved, 0),
      sessionsCount: weekSessions.length
    };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Tracking</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Log your daily study sessions and track your progress over time.
        </p>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Today's Study Time</p>
                <p className="text-2xl font-bold">{formatTime(todayStats.totalTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Problems Solved</p>
                <p className="text-2xl font-bold">{todayStats.problemsSolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Study Sessions</p>
                <p className="text-2xl font-bold">{todayStats.sessionsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{formatTime(weeklyStats.totalTime)}</p>
              <p className="text-sm text-gray-500">Total Study Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{weeklyStats.problemsSolved}</p>
              <p className="text-sm text-gray-500">Problems Solved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{weeklyStats.sessionsCount}</p>
              <p className="text-sm text-gray-500">Study Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log New Study Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log Study Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="problems">Problems Solved</Label>
                <Input
                  id="problems"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.problemsSolved}
                  onChange={(e) => setFormData(prev => ({ ...prev, problemsSolved: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Primary Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, difficulty: value as typeof formData.difficulty }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="topics">Topics Studied (comma-separated)</Label>
              <Input
                id="topics"
                value={formData.topics}
                onChange={(e) => setFormData(prev => ({ ...prev, topics: e.target.value }))}
                placeholder="e.g., arrays, linked lists, binary search"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="What did you learn? Any insights or challenges?"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Logging...' : 'Log Study Session'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Study Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading study sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No study sessions yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start logging your study sessions to track your progress.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-medium">{format(new Date(session.date), 'MMM dd, yyyy')}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {formatTime(session.duration)}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {session.problemsSolved} problems
                      </span>
                    </div>
                    
                    {session.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {session.topics.map((topic, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {session.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {session.notes}
                      </p>
                    )}
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
