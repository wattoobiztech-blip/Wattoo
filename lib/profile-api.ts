// Profile API utilities for the matrimonial website

import { ProfileData } from './profile-constants'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from './image-constants'

// Mock profile data - replace with actual API calls
export const mockProfiles: Record<string, ProfileData> = {
  '1': {
    id: '1',
    name: 'Ayesha Khan',
    age: 26,
    profession: 'Software Engineer',
    company: 'Tech Solutions Pvt Ltd',
    education: 'Masters in Computer Science',
    university: 'University of Karachi',
    cast: 'Khan',
    religion: 'Islam',
    location: 'Karachi, Pakistan',
    height: '5\'4"',
    weight: '55 kg',
    maritalStatus: 'Never Married',
    motherTongue: 'Urdu',
    languages: ['Urdu', 'English', 'Punjabi'],
    income: '₹8-12 Lakhs',
    images: [
      getImageSrc(PROFILE_IMAGES.ayesha, FALLBACK_IMAGES.profiles.ayesha),
      getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima),
      getImageSrc(PROFILE_IMAGES.zara, FALLBACK_IMAGES.profiles.zara),
    ],
    verified: true,
    premium: true,
    online: true,
    lastSeen: '2 hours ago',
    joinedDate: 'January 2024',
    profileViews: 1247,
    likes: 245,
    rating: 4.9,
    responseRate: '95%',
    responseTime: 'Within 2 hours',
    about: 'I am a passionate software engineer who loves creating innovative solutions. I believe in living life to the fullest while maintaining strong family values. Looking for a life partner who shares similar interests and values.',
    familyInfo: {
      fatherOccupation: 'Business Owner',
      motherOccupation: 'Teacher',
      siblings: '1 Brother, 1 Sister',
      familyType: 'Nuclear Family',
      familyValues: 'Traditional with modern outlook',
      familyIncome: '₹15-20 Lakhs'
    },
    lifestyle: {
      diet: 'Vegetarian',
      drinking: 'Never',
      smoking: 'Never',
      exercise: 'Regular',
      pets: 'Love pets'
    },
    interests: [
      'Reading', 'Traveling', 'Cooking', 'Photography', 
      'Music', 'Dancing', 'Fitness', 'Technology'
    ],
    preferences: {
      ageRange: '26-32',
      heightRange: '5\'6" - 6\'2"',
      education: 'Graduate or above',
      profession: 'Any',
      location: 'Pakistan',
      maritalStatus: 'Never Married'
    },
    socialMedia: {
      instagram: '@ayesha_khan',
      facebook: 'ayesha.khan.dev',
      linkedin: 'ayesha-khan-dev'
    },
    achievements: [
      'Employee of the Year 2023',
      'Published Research Paper',
      'Volunteer at NGO'
    ],
    compatibilityScore: 92,
    matchPercentage: 87,
    commonInterests: ['Reading', 'Technology', 'Traveling'],
    mutualConnections: 5
  },
  '2': {
    id: '2',
    name: 'Ahmed Ali',
    age: 29,
    profession: 'Doctor',
    company: 'Aga Khan Hospital',
    education: 'MBBS',
    university: 'Dow University',
    cast: 'Syed',
    religion: 'Islam',
    location: 'Lahore, Pakistan',
    height: '5\'10"',
    weight: '75 kg',
    maritalStatus: 'Never Married',
    motherTongue: 'Urdu',
    languages: ['Urdu', 'English', 'Arabic'],
    income: '₹12-20 Lakhs',
    images: [
      getImageSrc(PROFILE_IMAGES.ahmed, FALLBACK_IMAGES.profiles.ahmed),
    ],
    verified: true,
    premium: false,
    online: false,
    lastSeen: '1 day ago',
    joinedDate: 'December 2023',
    profileViews: 892,
    likes: 189,
    rating: 4.8,
    responseRate: '88%',
    responseTime: 'Within 6 hours',
    about: 'Dedicated medical professional with a passion for helping others. I value honesty, compassion, and family traditions. Seeking a life partner who understands the demands of medical profession.',
    familyInfo: {
      fatherOccupation: 'Retired Government Officer',
      motherOccupation: 'Housewife',
      siblings: '2 Sisters',
      familyType: 'Joint Family',
      familyValues: 'Traditional',
      familyIncome: '₹10-15 Lakhs'
    },
    lifestyle: {
      diet: 'Non-Vegetarian',
      drinking: 'Never',
      smoking: 'Never',
      exercise: 'Sometimes',
      pets: 'Neutral'
    },
    interests: [
      'Reading', 'Cricket', 'Traveling', 'Medical Research', 
      'Community Service', 'Photography'
    ],
    preferences: {
      ageRange: '22-28',
      heightRange: '5\'2" - 5\'8"',
      education: 'Graduate or above',
      profession: 'Any',
      location: 'Pakistan',
      maritalStatus: 'Never Married'
    },
    achievements: [
      'Best Resident Doctor 2023',
      'Medical Research Publication',
      'Community Health Award'
    ],
    compatibilityScore: 85,
    matchPercentage: 78,
    commonInterests: ['Reading', 'Cricket', 'Community Service'],
    mutualConnections: 3
  }
}

// API Functions
export async function getProfile(id: string): Promise<ProfileData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return mockProfiles[id] || null
}

export async function updateProfile(id: string, updates: Partial<ProfileData>): Promise<ProfileData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (mockProfiles[id]) {
    mockProfiles[id] = { ...mockProfiles[id], ...updates }
    return mockProfiles[id]
  }
  
  return null
}

export async function likeProfile(profileId: string, userId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // In real implementation, this would update the database
  if (mockProfiles[profileId]) {
    mockProfiles[profileId].likes += 1
    return true
  }
  
  return false
}

export async function unlikeProfile(profileId: string, userId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // In real implementation, this would update the database
  if (mockProfiles[profileId] && mockProfiles[profileId].likes > 0) {
    mockProfiles[profileId].likes -= 1
    return true
  }
  
  return false
}

export async function sendMessage(fromUserId: string, toUserId: string, message: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In real implementation, this would create a message in the database
  console.log(`Message sent from ${fromUserId} to ${toUserId}: ${message}`)
  
  return true
}

export async function reportProfile(profileId: string, reason: string, details?: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // In real implementation, this would create a report in the database
  console.log(`Profile ${profileId} reported for: ${reason}`, details)
  
  return true
}

export async function blockProfile(profileId: string, userId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // In real implementation, this would update the user's blocked list
  console.log(`Profile ${profileId} blocked by user ${userId}`)
  
  return true
}

export async function getProfileViews(profileId: string): Promise<number> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return mockProfiles[profileId]?.profileViews || 0
}

export async function incrementProfileView(profileId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (mockProfiles[profileId]) {
    mockProfiles[profileId].profileViews += 1
  }
}

// Profile completion calculation
export function calculateProfileCompletion(profile: Partial<ProfileData>): number {
  const requiredFields = [
    'name', 'age', 'profession', 'education', 'location', 'cast',
    'maritalStatus', 'about', 'images', 'familyInfo', 'lifestyle', 'preferences'
  ]
  
  let completedFields = 0
  
  requiredFields.forEach(field => {
    if (field === 'images' && profile.images && profile.images.length > 0) {
      completedFields++
    } else if (field === 'familyInfo' && profile.familyInfo) {
      const familyFields = Object.values(profile.familyInfo).filter(Boolean)
      if (familyFields.length >= 4) completedFields++
    } else if (field === 'lifestyle' && profile.lifestyle) {
      const lifestyleFields = Object.values(profile.lifestyle).filter(Boolean)
      if (lifestyleFields.length >= 3) completedFields++
    } else if (field === 'preferences' && profile.preferences) {
      const preferenceFields = Object.values(profile.preferences).filter(Boolean)
      if (preferenceFields.length >= 4) completedFields++
    } else if (profile[field as keyof ProfileData]) {
      completedFields++
    }
  })
  
  return Math.round((completedFields / requiredFields.length) * 100)
}

// Search and filter functions
export async function searchProfiles(filters: {
  ageRange?: [number, number]
  location?: string
  cast?: string
  profession?: string
  education?: string
  maritalStatus?: string
  verified?: boolean
  premium?: boolean
  online?: boolean
}): Promise<ProfileData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  let results = Object.values(mockProfiles)
  
  // Apply filters
  if (filters.ageRange) {
    results = results.filter(p => p.age >= filters.ageRange![0] && p.age <= filters.ageRange![1])
  }
  
  if (filters.location) {
    results = results.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()))
  }
  
  if (filters.cast) {
    results = results.filter(p => p.cast.toLowerCase() === filters.cast!.toLowerCase())
  }
  
  if (filters.profession) {
    results = results.filter(p => p.profession.toLowerCase().includes(filters.profession!.toLowerCase()))
  }
  
  if (filters.verified !== undefined) {
    results = results.filter(p => p.verified === filters.verified)
  }
  
  if (filters.premium !== undefined) {
    results = results.filter(p => p.premium === filters.premium)
  }
  
  if (filters.online !== undefined) {
    results = results.filter(p => p.online === filters.online)
  }
  
  return results
}