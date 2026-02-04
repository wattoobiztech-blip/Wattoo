'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  MessageCircle, Plus, Search, Filter, Eye, Edit, 
  Trash2, CheckCircle, Clock, AlertTriangle, 
  User, Calendar, Tag, MoreVertical, Send,
  FileText, Shield, Heart, Flag, MessageSquare
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import AdminLayout from '@/components/admin/AdminLayout'
import { adminApi } from '@/lib/admin-api'
import { AdminComment, commentCategories } from '@/lib/admin-constants'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedComment, setSelectedComment] = useState<AdminComment | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  
  // New comment form
  const [newComment, setNewComment] = useState({
    profileId: '',
    comment: '',
    category: 'general'
  })

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getComments()
      setComments(data)
    } catch (error) {
      console.error('Failed to load comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.profileId || !newComment.comment.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const comment = await adminApi.addComment(
        parseInt(newComment.profileId),
        newComment.comment,
        newComment.category
      )
      
      setComments([comment, ...comments])
      setShowAddModal(false)
      setNewComment({ profileId: '', comment: '', category: 'general' })
      toast.success('Comment added successfully')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handleUpdateComment = async (commentId: number, updates: Partial<AdminComment>) => {
    try {
      await adminApi.updateComment(commentId, updates)
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, ...updates } : c
      ))
      toast.success('Comment updated successfully')
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await adminApi.deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  const toggleResolved = async (comment: AdminComment) => {
    await handleUpdateComment(comment.id, { 
      isResolved: !comment.isResolved,
      updatedAt: new Date().toISOString()
    })
  }

  const getCategoryConfig = (category: string) => {
    return commentCategories.find(c => c.value === category) || 
           { label: category, color: 'bg-gray-100 text-gray-700' }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      background_check: Shield,
      verification: CheckCircle,
      support: MessageSquare,
      matchmaking: Heart,
      red_flag: Flag,
      general: FileText
    }
    return icons[category as keyof typeof icons] || FileText
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = !searchTerm || 
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.profileId.toString().includes(searchTerm)
    
    const matchesCategory = !categoryFilter || comment.category === categoryFilter
    const matchesStatus = !statusFilter || 
      (statusFilter === 'resolved' && comment.isResolved) ||
      (statusFilter === 'unresolved' && !comment.isResolved)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Comments</h1>
            <p className="text-gray-400 mt-1">Manage internal comments and notes on user profiles</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Comment</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Comments</p>
                <p className="text-2xl font-bold text-blue-400">{comments.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-400" />
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
                <p className="text-gray-400 text-sm">Unresolved</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {comments.filter(c => !c.isResolved).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
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
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-green-400">
                  {comments.filter(c => c.isResolved).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Red Flags</p>
                <p className="text-2xl font-bold text-red-400">
                  {comments.filter(c => c.category === 'red_flag').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search comments by content, admin name, or profile ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {commentCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('')
                  setStatusFilter('')
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No comments found</h3>
            <p className="text-gray-400">
              {comments.length === 0 
                ? 'No comments have been added yet.' 
                : 'No comments match your current filters.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment, index) => {
              const categoryConfig = getCategoryConfig(comment.category)
              const CategoryIcon = getCategoryIcon(comment.category)
              
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-800 rounded-lg border p-6 transition-all duration-200 hover:border-gray-600 ${
                    comment.isResolved ? 'border-gray-700' : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative">
                        <Image
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                          alt={comment.adminName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${categoryConfig.color}`}>
                          <CategoryIcon className="h-2.5 w-2.5" />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-white">{comment.adminName}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {categoryConfig.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            Profile ID: {comment.profileId}
                          </span>
                          {comment.isResolved && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                          {comment.updatedAt && (
                            <div className="flex items-center space-x-1">
                              <Edit className="h-3 w-3" />
                              <span>Updated {new Date(comment.updatedAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleResolved(comment)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          comment.isResolved
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                        title={comment.isResolved ? 'Mark as unresolved' : 'Mark as resolved'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedComment(comment)
                          setShowEditModal(true)
                        }}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200"
                        title="Edit comment"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-colors duration-200"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <div className="relative group">
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        <div className="absolute right-0 top-10 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                              View Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                              Add Follow-up
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                              Export Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Add Comment Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Add New Comment</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profile ID *
                      </label>
                      <input
                        type="number"
                        value={newComment.profileId}
                        onChange={(e) => setNewComment({ ...newComment, profileId: e.target.value })}
                        placeholder="Enter profile ID"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={newComment.category}
                        onChange={(e) => setNewComment({ ...newComment, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {commentCategories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Comment *
                      </label>
                      <textarea
                        value={newComment.comment}
                        onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                        placeholder="Enter your comment..."
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowAddModal(false)
                        setNewComment({ profileId: '', comment: '', category: 'general' })
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={handleAddComment}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <Send className="h-4 w-4" />
                      <span>Add Comment</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}