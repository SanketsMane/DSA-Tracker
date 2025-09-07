import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Code, 
  Calendar, 
  BarChart3, 
  Target, 
  Trophy,
  Github,
  Instagram,
  Youtube,
  Mail,
  Clock,
  Users,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Smartphone,
  Monitor,
  Brain
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DSA Tracker</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="#developer" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Developer
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300">
            🚀 Now with Study Tracking & Email Reminders
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Master Your <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DSA Journey
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            The most comprehensive platform to track problems, manage study schedules, 
            store code snippets, and analyze your progress in Data Structures & Algorithms. 
            Built for developers, by developers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Problems Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Progress Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">Smart</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">Free</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools designed to accelerate your DSA learning journey
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950">
              <CardHeader className="pb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle className="text-xl">Problem Tracking</CardTitle>
                <CardDescription className="text-base">
                  Track progress across 1000+ problems with smart status updates and difficulty progression.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-950">
              <CardHeader className="pb-4">
                <Code className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-xl">Code Snippets</CardTitle>
                <CardDescription className="text-base">
                  Store solutions with syntax highlighting, tags, and lightning-fast search.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950">
              <CardHeader className="pb-4">
                <Clock className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl">Study Tracking</CardTitle>
                <CardDescription className="text-base">
                  Log daily study sessions, track time spent, and maintain learning streaks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950">
              <CardHeader className="pb-4">
                <BarChart3 className="h-12 w-12 text-orange-600 dark:text-orange-400 mb-4" />
                <CardTitle className="text-xl">Smart Analytics</CardTitle>
                <CardDescription className="text-base">
                  Visualize progress with detailed charts, heatmaps, and performance insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-950">
              <CardHeader className="pb-4">
                <Target className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mb-4" />
                <CardTitle className="text-xl">Goal Management</CardTitle>
                <CardDescription className="text-base">
                  Set SMART goals, track milestones, and celebrate achievements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-950">
              <CardHeader className="pb-4">
                <Trophy className="h-12 w-12 text-pink-600 dark:text-pink-400 mb-4" />
                <CardTitle className="text-xl">Gamification</CardTitle>
                <CardDescription className="text-base">
                  Earn badges, maintain streaks, and climb leaderboards to stay motivated.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Why DSA Tracker?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Study anywhere with our fully responsive design that works perfectly on all devices.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built with Next.js 15 for optimal performance and instant page loads.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-powered insights and personalized recommendations to optimize your learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developer" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Meet the Developer
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Passionate about helping developers master algorithms and data structures
              </p>
            </div>
            
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-blue-900 dark:to-indigo-900">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                      SM
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Sanket Mane
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 mb-4 font-medium">
                      Full Stack Developer & DSA Enthusiast
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      Experienced developer passionate about creating tools that help fellow programmers 
                      excel in their coding journey. Specializing in modern web technologies and 
                      algorithmic problem solving.
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <a 
                        href="https://github.com/SanketsMane" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                      
                      <a 
                        href="https://www.youtube.com/@CodeWithSanket30" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Youtube className="h-4 w-4" />
                        YouTube
                      </a>
                      
                      <a 
                        href="https://www.instagram.com/sanketpatil_1010/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                      
                      <a 
                        href="mailto:contactsanket1@gmail.com"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your DSA Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of developers who are already mastering algorithms and 
            landing their dream jobs with DSA Tracker.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">DSA Tracker</span>
              </div>
              <p className="text-gray-400">Master your coding journey</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Built with ❤️ by{' '}
                <a 
                  href="https://github.com/SanketsMane" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sanket Mane
                </a>
              </p>
              <p className="text-gray-500 text-sm">
                © 2025 DSA Tracker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
