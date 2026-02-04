'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Eye, Heart, Calendar, Star, TrendingUp, Users, 
  ArrowRight, Plus, Crown, Search 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { mockApi, type UserProfile, type DashboardStats, type RecentActivity } from '@/lib/mock-api'

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profile, dashboardStats, recentActivities] = await Promise.all([
          mockApi.getUserProfile(),
          mockApi.getDashboardStats(),
          mockApi.getRecentActivities()
        ])
        
        setUserProfile(profile)
        setStats(dashboardStats)
        setActivities(recentActivities)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      profile_view: Eye,
      match: Heart,
      message: Users,
      like_received: Heart,
      profile_update: Star
    }
    return icons[type as keyof typeof icons] || Star
  }

  const getActivityColor = (type: string) => {
    const colors = {
      profile_view: 'text-blue-500 bg-blue-100',
      match: 'text-red-500 bg-red-100',
      message: 'text-green-500 bg-green-100',
      like_received: 'text-pink-500 bg-pink-100',
      profile_update: 'text-purple-500 bg-purple-100'
    }
    return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-100'
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your matrimonial journey today.
          </p>
        </motion.div>

        {/* Profile Completion Alert */}
        {userProfile && userProfile.profileCompleted < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-white/90 mb-4">
                  Your profile is {userProfile.profileCompleted}% complete. Complete it to get better matches!
                </p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${userProfile.profileCompleted}%` }}
                  />
                </div>
              </div>
              <Link
                href="/dashboard/profile/create"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Complete Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats && [
            {
              title: 'Profiles Viewed Today',
              value: stats.profilesViewedToday,
              icon: Eye,
              color: 'text-blue-500 bg-blue-100',
              change: '+12%'
            },
            {
              title: 'Total Matches',
              value: stats.totalMatches,
              icon: Heart,
              color: 'text-red-500 bg-red-100',
              change: '+3 new'
            },
            {
              title: 'Subscription Days Left',
              value: stats.subscriptionDaysLeft,
              icon: Calendar,
              color: 'text-green-500 bg-green-100',
              change: userProfile?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'
            },
            {
              title: 'Featured Status',
              value: stats.isFeatured ? 'Active' : 'Inactive',
              icon: Star,
              color: 'text-yellow-500 bg-yellow-100',
              change: stats.isFeatured ? 'Featured' : 'Upgrade'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type)
                const colorClass = getActivityColor(activity.type)
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{activity.message}</p>
                      <p className="text-gray-500 text-xs">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                    
                    {activity.avatar && (
                      <Image
                        src={activity.avatar}
                        alt="User"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link
                href="/dashboard/profile/create"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Complete Profile</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/dashboard/subscriptions"
                className="flex items-center justify-between p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5" />
                  <span className="font-medium">Upgrade Plan</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/dashboard/search"
                className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Browse Matches</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Profile Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Profile Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.profileViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Likes Received</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.likesReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}