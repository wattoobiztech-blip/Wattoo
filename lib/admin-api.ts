import { 
  AdminUser, 
  AdminComment, 
  AdminActivityLog, 
  UserManagement, 
  ProfileApproval, 
  SubscriptionData, 
  PaymentHistory, 
  DashboardMetrics, 
  ChartData, 
  RecentActivity,
  mockAdminUser,
  mockDashboardMetrics
} from './admin-constants'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data generators
const generateMockUsers = (count: number): UserManagement[] => {
  const names = ['Ahmed Khan', 'Sarah Ali', 'Fatima Sheikh', 'Omar Hassan', 'Aisha Malik', 'Zain Ahmed']
  const statuses: Array<'active' | 'pending' | 'blocked' | 'suspended'> = ['active', 'pending', 'blocked', 'suspended']
  const plans: Array<'free' | 'golden' | 'diamond' | 'elite'> = ['free', 'golden', 'diamond', 'elite']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `user${i + 1}@example.com`,
    photo: `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face`,
    registrationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    subscriptionPlan: plans[Math.floor(Math.random() * plans.length)],
    isVerified: Math.random() > 0.3,
    profileCompletion: Math.floor(Math.random() * 100),
    totalMatches: Math.floor(Math.random() * 50),
    reportsCount: Math.floor(Math.random() * 5)
  }))
}

const generateMockComments = (count: number): AdminComment[] => {
  const categories: Array<AdminComment['category']> = ['background_check', 'verification', 'support', 'matchmaking', 'red_flag', 'general']
  const comments = [
    'Profile verification completed successfully',
    'Background check shows clean record',
    'User reported for inappropriate behavior',
    'Excellent match potential based on preferences',
    'Red flag: Multiple fake photos detected',
    'Customer support ticket resolved'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    profileId: Math.floor(Math.random() * 100) + 1,
    adminId: 1,
    adminName: 'John Admin',
    comment: comments[i % comments.length],
    category: categories[Math.floor(Math.random() * categories.length)],
    isResolved: Math.random() > 0.4,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

const generateMockSubscriptions = (count: number): SubscriptionData[] => {
  const plans: Array<'golden' | 'diamond' | 'elite'> = ['golden', 'diamond', 'elite']
  const statuses: Array<'active' | 'expired' | 'cancelled' | 'pending'> = ['active', 'expired', 'cancelled', 'pending']
  const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId: i + 1,
    userName: `User ${i + 1}`,
    userEmail: `user${i + 1}@example.com`,
    planType: plans[Math.floor(Math.random() * plans.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    amount: Math.floor(Math.random() * 200) + 29,
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    autoRenew: Math.random() > 0.5
  }))
}

const generateChartData = (): ChartData => ({
  userRegistrations: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 50) + 10
  })),
  revenueChart: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en', { month: 'short' }),
    revenue: Math.floor(Math.random() * 50000) + 20000,
    subscriptions: Math.floor(Math.random() * 500) + 200
  })),
  subscriptionDistribution: [
    { name: 'Free', value: 65, color: '#94a3b8' },
    { name: 'Golden', value: 20, color: '#fbbf24' },
    { name: 'Diamond', value: 12, color: '#3b82f6' },
    { name: 'Elite', value: 3, color: '#8b5cf6' }
  ],
  topLocations: [
    { country: 'United States', users: 4520, percentage: 29.3 },
    { country: 'Pakistan', users: 3210, percentage: 20.8 },
    { country: 'India', users: 2890, percentage: 18.7 },
    { country: 'Canada', users: 1650, percentage: 10.7 },
    { country: 'United Kingdom', users: 1420, percentage: 9.2 }
  ]
})

// Admin API functions
export const adminApi = {
  // Authentication
  login: async (username: string, password: string): Promise<{ user: AdminUser; token: string }> => {
    await delay(1000)
    
    if (username === 'admin' && password === 'admin123') {
      return {
        user: mockAdminUser,
        token: 'mock-jwt-token'
      }
    }
    
    throw new Error('Invalid credentials')
  },

  // Dashboard
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    await delay(500)
    return mockDashboardMetrics
  },

  getChartData: async (): Promise<ChartData> => {
    await delay(600)
    return generateChartData()
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    await delay(400)
    return [
      {
        id: 1,
        type: 'registration',
        message: 'New user registered: Sarah Ahmed',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        userId: 123,
        severity: 'info'
      },
      {
        id: 2,
        type: 'approval',
        message: 'Profile approved: Ahmed Khan',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userId: 124,
        adminId: 1,
        severity: 'success'
      },
      {
        id: 3,
        type: 'subscription',
        message: 'New Diamond subscription: Fatima Ali',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        userId: 125,
        severity: 'success'
      },
      {
        id: 4,
        type: 'report',
        message: 'Profile reported: Suspicious activity detected',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        userId: 126,
        severity: 'warning'
      }
    ]
  },

  // User Management
  getUsers: async (page: number = 1, limit: number = 20, filters?: any): Promise<{
    users: UserManagement[]
    total: number
    page: number
    totalPages: number
  }> => {
    await delay(800)
    
    const allUsers = generateMockUsers(500)
    let filteredUsers = [...allUsers]
    
    // Apply filters
    if (filters?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status)
    }
    if (filters?.plan) {
      filteredUsers = filteredUsers.filter(user => user.subscriptionPlan === filters.plan)
    }
    if (filters?.search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  },

  updateUserStatus: async (userId: number, status: string): Promise<void> => {
    await delay(500)
    console.log(`Updated user ${userId} status to ${status}`)
  },

  blockUser: async (userId: number, reason: string): Promise<void> => {
    await delay(500)
    console.log(`Blocked user ${userId} for reason: ${reason}`)
  },

  deleteUser: async (userId: number): Promise<void> => {
    await delay(500)
    console.log(`Deleted user ${userId}`)
  },

  // Profile Management
  getPendingApprovals: async (): Promise<ProfileApproval[]> => {
    await delay(600)
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      userId: i + 100,
      userName: `User ${i + 100}`,
      userEmail: `user${i + 100}@example.com`,
      profileData: {
        name: `User ${i + 100}`,
        age: 25 + Math.floor(Math.random() * 15),
        profession: 'Software Engineer',
        location: 'New York, USA'
      },
      photos: [
        `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop&crop=face`
      ],
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }))
  },

  approveProfile: async (profileId: number, notes?: string): Promise<void> => {
    await delay(500)
    console.log(`Approved profile ${profileId} with notes: ${notes}`)
  },

  rejectProfile: async (profileId: number, reason: string): Promise<void> => {
    await delay(500)
    console.log(`Rejected profile ${profileId} for reason: ${reason}`)
  },

  requestChanges: async (profileId: number, changes: string): Promise<void> => {
    await delay(500)
    console.log(`Requested changes for profile ${profileId}: ${changes}`)
  },

  // Subscription Management
  getSubscriptions: async (page: number = 1, limit: number = 20): Promise<{
    subscriptions: SubscriptionData[]
    total: number
    page: number
    totalPages: number
  }> => {
    await delay(700)
    
    const allSubscriptions = generateMockSubscriptions(200)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSubscriptions = allSubscriptions.slice(startIndex, endIndex)
    
    return {
      subscriptions: paginatedSubscriptions,
      total: allSubscriptions.length,
      page,
      totalPages: Math.ceil(allSubscriptions.length / limit)
    }
  },

  getPaymentHistory: async (page: number = 1, limit: number = 20): Promise<{
    payments: PaymentHistory[]
    total: number
    page: number
    totalPages: number
  }> => {
    await delay(600)
    
    const allPayments: PaymentHistory[] = Array.from({ length: 300 }, (_, i) => ({
      id: i + 1,
      userId: Math.floor(Math.random() * 100) + 1,
      userName: `User ${Math.floor(Math.random() * 100) + 1}`,
      subscriptionId: Math.floor(Math.random() * 50) + 1,
      amount: Math.floor(Math.random() * 200) + 29,
      currency: 'USD',
      status: ['success', 'failed', 'pending', 'refunded'][Math.floor(Math.random() * 4)] as any,
      paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    }))
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPayments = allPayments.slice(startIndex, endIndex)
    
    return {
      payments: paginatedPayments,
      total: allPayments.length,
      page,
      totalPages: Math.ceil(allPayments.length / limit)
    }
  },

  // Admin Comments
  getComments: async (profileId?: number): Promise<AdminComment[]> => {
    await delay(500)
    const allComments = generateMockComments(50)
    
    if (profileId) {
      return allComments.filter(comment => comment.profileId === profileId)
    }
    
    return allComments
  },

  addComment: async (profileId: number, comment: string, category: string): Promise<AdminComment> => {
    await delay(400)
    
    const newComment: AdminComment = {
      id: Date.now(),
      profileId,
      adminId: 1,
      adminName: 'John Admin',
      comment,
      category: category as AdminComment['category'],
      isResolved: false,
      createdAt: new Date().toISOString()
    }
    
    console.log('Added comment:', newComment)
    return newComment
  },

  updateComment: async (commentId: number, updates: Partial<AdminComment>): Promise<void> => {
    await delay(300)
    console.log(`Updated comment ${commentId}:`, updates)
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await delay(300)
    console.log(`Deleted comment ${commentId}`)
  },

  // Activity Logs
  getActivityLogs: async (page: number = 1, limit: number = 50): Promise<{
    logs: AdminActivityLog[]
    total: number
    page: number
    totalPages: number
  }> => {
    await delay(500)
    
    const allLogs: AdminActivityLog[] = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      adminId: 1,
      adminName: 'John Admin',
      action: ['User Updated', 'Profile Approved', 'Comment Added', 'Subscription Modified'][Math.floor(Math.random() * 4)],
      details: `Action performed on user/profile ${Math.floor(Math.random() * 100) + 1}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = allLogs.slice(startIndex, endIndex)
    
    return {
      logs: paginatedLogs,
      total: allLogs.length,
      page,
      totalPages: Math.ceil(allLogs.length / limit)
    }
  },

  // Export functions
  exportUsers: async (format: 'csv' | 'excel', filters?: any): Promise<string> => {
    await delay(2000)
    console.log(`Exporting users as ${format} with filters:`, filters)
    return 'mock-download-url'
  },

  exportPayments: async (format: 'csv' | 'excel', dateRange?: { start: string; end: string }): Promise<string> => {
    await delay(2000)
    console.log(`Exporting payments as ${format} for date range:`, dateRange)
    return 'mock-download-url'
  }
}