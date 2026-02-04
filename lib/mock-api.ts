// Mock API functions for dashboard

export interface UserProfile {
  id: string
  fullName: string
  email: string
  avatar?: string
  subscriptionStatus: 'free' | 'premium' | 'gold'
  profileCompleted: number // percentage
  isProfilePublished: boolean
  joinDate: string
  lastActive: string
}

export interface DashboardStats {
  profilesViewedToday: number
  totalMatches: number
  subscriptionDaysLeft: number
  isFeatured: boolean
  profileViews: number
  likesReceived: number
}

export interface RecentActivity {
  id: string
  type: 'profile_view' | 'match' | 'message' | 'like_received' | 'profile_update'
  message: string
  timestamp: string
  avatar?: string
}

// Mock user data
const mockUser: UserProfile = {
  id: '1',
  fullName: 'Ahmed Khan',
  email: 'ahmed.khan@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  subscriptionStatus: 'premium',
  profileCompleted: 65,
  isProfilePublished: false,
  joinDate: '2024-01-15',
  lastActive: new Date().toISOString()
}

const mockStats: DashboardStats = {
  profilesViewedToday: 12,
  totalMatches: 8,
  subscriptionDaysLeft: 25,
  isFeatured: true,
  profileViews: 156,
  likesReceived: 23
}

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'like_received',
    message: 'Sarah Ahmed liked your profile',
    timestamp: '2024-01-20T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: '2',
    type: 'profile_view',
    message: 'Your profile was viewed by Fatima Ali',
    timestamp: '2024-01-20T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: '3',
    type: 'match',
    message: 'New match found: Zara Sheikh',
    timestamp: '2024-01-19T16:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: '4',
    type: 'profile_update',
    message: 'Profile updated successfully',
    timestamp: '2024-01-19T14:20:00Z'
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const mockApi = {
  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    await delay(500)
    return mockUser
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300)
    return mockStats
  },

  // Get recent activities
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    await delay(400)
    return mockActivities
  },

  // Save profile section
  saveProfileSection: async (section: string, data: any): Promise<{ success: boolean; message: string }> => {
    await delay(800)
    console.log(`Saving ${section}:`, data)
    
    // Simulate occasional errors
    if (Math.random() < 0.1) {
      throw new Error('Failed to save profile section')
    }
    
    return {
      success: true,
      message: `${section} saved successfully`
    }
  },

  // Update profile completion
  updateProfileCompletion: async (percentage: number): Promise<void> => {
    await delay(200)
    mockUser.profileCompleted = percentage
    console.log(`Profile completion updated to ${percentage}%`)
  },

  // Publish/unpublish profile
  toggleProfilePublish: async (isPublished: boolean): Promise<{ success: boolean; message: string }> => {
    await delay(500)
    mockUser.isProfilePublished = isPublished
    console.log(`Profile ${isPublished ? 'published' : 'unpublished'}`)
    
    return {
      success: true,
      message: `Profile ${isPublished ? 'published' : 'unpublished'} successfully`
    }
  },

  // Upload photos
  uploadPhotos: async (files: File[]): Promise<{ success: boolean; urls: string[] }> => {
    await delay(1500)
    
    // Simulate photo upload
    const urls = files.map((_, index) => 
      `https://images.unsplash.com/photo-${Date.now() + index}?w=400&h=400&fit=crop`
    )
    
    console.log('Photos uploaded:', urls)
    
    return {
      success: true,
      urls
    }
  },

  // Get profile data for editing
  getProfileData: async (): Promise<any> => {
    await delay(600)
    
    // Return mock profile data
    return {
      personalInfo: {
        fullName: 'Ahmed Khan',
        gender: 'male',
        dateOfBirth: '1990-05-15',
        height: '5\'10"',
        weight: 75,
        weightUnit: 'kg',
        complexion: 'Fair',
        maritalStatus: 'Never Married',
        profileCreatedFor: 'Self'
      },
      religiousBackground: {
        religion: 'Islam',
        religiousSubcategory: 'Sunni',
        caste: 'Khan',
        motherTongue: 'Urdu',
        ethnicity: 'Pakistani',
        familyValues: ['Traditional', 'Moderate'],
        religiousPractice: 4
      },
      professionalLocation: {
        jobBusiness: 'job',
        jobTitle: 'Software Engineer',
        companyName: 'Tech Solutions Inc.',
        industry: 'Information Technology',
        annualIncome: 85000,
        companyAddress: '123 Tech Street, San Francisco, CA',
        countryOfWork: 'United States'
      },
      lifestylePreferences: {
        education: 'Master\'s Degree',
        occupationDetails: 'Full-stack developer with 5 years experience',
        dietaryHabits: 'Non-Vegetarian',
        hobbiesInterests: ['Reading', 'Traveling', 'Photography', 'Cooking'],
        aboutYourself: 'I am a passionate software engineer who loves to travel and explore new cultures. I believe in maintaining a balance between work and personal life.',
        lifeGoals: 'To build a successful career while maintaining strong family values and contributing to society.',
        preferredAgeMin: 24,
        preferredAgeMax: 30,
        preferredHeightMin: '5\'2"',
        preferredHeightMax: '5\'8"',
        preferredReligion: ['Islam'],
        preferredCaste: ['Khan', 'Sheikh', 'Mughal'],
        preferredEducation: ['Bachelor\'s Degree', 'Master\'s Degree'],
        preferredLocation: ['United States', 'Canada', 'Pakistan'],
        preferredIncomeMin: 40000,
        preferredIncomeMax: 100000,
        otherPreferences: 'Looking for someone who shares similar values and interests.'
      },
      photos: {
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        additionalPhotos: [
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
        ]
      }
    }
  }
}