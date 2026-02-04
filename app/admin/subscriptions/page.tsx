'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Crown, DollarSign, Calendar, CreditCard, 
  TrendingUp, Users, RefreshCw, Download,
  Eye, Edit, Trash2, MoreVertical, Search,
  Filter, CheckCircle, XCircle, Clock, AlertTriangle
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import AdminLayout from '@/components/admin/AdminLayout'
import { adminApi } from '@/lib/admin-api'
import { SubscriptionData, PaymentHistory, subscriptionStatusOptions } from '@/lib/admin-constants'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([])
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'payments'>('subscriptions')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (activeTab === 'subscriptions') {
      loadSubscriptions()
    } else {
      loadPayments()
    }
  }, [activeTab, currentPage, statusFilter, planFilter, searchTerm])

  const loadSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getSubscriptions(currentPage, 20)
      setSubscriptions(response.subscriptions)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
      toast.error('Failed to load subscriptions')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPayments = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getPaymentHistory(currentPage, 20)
      setPayments(response.payments)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to load payments:', error)
      toast.error('Failed to load payment history')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = subscriptionStatusOptions.find(s => s.value === status) || 
                        { label: status, color: 'bg-gray-100 text-gray-700' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    )
  }

  const getPlanBadge = (plan: string) => {
    const planColors = {
      golden: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      diamond: 'bg-blue-100 text-blue-700 border-blue-200',
      elite: 'bg-purple-100 text-purple-700 border-purple-200'
    }
    
    const planIcons = {
      golden: '🥇',
      diamond: '💎',
      elite: '👑'
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${planColors[plan as keyof typeof planColors]}`}>
        <span className="mr-1">{planIcons[plan as keyof typeof planIcons]}</span>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Success', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-700', icon: RefreshCw }
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const SubscriptionMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Subscriptions</p>
            <p className="text-2xl font-bold text-green-400">1,234</p>
            <p className="text-xs text-green-400 mt-1">+12% from last month</p>
          </div>
          <Crown className="h-8 w-8 text-green-400" />
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
            <p className="text-gray-400 text-sm">Monthly Revenue</p>
            <p className="text-2xl font-bold text-blue-400">$45,678</p>
            <p className="text-xs text-blue-400 mt-1">+8% from last month</p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-400" />
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
            <p className="text-gray-400 text-sm">Churn Rate</p>
            <p className="text-2xl font-bold text-red-400">2.3%</p>
            <p className="text-xs text-red-400 mt-1">-0.5% from last month</p>
          </div>
          <TrendingUp className="h-8 w-8 text-red-400" />
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
            <p className="text-gray-400 text-sm">Avg. LTV</p>
            <p className="text-2xl font-bold text-purple-400">$156</p>
            <p className="text-xs text-purple-400 mt-1">+15% from last month</p>
          </div>
          <Users className="h-8 w-8 text-purple-400" />
        </div>
      </motion.div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription Management</h1>
            <p className="text-gray-400 mt-1">Manage subscriptions and payment history</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Metrics */}
        <SubscriptionMetrics />

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'subscriptions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Active Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Payment History
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'subscriptions' ? 'subscriptions' : 'payments'} by user name, email, or ID...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {activeTab === 'subscriptions' ? (
                  subscriptionStatusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </>
                )}
              </select>
            </div>
            
            {activeTab === 'subscriptions' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Plans</option>
                  <option value="golden">Golden</option>
                  <option value="diamond">Diamond</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
            )}
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('')
                  setPlanFilter('')
                  setSearchTerm('')
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading {activeTab}...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'subscriptions' ? (
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {subscriptions.map((subscription) => (
                      <motion.tr
                        key={subscription.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={`https://images.unsplash.com/photo-1500000000000?w=40&h=40&fit=crop&crop=face`}
                              alt={subscription.userName}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <div className="text-sm font-medium text-white">{subscription.userName}</div>
                              <div className="text-sm text-gray-400">{subscription.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {getPlanBadge(subscription.planType)}
                        </td>
                        
                        <td className="px-6 py-4">
                          {getStatusBadge(subscription.status)}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">
                            {formatCurrency(subscription.amount)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {subscription.paymentMethod}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            {new Date(subscription.startDate).toLocaleDateString()} - 
                            {new Date(subscription.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-400 transition-colors duration-200">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {payments.map((payment) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">
                            {payment.transactionId}
                          </div>
                          <div className="text-xs text-gray-400">
                            {payment.paymentMethod}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{payment.userName}</div>
                          <div className="text-sm text-gray-400">ID: {payment.userId}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          {payment.refundAmount && (
                            <div className="text-xs text-red-400">
                              Refunded: {formatCurrency(payment.refundAmount, payment.currency)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          {getPaymentStatusBadge(payment.status)}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            {payment.status === 'success' && (
                              <button className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}