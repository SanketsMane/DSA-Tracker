'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuToggle}
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            {/* Mobile logo */}
            <div className="md:hidden ml-3 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">DSA Tracker</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-32 md:max-w-none truncate">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign out"
                className="rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
