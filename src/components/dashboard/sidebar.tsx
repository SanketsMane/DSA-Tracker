'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import {
  Home,
  Code,
  Calendar,
  BarChart3,
  Settings,
  Trophy,
  BookOpen,
  Target,
  Book,
  Clock,
  X,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Chapters', href: '/dashboard/chapters', icon: Book },
  { name: 'Problems', href: '/dashboard/problems', icon: Code },
  { name: 'Study Tracking', href: '/dashboard/study-tracking', icon: Clock },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Code Snippets', href: '/dashboard/snippets', icon: BookOpen },
  { name: 'Goals', href: '/dashboard/goals', icon: Target },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  mobileMenuOpen?: boolean
  setMobileMenuOpen?: (open: boolean) => void
}

export function Sidebar({ mobileMenuOpen = false, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [pathname, setMobileMenuOpen])

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo and close button for mobile */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Code className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">DSA Tracker</h1>
        </div>
        
        {isMobile && setMobileMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Built with ❤️ by Sanket Mane
        </p>
      </div>
    </div>
  )

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {sidebarContent}
        </div>
      </div>
    )
  }

  // Mobile sidebar overlay
  return (
    <>
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}
