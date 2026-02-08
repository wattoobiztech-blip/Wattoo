'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  Crown, Menu, X, LogOut, Bell, Search, 
  Plus, LayoutDashboard, Users, Clock, Ban, Flag,
  User, Star, CheckCircle, DollarSign, Settings,
  Trophy, MessageSquare, FileText, BarChart3,
  BarChart2, TrendingUp, MessageCircle, Mail
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { adminNavigation, mockAdminUser, adminRoles } from '@/lib/admin-constants'
import CustomCursor from '@/components/CustomCursor'

interface AdminLayoutProps {
  children: React.ReactNode
}

const iconMap = {
  LayoutDashboard,
  Users,
  Clock,
  Ban,
  Flag,
  User,
  Star,
  CheckCircle,
  Crown,
  DollarSign,
  Settings,
  Trophy,
  MessageSquare,
  FileText,
  BarChart3,
  BarChart2,
  TrendingUp,
  MessageCircle,
  Mail
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [adminUser] = useState(mockAdminUser)
  const [notifications] = useState(3)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    toast.success('Logged out successfully')
    // Redirect to admin login
    window.location.href = '/admin/login'
  }

  const quickActions = [
    { name: 'Add User', icon: Users, action: () => toast('Add User modal') },
    { name: 'Approve Profile', icon: CheckCircle, action: () => toast('Approve Profile modal') },
    { name: 'Send Email', icon: Mail, action: () => toast('Send Email modal') },
    { name: 'Generate Report', icon: BarChart3, action: () => toast('Generate Report modal') }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <CustomCursor />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <Menu className="h-6 w-6 text-gray-300" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold text-white">Rishta Admin</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 relative">
            <Bell className="h-5 w-5 text-gray-300" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-gray-800 border-r border-gray-700 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
              <Crown className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-white">Rishta Admin</span>
            </div>

            {/* Admin User Card */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={adminUser.avatar || '/default-avatar.png'}
                    alt={adminUser.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {adminUser.name}
                  </p>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${adminRoles[adminUser.role].color}`}>
                    {adminRoles[adminUser.role].name}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Last login: {new Date(adminUser.lastLogin).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2">
              {adminNavigation.map((section) => (
                <div key={section.category}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.category}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = iconMap[item.icon as keyof typeof iconMap]
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors duration-200"
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
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-xl overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-6 w-6 text-yellow-500" />
                      <span className="text-lg font-bold text-white">Rishta Admin</span>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <X className="h-5 w-5 text-gray-300" />
                    </button>
                  </div>

                  {/* Mobile Admin User Card */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={adminUser.avatar || '/default-avatar.png'}
                        alt={adminUser.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {adminUser.name}
                        </p>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${adminRoles[adminUser.role].color}`}>
                          {adminRoles[adminUser.role].name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 px-2 py-4 space-y-2">
                    {adminNavigation.map((section) => (
                      <div key={section.category}>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {section.category}
                        </div>
                        <div className="space-y-1">
                          {section.items.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = iconMap[item.icon as keyof typeof iconMap]
                            
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                              >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </nav>

                  {/* Mobile Logout */}
                  <div className="p-4 border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors duration-200"
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
        <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
          {/* Top Bar */}
          <div className="hidden lg:flex items-center justify-between bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, profiles, or content..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 relative">
                <Bell className="h-5 w-5 text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="text-sm text-gray-300">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 bg-gray-900">
            {children}
          </main>
        </div>
      </div>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-4 min-w-48"
            >
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={action.action}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-14 h-14 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-teal-500/25 transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: showQuickActions ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  )
}