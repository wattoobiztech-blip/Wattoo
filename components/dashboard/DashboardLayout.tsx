'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  Home, User, Heart, Search, MessageCircle, Crown, Settings, 
  LogOut, Menu, X, Bell, ChevronDown 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { mockApi, type UserProfile } from '@/lib/mock-api'
import CustomCursor from '@/components/CustomCursor'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
  { name: 'Matches', href: '/dashboard/matches', icon: Heart },
  { name: 'Search Profiles', href: '/dashboard/search', icon: Search },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle, disabled: true },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Crown },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await mockApi.getUserProfile()
        setUserProfile(profile)
      } catch (error) {
        console.error('Failed to load user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...')
    // Redirect to login page
    window.location.href = '/login'
  }

  const getSubscriptionBadge = (status: string) => {
    const badges = {
      free: { color: 'bg-gray-500', text: 'Free' },
      premium: { color: 'bg-gradient-to-r from-primary-500 to-purple-500', text: 'Premium' },
      gold: { color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'Gold' }
    }
    return badges[status as keyof typeof badges] || badges.free
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomCursor />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary-500" />
          <span className="text-lg font-bold gradient-text">Rishta.com</span>
        </div>
        
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Bell className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold gradient-text">Rishta.com</span>
            </div>

            {/* User Profile Card */}
            {userProfile && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={userProfile.avatar || '/default-avatar.png'}
                      alt={userProfile.fullName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userProfile.fullName}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getSubscriptionBadge(userProfile.subscriptionStatus).color}`}>
                        {getSubscriptionBadge(userProfile.subscriptionStatus).text}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Profile Completion */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Profile Completion</span>
                    <span>{userProfile.profileCompleted}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${userProfile.profileCompleted}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.name}
                    href={item.disabled ? '#' : item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg'
                        : item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                    {item.name}
                    {item.disabled && (
                      <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={() => setIsSidebarOpen(false)}
              />
              
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-6 w-6 text-primary-500" />
                      <span className="text-lg font-bold gradient-text">Rishta.com</span>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Mobile User Profile */}
                  {userProfile && (
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={userProfile.avatar || '/default-avatar.png'}
                          alt={userProfile.fullName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {userProfile.fullName}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getSubscriptionBadge(userProfile.subscriptionStatus).color}`}>
                            {getSubscriptionBadge(userProfile.subscriptionStatus).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.disabled ? '#' : item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                              : item.disabled
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                          {item.disabled && (
                            <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Mobile Logout */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}