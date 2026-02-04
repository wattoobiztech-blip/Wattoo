'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Clock, CheckCircle, XCircle, AlertCircle, Eye, 
  User, MapPin, Briefcase, Calendar, Camera,
  MessageSquare, ThumbsUp, ThumbsDown, RotateCcw
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import AdminLayout from '@/components/admin/AdminLayout'
import { adminApi } from '@/lib/admin-api'
import { ProfileApproval } from '@/lib/admin-constants'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ProfileApproval[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApproval, setSelectedApproval] = useState<ProfileApproval | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'changes' | null>(null)
  const [actionNotes, setActionNotes] = useState('')

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getPendingApprovals()
      setApprovals(data)
    } catch (error) {
      console.error('Failed to load approvals:', error)
      toast.error('Failed to load pending approvals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedApproval || !actionType) return

    try {
      switch (actionType) {
        case 'approve':
          await adminApi.approveProfile(selectedApproval.id, actionNotes)
          toast.success('Profile approved successfully')
          break
        case 'reject':
          await adminApi.rejectProfile(selectedApproval.id, actionNotes)
          toast.success('Profile rejected')
          break
        case 'changes':
          await adminApi.requestChanges(selectedApproval.id, actionNotes)
          toast.success('Changes requested')
          break
      }
      
      setShowModal(false)
      setSelectedApproval(null)
      setActionType(null)
      setActionNotes('')
      loadApprovals()
    } catch (error) {
      toast.error('Failed to process action')
    }
  }

  const openActionModal = (approval: ProfileApproval, type: 'approve' | 'reject' | 'changes') => {
    setSelectedApproval(approval)
    setActionType(type)
    setShowModal(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
      changes_requested: { label: 'Changes Requested', color: 'bg-orange-100 text-orange-700', icon: AlertCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || Clock
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-700'}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config?.label || status}
      </span>
    )
  }

  const ProfilePreview = ({ approval }: { approval: ProfileApproval }) => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={approval.photos[0] || '/default-avatar.png'}
            alt={approval.userName}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {approval.photos.length} photos
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{approval.profileData.name}</h3>
            <p className="text-gray-400">{approval.userEmail}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="h-4 w-4" />
              <span>{approval.profileData.age} years old</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Briefcase className="h-4 w-4" />
              <span>{approval.profileData.profession}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{approval.profileData.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="h-4 w-4" />
              <span>{new Date(approval.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {getStatusBadge(approval.status)}
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedApproval(approval)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Profile Approvals</h1>
            <p className="text-gray-400 mt-1">Review and approve pending user profiles</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <div className="text-sm text-gray-400">
              {approvals.length} pending approvals
            </div>
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
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {approvals.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
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
                <p className="text-gray-400 text-sm">Approved Today</p>
                <p className="text-2xl font-bold text-green-400">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
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
                <p className="text-gray-400 text-sm">Rejected Today</p>
                <p className="text-2xl font-bold text-red-400">3</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
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
                <p className="text-gray-400 text-sm">Avg. Review Time</p>
                <p className="text-2xl font-bold text-blue-400">2.5h</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>
        </div>

        {/* Approvals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading pending approvals...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">All caught up!</h3>
            <p className="text-gray-400">No pending approvals at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {approvals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProfilePreview approval={approval} />
                
                {approval.status === 'pending' && (
                  <div className="mt-4 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => openActionModal(approval, 'changes')}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Request Changes</span>
                    </button>
                    
                    <button
                      onClick={() => openActionModal(approval, 'reject')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    
                    <button
                      onClick={() => openActionModal(approval, 'approve')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Modal */}
        {showModal && selectedApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {actionType === 'approve' && 'Approve Profile'}
                  {actionType === 'reject' && 'Reject Profile'}
                  {actionType === 'changes' && 'Request Changes'}
                </h3>
                
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">Profile: {selectedApproval.userName}</p>
                  <p className="text-gray-400 text-sm">{selectedApproval.userEmail}</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {actionType === 'approve' && 'Approval Notes (Optional)'}
                    {actionType === 'reject' && 'Rejection Reason'}
                    {actionType === 'changes' && 'Changes Required'}
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder={
                      actionType === 'approve' 
                        ? 'Add any notes about the approval...'
                        : actionType === 'reject'
                        ? 'Please provide a reason for rejection...'
                        : 'Specify what changes are needed...'
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    required={actionType !== 'approve'}
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setSelectedApproval(null)
                      setActionType(null)
                      setActionNotes('')
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleAction}
                    disabled={actionType !== 'approve' && !actionNotes.trim()}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      actionType === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700'
                        : actionType === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-orange-600 hover:bg-orange-700'
                    } text-white`}
                  >
                    {actionType === 'approve' && 'Approve'}
                    {actionType === 'reject' && 'Reject'}
                    {actionType === 'changes' && 'Request Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Profile Detail Modal */}
        {selectedApproval && !showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Profile Details</h3>
                  <button
                    onClick={() => setSelectedApproval(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{selectedApproval.profileData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{selectedApproval.userEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Age:</span>
                          <span className="text-white">{selectedApproval.profileData.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Profession:</span>
                          <span className="text-white">{selectedApproval.profileData.profession}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">{selectedApproval.profileData.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Submitted:</span>
                          <span className="text-white">{new Date(selectedApproval.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Photos */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Photos ({selectedApproval.photos.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedApproval.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            width={150}
                            height={150}
                            className="rounded-lg object-cover w-full h-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedApproval.status === 'pending' && (
                  <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowModal(true)
                        setActionType('changes')
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Request Changes</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowModal(true)
                        setActionType('reject')
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowModal(true)
                        setActionType('approve')
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}