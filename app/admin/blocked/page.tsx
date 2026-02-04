'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Ban, Search, Filter, Eye, RotateCcw, 
  Trash2, Calendar, AlertTriangle, User,
  Clock, MessageCircle, Shield
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import AdminLayout from '@/components/admin/AdminLayout'
import { adminApi } from '@/lib/admin-api'
import { UserManagement } from '@/lib/admin-constants'

export default function BlockedUsersPage() {
  const [blockedUsers, setBlockedUsers] = useState<UserManagement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null)
  const [showUnblockModal, setShowUnblockModal] = useState(false)
  const [unblockReason, setUnblockReason] = useState('')

  useEffect(() => {
    loadBlockedUsers()
  }, [])

  const loadBlockedUsers = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getUsers(1, 100, { status: 'blocked' })
      setBlockedUsers(response.users)
    } catch (error) {
      console.error('Failed to load blocked users:', error)
      toast.error('Failed to load blocked users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblockUser = async () => {
    if (!selectedUser || !unblockReason.trim()) {
      toast.error('Please provide a reason for unblocking')
      return
    }

    try {
      await adminApi.updateUserStatus(selectedUser.id, 'active')
      toast.success('User unblocked successfully')
      setShowUnblockModal(false)
      setSelectedUser(null)
      setUnblockReason('')
      loadBlockedUsers()
    } catch (error) {
      toast.error('Failed to unblock user')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await adminApi.deleteUser(userId)
      toast.success('User deleted successfully')
      loadBlockedUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  )

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blocked Users</h1>
            <p className="text-gray-400 mt-1">Manage blocked user accounts and review unblock requests</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <div className="text-sm text-gray-400">
              {blockedUsers.length} blocked users
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Blocked</p>
                <p className="text-2xl font-bold text-red-400">{blockedUsers.length}</p>
              </div>
              <Ban className="h-8 w-8 text-red-400" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Blocked This Week</p>
                <p className="text-2xl font-bold text-orange-400">12</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unblocked This Month</p>
                <p className="text-2xl font-bold text-green-400">8</p>
              </div>
              <RotateCcw className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocked users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Blocked Users List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading blocked users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No blocked users</h3>
            <p className="text-gray-400">
              {blockedUsers.length === 0 
                ? 'No users are currently blocked.' 
                : 'No blocked users match your search.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 rounded-lg border border-red-700/50 p-6 hover:border-red-600/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={user.photo || '/default-avatar.png'}
                        alt={user.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Ban className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <Ban className="h-3 w-3 mr-1" />
                          Blocked
                        </span>
                      </div>
                      <p className="text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>ID: {user.id}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Registered: {new Date(user.registrationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{user.reportsCount} reports</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUnblockModal(true)
                      }}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Unblock</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                
                {/* Block Reason (Mock) */}
                <div className="mt-4 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-300">Block Reason:</p>
                      <p className="text-sm text-red-200 mt-1">
                        Multiple reports of inappropriate behavior and fake profile information.
                      </p>
                      <p className="text-xs text-red-400 mt-2">
                        Blocked on {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} by Admin
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Unblock Modal */}
        {showUnblockModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Unblock User</h3>
                
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">User: {selectedUser.name}</p>
                  <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason for Unblocking *
                  </label>
                  <textarea
                    value={unblockReason}
                    onChange={(e) => setUnblockReason(e.target.value)}
                    placeholder="Please provide a reason for unblocking this user..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowUnblockModal(false)
                      setSelectedUser(null)
                      setUnblockReason('')
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleUnblockUser}
                    disabled={!unblockReason.trim()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                  >
                    Unblock User
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}