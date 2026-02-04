import { Profile, SearchFilters, mockProfiles } from './search-constants'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface SearchResult {
  profiles: Profile[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface MatchingPreferences {
  religiousWeight: number
  ageWeight: number
  educationWeight: number
  locationWeight: number
  lifestyleWeight: number
  dealBreakers: string[]
  priorityPreferences: string[]
}

export interface DailyMatch {
  profile: Profile
  compatibility: number
  reasons: string[]
  commonInterests: string[]
}

export interface SubscriptionInfo {
  plan: 'free' | 'golden' | 'diamond' | 'elite'
  status: 'active' | 'expired' | 'cancelled'
  startDate: string
  endDate: string
  features: string[]
  usage: {
    profileViews: number
    profileViewsLimit: number
    interests: number
    interestsLimit: number
  }
}

// Mock search API
export const searchApi = {
  // Search profiles with filters
  searchProfiles: async (
    filters: Partial<SearchFilters>,
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'relevance'
  ): Promise<SearchResult> => {
    await delay(800)
    
    let filteredProfiles = [...mockProfiles]
    
    // Apply filters
    if (filters.gender && filters.gender !== 'both') {
      filteredProfiles = filteredProfiles.filter(p => p.gender === filters.gender)
    }
    
    if (filters.ageMin || filters.ageMax) {
      filteredProfiles = filteredProfiles.filter(p => {
        const ageMin = filters.ageMin || 18
        const ageMax = filters.ageMax || 70
        return p.age >= ageMin && p.age <= ageMax
      })
    }
    
    if (filters.religion && filters.religion.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.religion!.includes(p.religion)
      )
    }
    
    if (filters.caste && filters.caste.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.caste!.includes(p.caste)
      )
    }
    
    if (filters.country) {
      filteredProfiles = filteredProfiles.filter(p => p.country === filters.country)
    }
    
    if (filters.education && filters.education.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.education!.includes(p.education)
      )
    }
    
    if (filters.incomeMin || filters.incomeMax) {
      filteredProfiles = filteredProfiles.filter(p => {
        const incomeMin = filters.incomeMin || 0
        const incomeMax = filters.incomeMax || 1000000
        return p.income >= incomeMin && p.income <= incomeMax
      })
    }
    
    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.maritalStatus!.includes(p.maritalStatus)
      )
    }
    
    if (filters.dietaryPreference && filters.dietaryPreference.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.dietaryPreference!.includes(p.dietaryPreference)
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredProfiles.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
        break
      case 'age_asc':
        filteredProfiles.sort((a, b) => a.age - b.age)
        break
      case 'age_desc':
        filteredProfiles.sort((a, b) => b.age - a.age)
        break
      case 'income_desc':
        filteredProfiles.sort((a, b) => b.income - a.income)
        break
      case 'compatibility':
        filteredProfiles.sort((a, b) => b.compatibility - a.compatibility)
        break
      default: // relevance
        filteredProfiles.sort((a, b) => b.compatibility - a.compatibility)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex)
    
    return {
      profiles: paginatedProfiles,
      total: filteredProfiles.length,
      page,
      limit,
      hasMore: endIndex < filteredProfiles.length
    }
  },

  // Get daily matches
  getDailyMatches: async (): Promise<DailyMatch[]> => {
    await delay(600)
    
    const matches: DailyMatch[] = mockProfiles.slice(0, 5).map(profile => ({
      profile,
      compatibility: profile.compatibility,
      reasons: [
        'Similar religious background',
        'Compatible age range',
        'Same education level',
        'Shared interests in travel'
      ],
      commonInterests: ['Travel', 'Reading', 'Movies', 'Cooking']
    }))
    
    return matches
  },

  // Save search
  saveSearch: async (name: string, filters: Partial<SearchFilters>): Promise<void> => {
    await delay(300)
    console.log('Saving search:', { name, filters })
    
    // Get existing saved searches
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    
    // Add new search
    savedSearches.push({
      id: Date.now(),
      name,
      filters,
      createdAt: new Date().toISOString()
    })
    
    // Save to localStorage
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
  },

  // Get saved searches
  getSavedSearches: async (): Promise<any[]> => {
    await delay(200)
    return JSON.parse(localStorage.getItem('savedSearches') || '[]')
  },

  // Delete saved search
  deleteSavedSearch: async (id: number): Promise<void> => {
    await delay(200)
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const filtered = savedSearches.filter((search: any) => search.id !== id)
    localStorage.setItem('savedSearches', JSON.stringify(filtered))
  },

  // Get recent searches
  getRecentSearches: async (): Promise<any[]> => {
    await delay(200)
    return JSON.parse(localStorage.getItem('recentSearches') || '[]')
  },

  // Add to recent searches
  addToRecentSearches: async (filters: Partial<SearchFilters>): Promise<void> => {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    
    // Add to beginning and limit to 10
    recentSearches.unshift({
      id: Date.now(),
      filters,
      searchedAt: new Date().toISOString()
    })
    
    // Keep only last 10 searches
    const limited = recentSearches.slice(0, 10)
    localStorage.setItem('recentSearches', JSON.stringify(limited))
  },

  // Get matching preferences
  getMatchingPreferences: async (): Promise<MatchingPreferences> => {
    await delay(300)
    return {
      religiousWeight: 30,
      ageWeight: 20,
      educationWeight: 15,
      locationWeight: 15,
      lifestyleWeight: 20,
      dealBreakers: ['smoking', 'drinking'],
      priorityPreferences: ['religion', 'education', 'location']
    }
  },

  // Update matching preferences
  updateMatchingPreferences: async (preferences: MatchingPreferences): Promise<void> => {
    await delay(400)
    console.log('Updating matching preferences:', preferences)
    localStorage.setItem('matchingPreferences', JSON.stringify(preferences))
  },

  // Get subscription info
  getSubscriptionInfo: async (): Promise<SubscriptionInfo> => {
    await delay(300)
    return {
      plan: 'diamond',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      features: [
        'Unlimited profile views',
        'Advanced search filters',
        'See who viewed your profile',
        'Priority listing in search'
      ],
      usage: {
        profileViews: 45,
        profileViewsLimit: -1, // -1 means unlimited
        interests: 12,
        interestsLimit: -1
      }
    }
  },

  // Process subscription
  processSubscription: async (planId: string, billingCycle: 'monthly' | 'yearly', paymentData: any): Promise<{ success: boolean; subscriptionId: string }> => {
    await delay(2000) // Simulate payment processing
    
    console.log('Processing subscription:', { planId, billingCycle, paymentData })
    
    // Simulate occasional payment failures
    if (Math.random() < 0.1) {
      throw new Error('Payment failed. Please try again.')
    }
    
    return {
      success: true,
      subscriptionId: `sub_${Date.now()}`
    }
  },

  // Like/Unlike profile
  toggleLike: async (profileId: number): Promise<{ liked: boolean }> => {
    await delay(300)
    
    const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles') || '[]')
    const isLiked = likedProfiles.includes(profileId)
    
    if (isLiked) {
      const filtered = likedProfiles.filter((id: number) => id !== profileId)
      localStorage.setItem('likedProfiles', JSON.stringify(filtered))
      return { liked: false }
    } else {
      likedProfiles.push(profileId)
      localStorage.setItem('likedProfiles', JSON.stringify(likedProfiles))
      return { liked: true }
    }
  },

  // Save/Unsave profile
  toggleSave: async (profileId: number): Promise<{ saved: boolean }> => {
    await delay(300)
    
    const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '[]')
    const isSaved = savedProfiles.includes(profileId)
    
    if (isSaved) {
      const filtered = savedProfiles.filter((id: number) => id !== profileId)
      localStorage.setItem('savedProfiles', JSON.stringify(filtered))
      return { saved: false }
    } else {
      savedProfiles.push(profileId)
      localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles))
      return { saved: true }
    }
  },

  // Get profile details
  getProfile: async (profileId: number): Promise<Profile | null> => {
    await delay(400)
    return mockProfiles.find(p => p.id === profileId) || null
  }
}