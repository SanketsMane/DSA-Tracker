'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Upload, 
  Trash2, 
  Save,
  Moon,
  Sun,
  Globe,
  Mail
} from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  bio: string
  location: string
  website: string
  github: string
  leetcode: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
    weeklyReport: boolean
    achievementAlerts: boolean
    studyReminders: boolean
    publicProfile: boolean
    showStats: boolean
    showStreak: boolean
  }
}

const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi']
const timezones = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    leetcode: '',
    preferences: {
      theme: 'system',
      language: 'English',
      timezone: 'UTC+00:00',
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: true,
      achievementAlerts: true,
      studyReminders: true,
      publicProfile: false,
      showStats: true,
      showStreak: true
    }
  })

  useEffect(() => {
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || ''
      }))
    }
    setLoading(false)
  }, [session])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Here you would make API call to save profile
      console.log('Saving profile:', profile)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      // Here you would implement data export
      console.log('Exporting user data...')
      alert('Data export feature will be available soon!')
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Here you would implement data import
        console.log('Importing data from:', file.name)
        alert('Data import feature will be available soon!')
      }
    }
    input.click()
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return
    }

    try {
      // Here you would implement account deletion
      console.log('Deleting account...')
      alert('Account deletion feature will be available soon!')
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const testEmail = async (type: 'daily' | 'weekly') => {
    if (!profile.preferences.emailNotifications) {
      alert('Please enable email notifications first.')
      return
    }

    try {
      setTestingEmail(true)
      const response = await fetch(`/api/email-reminders?type=${type}`)
      const result = await response.json()

      if (result.success) {
        alert(`Test ${type} email sent successfully! Check your inbox.`)
      } else {
        throw new Error(result.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      alert('Failed to send test email. Please check your email configuration.')
    } finally {
      setTestingEmail(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download }
  ]

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub Username</Label>
                    <Input
                      id="github"
                      value={profile.github}
                      onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="yourusername"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leetcode">LeetCode Username</Label>
                    <Input
                      id="leetcode"
                      value={profile.leetcode}
                      onChange={(e) => setProfile(prev => ({ ...prev, leetcode: e.target.value }))}
                      placeholder="yourusername"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Application Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={profile.preferences.theme} 
                      onValueChange={(value: string) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, theme: value as 'light' | 'dark' | 'system' }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={profile.preferences.language} 
                      onValueChange={(value: string) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, language: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={profile.preferences.timezone} 
                    onValueChange={(value: string) => setProfile(prev => ({ 
                      ...prev, 
                      preferences: { ...prev.preferences, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profile.preferences.emailNotifications}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, emailNotifications: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={profile.preferences.pushNotifications}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, pushNotifications: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-report">Weekly Report</Label>
                      <p className="text-sm text-gray-500">Get weekly progress summary</p>
                    </div>
                    <Switch
                      id="weekly-report"
                      checked={profile.preferences.weeklyReport}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, weeklyReport: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when you unlock achievements</p>
                    </div>
                    <Switch
                      id="achievement-alerts"
                      checked={profile.preferences.achievementAlerts}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, achievementAlerts: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="study-reminders">Study Reminders</Label>
                      <p className="text-sm text-gray-500">Get reminded to complete daily goals</p>
                    </div>
                    <Switch
                      id="study-reminders"
                      checked={profile.preferences.studyReminders}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, studyReminders: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email Reminder Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testEmail('daily')}
                        disabled={!profile.preferences.emailNotifications || testingEmail}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {testingEmail ? 'Sending...' : 'Test Daily Reminder'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testEmail('weekly')}
                        disabled={!profile.preferences.emailNotifications || testingEmail}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {testingEmail ? 'Sending...' : 'Test Weekly Report'}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Test email functionality to ensure your reminders are working correctly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile">Public Profile</Label>
                      <p className="text-sm text-gray-500">Allow others to view your profile</p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={profile.preferences.publicProfile}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, publicProfile: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-stats">Show Statistics</Label>
                      <p className="text-sm text-gray-500">Display your solving statistics publicly</p>
                    </div>
                    <Switch
                      id="show-stats"
                      checked={profile.preferences.showStats}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, showStats: checked }
                      }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-streak">Show Streak</Label>
                      <p className="text-sm text-gray-500">Display your current streak publicly</p>
                    </div>
                    <Switch
                      id="show-streak"
                      checked={profile.preferences.showStreak}
                      onCheckedChange={(checked: boolean) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, showStreak: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleImportData}
                    >
                      <Upload className="h-4 w-4" />
                      Import Data
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Export your data for backup or import data from another platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-2"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
