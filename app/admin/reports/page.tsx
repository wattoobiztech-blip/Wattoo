'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Flag, Search, Filter, Eye, CheckCircle, 
  XCircle, AlertTriangle, User, Calendar,
  MessageCircle, Ban, Trash2, MoreVertical
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import AdminLayout from '@/components/admin/AdminLayout'

interface UserReport {
  id: number
  reportedUserId: number
  reportedUserName: string
  reportedUserEmail: string
  reportedUserPhoto?: string
  reporterUserId: number
  reporterUserName: string
  reporterUserEmail: string
  reason: string
  category: 'inappropriate_behavior' | 'fake_profile' | 'harassment' | 'spam' | 'other'
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  adminNotes?: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<UserReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'resolve' | 'dismiss' | 'escalate' | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      // Mock data - replace with actual API call
      const mockReports: UserReport[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        reportedUserId: Math.floor(Math.random() * 1000) + 1,
        reportedUserName: ['Ahmed Khan', 'Sarah Ali', 'Omar Hassan', 'Fatima Sheikh'][Math.floor(Math.random() * 4)],
        reportedUserEmail: `user${i + 1}@example.com`,
        reportedUserPhoto: `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face`,
        reporterUserId: Math.floor(Math.random() * 1000) + 1,
        reporterUserName: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Lisa Brown'][Math.floor(Math.random() * 4)],
        reporterUserEmail: `reporter${i + 1}@example.com`,
        reason: ['Inappropriate messages', 'Fake photos', 'Harassment', 'Spam behavior', 'Suspicious activity'][Math.floor(Math.random() * 5)],
        category: ['inappropriate_behavior', 'fake_profile', 'harassment', 'spam', 'other'][Math.floor(Math.random() * 5)] as any,
        description: 'Detailed description of the reported behavior and evidence provided by the reporter.',
        status: ['pending', 'reviewed', 'resolved', 'dismissed'][Math.floor(Math.random() * 4)] as any,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        reviewedBy: Math.random() > 0.5 ? 'Admin User' : undefined,
        adminNotes: Math.random() > 0.7 ? 'Investigated and found evidence of policy violation.' : undefined
      }))
      
      setReports(mockReports)
    } catch (error) {
      console.error('Failed to load reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReportAction = async () => {
    if (!selectedReport || !actionType) return

    try {
      // Mock API call - replace with actual implementation
      const updatedReport: UserReport = {
        ...selectedReport,
        status: actionType === 'dismiss' ? 'dismissed' : 'resolved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Current Admin',
        adminNotes: adminNotes
      }
      
      setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r))
      
      toast.success(`Report ${actionType}d successfully`)
      setShowActionModal(false)
      setSelectedReport(null)
      setActionType(null)
      setAdminNotes('')
    } catch (error) {
      toast.error('Failed to process report action')
    }
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      inappropriate_behavior: { label: 'Inappropriate Behavior', color: 'bg-red-100 text-red-700' },
      fake_profile: { label: 'Fake Profile', color: 'bg-orange-100 text-orange-700' },
      harassment: { label: 'Harassment', color: 'bg-red-100 text-red-700' },
      spam: { label: 'Spam', color: 'bg-yellow-100 text-yellow-700' },
      other: { label: 'Other', color: 'bg-gray-100 text-gray-700' }
    }
    
    const config = categoryConfig[category as keyof typeof categoryConfig]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-700'}`}>
        {config?.label || category}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
      reviewed: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: Eye },
      resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      dismissed: { label: 'Dismissed', color: 'bg-gray-100 text-gray-700', icon: XCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || AlertTriangle
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-700'}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config?.label || status}
      </span>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { label: 'Low', color: 'bg-green-100 text-green-700' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
      high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
      critical: { label: 'Critical', color: 'bg-red-100 text-red-700' }
    }
    
    const config = severityConfig[severity as keyof typeof severityConfig]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-700'}`}>
        {config?.label || severity}
      </span>
    )
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || report.status === statusFilter
    const matchesCategory = !categoryFilter || report.category === categoryFilter
    const matchesSeverity = !severityFilter || report.severity === severityFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity
  })

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">User Reports</h1>
            <p className="text-gray-400 mt-1">Review and manage user reports and complaints</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <div className="text-sm text-gray-400">
              {reports.filter(r => r.status === 'pending').length} pending reports
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
                <p className="text-gray-400 text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-blue-400">{reports.length}</p>
              </div>
              <Flag className="h-8 w-8 text-blue-400" />
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
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
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
                  {reports.filter(r => r.status === 'resolved').length}
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
                <p className="text-gray-400 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-400">
                  {reports.filter(r => r.severity === 'critical').length}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-400" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by user name, reporter, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="inappropriate_behavior">Inappropriate Behavior</option>
                <option value="fake_profile">Fake Profile</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setCategoryFilter('')
                  setSeverityFilter('')
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
            <p className="text-gray-400">
              {reports.length === 0 
                ? 'No reports have been submitted yet.' 
                : 'No reports match your current filters.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-800 rounded-lg border p-6 transition-all duration-200 hover:border-gray-600 ${
                  report.severity === 'critical' ? 'border-red-700/50' : 
                  report.severity === 'high' ? 'border-orange-700/50' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="relative">
                      <Image
                        src={report.reportedUserPhoto || '/default-avatar.png'}
                        alt={report.reportedUserName}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Flag className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3 flex-wrap gap-2">
                        <h3 className="text-lg font-semibold text-white">{report.reportedUserName}</h3>
                        {getStatusBadge(report.status)}
                        {getCategoryBadge(report.category)}
                        {getSeverityBadge(report.severity)}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-gray-300 font-medium">Reason: {report.reason}</p>
                        <p className="text-gray-400 text-sm">{report.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Reported by: {report.reporterUserName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        {report.reviewedAt && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>Reviewed by: {report.reviewedBy}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Reviewed: {new Date(report.reviewedAt).toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {report.adminNotes && (
                        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                          <p className="text-sm text-blue-200">
                            <strong>Admin Notes:</strong> {report.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.open(`/admin/users/${report.reportedUserId}`, '_blank')}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      title="View Reported User"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report)
                            setActionType('resolve')
                            setShowActionModal(true)
                          }}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                          title="Resolve Report"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedReport(report)
                            setActionType('dismiss')
                            setShowActionModal(true)
                          }}
                          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                          title="Dismiss Report"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    <div className="relative group">
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      <div className="absolute right-0 top-10 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-1">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                            Block Reported User
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                            Contact Reporter
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                            Export Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Modal */}
        {showActionModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {actionType === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
                </h3>
                
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">Report ID: {selectedReport.id}</p>
                  <p className="text-gray-400 text-sm">
                    {selectedReport.reportedUserName} reported by {selectedReport.reporterUserName}
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={`Add notes about ${actionType === 'resolve' ? 'resolving' : 'dismissing'} this report...`}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowActionModal(false)
                      setSelectedReport(null)
                      setActionType(null)
                      setAdminNotes('')
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleReportAction}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      actionType === 'resolve' 
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    } text-white`}
                  >
                    {actionType === 'resolve' ? 'Resolve' : 'Dismiss'}
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