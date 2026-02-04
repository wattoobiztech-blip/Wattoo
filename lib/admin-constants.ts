// Admin panel constants and types

export interface AdminUser {
  id: number
  username: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator' | 'support'
  lastLogin: string
  isActive: boolean
  avatar?: string
  createdAt: string
}

export interface AdminComment {
  id: number
  profileId: number
  adminId: number
  adminName: string
  comment: string
  category: 'background_check' | 'verification' | 'support' | 'matchmaking' | 'red_flag' | 'general'
  isResolved: boolean
  createdAt: string
  updatedAt?: string
  attachments?: string[]
}

export interface AdminActivityLog {
  id: number
  adminId: number
  adminName: string
  action: string
  details: string
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface UserManagement {
  id: number
  name: string
  email: string
  photo?: string
  registrationDate: string
  lastLogin: string
  status: 'active' | 'pending' | 'blocked' | 'suspended'
  subscriptionPlan: 'free' | 'golden' | 'diamond' | 'elite'
  isVerified: boolean
  profileCompletion: number
  totalMatches: number
  reportsCount: number
}

export interface ProfileApproval {
  id: number
  userId: number
  userName: string
  userEmail: string
  profileData: any
  photos: string[]
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested'
  reviewedBy?: number
  reviewedAt?: string
  reviewNotes?: string
}

export interface SubscriptionData {
  id: number
  userId: number
  userName: string
  userEmail: string
  planType: 'golden' | 'diamond' | 'elite'
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startDate: string
  endDate: string
  amount: number
  paymentMethod: string
  autoRenew: boolean
}

export interface PaymentHistory {
  id: number
  userId: number
  userName: string
  subscriptionId: number
  amount: number
  currency: string
  status: 'success' | 'failed' | 'pending' | 'refunded'
  paymentMethod: string
  transactionId: string
  createdAt: string
  refundedAt?: string
  refundAmount?: number
}

export interface DashboardMetrics {
  totalUsers: number
  totalUsersChange: number
  activeProfiles: number
  activeProfilesChange: number
  pendingApprovals: number
  pendingApprovalsChange: number
  todayRevenue: number
  todayRevenueChange: number
  totalSubscriptions: number
  totalSubscriptionsChange: number
  matchSuccessRate: number
  matchSuccessRateChange: number
}

export interface ChartData {
  userRegistrations: Array<{ date: string; count: number }>
  revenueChart: Array<{ month: string; revenue: number; subscriptions: number }>
  subscriptionDistribution: Array<{ name: string; value: number; color: string }>
  topLocations: Array<{ country: string; users: number; percentage: number }>
}

export interface RecentActivity {
  id: number
  type: 'registration' | 'approval' | 'subscription' | 'admin_action' | 'report'
  message: string
  timestamp: string
  userId?: number
  adminId?: number
  severity: 'info' | 'success' | 'warning' | 'error'
}

// Admin roles and permissions
export const adminRoles = {
  super_admin: {
    name: 'Super Admin',
    permissions: ['all'],
    color: 'text-red-600 bg-red-100'
  },
  admin: {
    name: 'Admin',
    permissions: ['users', 'profiles', 'subscriptions', 'content', 'analytics'],
    color: 'text-blue-600 bg-blue-100'
  },
  moderator: {
    name: 'Moderator',
    permissions: ['profiles', 'content', 'comments'],
    color: 'text-green-600 bg-green-100'
  },
  support: {
    name: 'Support',
    permissions: ['users', 'comments'],
    color: 'text-yellow-600 bg-yellow-100'
  }
}

// Comment categories
export const commentCategories = [
  { value: 'background_check', label: 'Background Check', color: 'bg-red-100 text-red-700' },
  { value: 'verification', label: 'Verification Notes', color: 'bg-blue-100 text-blue-700' },
  { value: 'support', label: 'Customer Support', color: 'bg-green-100 text-green-700' },
  { value: 'matchmaking', label: 'Matchmaking Notes', color: 'bg-purple-100 text-purple-700' },
  { value: 'red_flag', label: 'Red Flags', color: 'bg-red-100 text-red-700' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-700' }
]

// Status options
export const userStatusOptions = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-700' },
  { value: 'suspended', label: 'Suspended', color: 'bg-orange-100 text-orange-700' }
]

export const subscriptionStatusOptions = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' }
]

export const paymentStatusOptions = [
  { value: 'success', label: 'Success', color: 'bg-green-100 text-green-700' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-700' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'refunded', label: 'Refunded', color: 'bg-blue-100 text-blue-700' }
]

// Navigation items
export const adminNavigation = [
  {
    category: 'DASHBOARD',
    items: [
      { name: 'Overview', href: '/admin', icon: 'LayoutDashboard' }
    ]
  },
  {
    category: 'USER MANAGEMENT',
    items: [
      { name: 'All Users', href: '/admin/users', icon: 'Users' },
      { name: 'Pending Approvals', href: '/admin/approvals', icon: 'Clock' },
      { name: 'Blocked Users', href: '/admin/blocked', icon: 'Ban' },
      { name: 'Reported Profiles', href: '/admin/reports', icon: 'Flag' }
    ]
  },
  {
    category: 'PROFILE MANAGEMENT',
    items: [
      { name: 'All Profiles', href: '/admin/profiles', icon: 'User' },
      { name: 'Featured Profiles', href: '/admin/featured', icon: 'Star' },
      { name: 'Verified Profiles', href: '/admin/verified', icon: 'CheckCircle' }
    ]
  },
  {
    category: 'SUBSCRIPTIONS',
    items: [
      { name: 'Active Subscriptions', href: '/admin/subscriptions', icon: 'Crown' },
      { name: 'Payment History', href: '/admin/payments', icon: 'DollarSign' },
      { name: 'Plan Management', href: '/admin/plans', icon: 'Settings' }
    ]
  },
  {
    category: 'CONTENT',
    items: [
      { name: 'Success Stories', href: '/admin/stories', icon: 'Trophy' },
      { name: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquare' },
      { name: 'Blog Posts', href: '/admin/blog', icon: 'FileText' }
    ]
  },
  {
    category: 'ANALYTICS',
    items: [
      { name: 'Site Analytics', href: '/admin/analytics', icon: 'BarChart3' },
      { name: 'User Reports', href: '/admin/user-reports', icon: 'BarChart2' },
      { name: 'Revenue Reports', href: '/admin/revenue', icon: 'TrendingUp' }
    ]
  },
  {
    category: 'SYSTEM',
    items: [
      { name: 'Admin Comments', href: '/admin/comments', icon: 'MessageCircle' },
      { name: 'Email Templates', href: '/admin/emails', icon: 'Mail' },
      { name: 'Settings', href: '/admin/settings', icon: 'Settings' }
    ]
  }
]

// Mock data for development
export const mockAdminUser: AdminUser = {
  id: 1,
  username: 'admin',
  name: 'John Admin',
  email: 'admin@rishta.com',
  role: 'super_admin',
  lastLogin: '2024-01-20T10:30:00Z',
  isActive: true,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: '2023-01-01T00:00:00Z'
}

export const mockDashboardMetrics: DashboardMetrics = {
  totalUsers: 15420,
  totalUsersChange: 12.5,
  activeProfiles: 8934,
  activeProfilesChange: 8.2,
  pendingApprovals: 45,
  pendingApprovalsChange: -15.3,
  todayRevenue: 2850,
  todayRevenueChange: 23.1,
  totalSubscriptions: 3421,
  totalSubscriptionsChange: 18.7,
  matchSuccessRate: 89.5,
  matchSuccessRateChange: 2.3
}