'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Users, UserCheck, Clock, DollarSign, 
  Crown, ArrowUpRight, ArrowDownRight, Eye,
  Heart, MessageCircle, Star, Calendar
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

import AdminLayout from '@/components/admin/AdminLayout'
import { adminApi } from '@/lib/admin-api'
import { DashboardMetrics, ChartData, RecentActivity } from '@/lib/admin-constants'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metricsData, chartsData, activityData] = await Promise.all([
          adminApi.getDashboardMetrics(),
          adminApi.getChartData(),
          adminApi.getRecentActivity()
        ])
        
        setMetrics(metricsData)
        setChartData(chartsData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    prefix = '', 
    suffix = '' 
  }: {
    title: string
    value: number
    change: number
    icon: any
    color: string
    prefix?: string
    suffix?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">
          {prefix}{value.toLocaleString()}{suffix}
        </h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  )

  const getActivityIcon = (type: string) => {
    const icons = {
      registration: Users,
      approval: UserCheck,
      subscription: Crown,
      admin_action: Star,
      report: MessageCircle
    }
    return icons[type as keyof typeof icons] || MessageCircle
  }

  const getActivityColor = (severity: string) => {
    const colors = {
      info: 'text-blue-400 bg-blue-900/20',
      success: 'text-green-400 bg-green-900/20',
      warning: 'text-yellow-400 bg-yellow-900/20',
      error: 'text-red-400 bg-red-900/20'
    }
    return colors[severity as keyof typeof colors] || colors.info
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your matrimonial platform today.
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers}
              change={metrics.totalUsersChange}
              icon={Users}
              color="bg-blue-600"
            />
            
            <MetricCard
              title="Active Profiles"
              value={metrics.activeProfiles}
              change={metrics.activeProfilesChange}
              icon={UserCheck}
              color="bg-green-600"
            />
            
            <MetricCard
              title="Pending Approvals"
              value={metrics.pendingApprovals}
              change={metrics.pendingApprovalsChange}
              icon={Clock}
              color="bg-yellow-600"
            />
            
            <MetricCard
              title="Today's Revenue"
              value={metrics.todayRevenue}
              change={metrics.todayRevenueChange}
              icon={DollarSign}
              color="bg-purple-600"
              prefix="$"
            />
            
            <MetricCard
              title="Total Subscriptions"
              value={metrics.totalSubscriptions}
              change={metrics.totalSubscriptionsChange}
              icon={Crown}
              color="bg-indigo-600"
            />
            
            <MetricCard
              title="Match Success Rate"
              value={metrics.matchSuccessRate}
              change={metrics.matchSuccessRateChange}
              icon={Heart}
              color="bg-pink-600"
              suffix="%"
            />
          </div>
        )}

        {/* Charts Section */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Registration Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-6">User Registration Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.userRegistrations}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Subscription Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Subscription Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.subscriptionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.subscriptionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#F9FAFB' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Top Locations</h3>
              <div className="space-y-4">
                {chartData.topLocations.map((location, index) => (
                  <div key={location.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{location.country}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-16 text-right">
                        {location.users.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const colorClass = getActivityColor(activity.severity)
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}