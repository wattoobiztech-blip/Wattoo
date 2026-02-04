// Profile-related constants and types for the matrimonial website

export interface ProfileData {
  id: string
  name: string
  age: number
  profession: string
  company?: string
  education: string
  university?: string
  cast: string
  religion: string
  location: string
  height: string
  weight?: string
  maritalStatus: string
  motherTongue: string
  languages: string[]
  income: string
  images: string[]
  verified: boolean
  premium: boolean
  online: boolean
  lastSeen: string
  joinedDate: string
  profileViews: number
  likes: number
  rating: number
  responseRate: string
  responseTime: string
  about: string
  familyInfo: FamilyInfo
  lifestyle: LifestyleInfo
  interests: string[]
  preferences: PartnerPreferences
  socialMedia?: SocialMediaInfo
  achievements?: string[]
  compatibilityScore?: number
  matchPercentage?: number
  commonInterests?: string[]
  mutualConnections?: number
}

export interface FamilyInfo {
  fatherOccupation: string
  motherOccupation: string
  siblings: string
  familyType: string
  familyValues: string
  familyIncome: string
}

export interface LifestyleInfo {
  diet: string
  drinking: string
  smoking: string
  exercise: string
  pets: string
}

export interface PartnerPreferences {
  ageRange: string
  heightRange: string
  education: string
  profession: string
  location: string
  maritalStatus: string
}

export interface SocialMediaInfo {
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
}

// Pakistani Castes
export const PAKISTANI_CASTES = [
  'Rajput', 'Jatt', 'Arain', 'Gujjar', 'Sheikh', 'Malik', 
  'Chaudhry', 'Butt', 'Khan', 'Syed', 'Mughal', 'Pathan', 
  'Baloch', 'Sindhi', 'Awan', 'Khatri', 'Other'
] as const

// Pakistani Cities
export const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Abbottabad',
  'Mardan', 'Kasur', 'Mingora', 'Rahim Yar Khan', 'Sahiwal'
] as const

// Professions
export const PROFESSIONS = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Lawyer',
  'Chartered Accountant', 'Marketing Manager', 'Sales Executive', 'Banker',
  'Government Officer', 'Engineer', 'Architect', 'Designer', 'Consultant',
  'Entrepreneur', 'Freelancer', 'Student', 'Other'
] as const

// Education Levels
export const EDUCATION_LEVELS = [
  'High School', 'Intermediate', 'Bachelor\'s Degree', 'Master\'s Degree',
  'PhD', 'Diploma', 'Professional Degree', 'Other'
] as const

// Marital Status Options
export const MARITAL_STATUS = [
  'Never Married', 'Divorced', 'Widowed', 'Separated'
] as const

// Languages
export const LANGUAGES = [
  'Urdu', 'English', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi',
  'Saraiki', 'Hindko', 'Arabic', 'Persian', 'Other'
] as const

// Income Ranges
export const INCOME_RANGES = [
  'Below ₹3 Lakhs', '₹3-5 Lakhs', '₹5-8 Lakhs', '₹8-12 Lakhs',
  '₹12-20 Lakhs', '₹20-30 Lakhs', '₹30+ Lakhs', 'Prefer not to say'
] as const

// Height Options
export const HEIGHT_OPTIONS = [
  '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"',
  '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"',
  '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"',
  '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"'
] as const

// Lifestyle Options
export const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain Vegetarian'] as const
export const DRINKING_OPTIONS = ['Never', 'Occasionally', 'Socially', 'Regularly'] as const
export const SMOKING_OPTIONS = ['Never', 'Occasionally', 'Regularly', 'Trying to quit'] as const
export const EXERCISE_OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Regular', 'Daily'] as const

// Common Interests
export const INTERESTS = [
  'Reading', 'Traveling', 'Cooking', 'Photography', 'Music', 'Dancing',
  'Fitness', 'Technology', 'Sports', 'Movies', 'Art', 'Writing',
  'Gardening', 'Shopping', 'Gaming', 'Yoga', 'Swimming', 'Cricket',
  'Football', 'Badminton', 'Tennis', 'Hiking', 'Cycling', 'Painting'
] as const

// Family Types
export const FAMILY_TYPES = [
  'Nuclear Family', 'Joint Family', 'Extended Family'
] as const

// Family Values
export const FAMILY_VALUES = [
  'Traditional', 'Modern', 'Traditional with modern outlook',
  'Liberal', 'Conservative', 'Moderate'
] as const

// Profile Validation Rules
export const PROFILE_VALIDATION = {
  name: {
    minLength: 2,
    maxLength: 50,
    required: true
  },
  age: {
    min: 18,
    max: 80,
    required: true
  },
  about: {
    minLength: 50,
    maxLength: 1000,
    required: true
  },
  images: {
    min: 1,
    max: 10,
    required: true
  }
} as const

// Profile Completion Steps
export const PROFILE_STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Name, age, location, profession',
    fields: ['name', 'age', 'location', 'profession']
  },
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Physical attributes, education, family',
    fields: ['height', 'education', 'cast', 'maritalStatus']
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Interests',
    description: 'Habits, hobbies, preferences',
    fields: ['diet', 'interests', 'lifestyle']
  },
  {
    id: 'photos',
    title: 'Photos',
    description: 'Upload your best photos',
    fields: ['images']
  },
  {
    id: 'preferences',
    title: 'Partner Preferences',
    description: 'What you\'re looking for',
    fields: ['preferences']
  }
] as const

// Profile Status
export const PROFILE_STATUS = {
  INCOMPLETE: 'incomplete',
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  PREMIUM: 'premium',
  SUSPENDED: 'suspended'
} as const

// Privacy Settings
export const PRIVACY_SETTINGS = {
  PROFILE_VISIBILITY: {
    PUBLIC: 'public',
    MEMBERS_ONLY: 'members_only',
    PREMIUM_ONLY: 'premium_only'
  },
  CONTACT_VISIBILITY: {
    ALL: 'all',
    PREMIUM_ONLY: 'premium_only',
    VERIFIED_ONLY: 'verified_only'
  },
  PHOTO_VISIBILITY: {
    ALL: 'all',
    MEMBERS_ONLY: 'members_only',
    PREMIUM_ONLY: 'premium_only',
    PROTECTED: 'protected'
  }
} as const