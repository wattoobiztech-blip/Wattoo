// Search and matching constants

export interface Profile {
  id: number
  name: string
  age: number
  gender: 'male' | 'female'
  religion: string
  caste: string
  education: string
  profession: string
  income: number
  location: string
  country: string
  state: string
  city: string
  photo: string
  compatibility: number
  isVerified: boolean
  isPremium: boolean
  height: string
  maritalStatus: string
  dietaryPreference: string
  smokingHabit: string
  drinkingHabit: string
  aboutMe: string
  lastActive: string
  profileViews: number
  joinedDate: string
}

export interface SearchFilters {
  gender: 'male' | 'female' | 'both'
  ageMin: number
  ageMax: number
  religion: string[]
  caste: string[]
  country: string
  state: string
  city: string
  distanceRadius: number
  education: string[]
  profession: string[]
  incomeMin: number
  incomeMax: number
  employmentType: 'job' | 'business' | 'both'
  maritalStatus: string[]
  heightMin: string
  heightMax: string
  dietaryPreference: string[]
  smokingHabit: string[]
  drinkingHabit: string[]
}

export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'both', label: 'Both' }
]

export const maritalStatusOptions = [
  'Never Married',
  'Divorced',
  'Widowed',
  'Separated',
  'Awaiting Divorce'
]

export const dietaryPreferenceOptions = [
  'Vegetarian',
  'Non-Vegetarian',
  'Eggetarian',
  'Vegan',
  'Jain Vegetarian'
]

export const smokingHabitOptions = [
  'Never',
  'Occasionally',
  'Regularly',
  'Trying to Quit'
]

export const drinkingHabitOptions = [
  'Never',
  'Socially',
  'Occasionally',
  'Regularly'
]

export const employmentTypeOptions = [
  { value: 'job', label: 'Job' },
  { value: 'business', label: 'Business' },
  { value: 'both', label: 'Both' }
]

// Religion options for search
export const religions = [
  'Islam',
  'Christianity',
  'Hinduism',
  'Sikhism',
  'Buddhism',
  'Judaism',
  'Other'
]

// Caste/Community options for search (Pakistani focused)
export const castes = [
  'Rajput',
  'Jatt',
  'Arain',
  'Sheikh',
  'Malik',
  'Awan',
  'Gujjar',
  'Syed',
  'Mughal',
  'Pathan',
  'Khan',
  'Butt',
  'Chaudhry',
  'Ansari',
  'Qureshi',
  'Brahmin',
  'Kshatriya',
  'Vaishya',
  'Other'
]

// Education options for search
export const educationOptions = [
  'High School',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD/Doctorate',
  'Professional Degree',
  'Trade/Vocational',
  'Other'
]

// Industry/Profession options for search
export const industryOptions = [
  'Information Technology',
  'Healthcare & Medical',
  'Education',
  'Finance & Banking',
  'Engineering',
  'Government/Public Sector',
  'Business/Entrepreneurship',
  'Media & Entertainment',
  'Legal',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Transportation',
  'Agriculture',
  'Other'
]

// Height options for search
export const heightOptions = [
  "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"",
  "7'0\""
]

export const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'age_asc', label: 'Age: Low to High' },
  { value: 'age_desc', label: 'Age: High to Low' },
  { value: 'income_desc', label: 'Income: High to Low' },
  { value: 'compatibility', label: 'Best Match' }
]

export const viewModes = [
  { value: 'grid', label: 'Grid View' },
  { value: 'list', label: 'List View' }
]

// Countries with states/cities
export const locationData = {
  'United States': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville']
  },
  'Pakistan': {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    'KPK': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat'],
    'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar']
  },
  'India': {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Delhi': ['New Delhi', 'Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem']
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge']
  }
}

// Subscription plans
export interface SubscriptionPlan {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  popular?: boolean
  color: string
  icon: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'golden',
    name: 'Golden Plan',
    price: {
      monthly: 29,
      yearly: 299
    },
    features: [
      'View 100 profiles/month',
      'Basic search filters',
      'Send 50 interests/month',
      'Profile highlighting',
      'Customer support',
      'Mobile app access',
      'Basic matching algorithm'
    ],
    color: 'from-yellow-400 to-yellow-600',
    icon: '🥇'
  },
  {
    id: 'diamond',
    name: 'Diamond Plan',
    price: {
      monthly: 59,
      yearly: 599
    },
    features: [
      'Everything in Golden Plan',
      'Unlimited profile views',
      'Advanced search filters',
      'See who viewed your profile',
      'Priority listing in search',
      'Read receipts in messages',
      'Monthly matchmaking report',
      'Video call feature',
      'Advanced matching algorithm'
    ],
    popular: true,
    color: 'from-blue-400 to-purple-600',
    icon: '💎'
  },
  {
    id: 'elite',
    name: 'Elite Plan',
    price: {
      monthly: 199,
      yearly: 1999
    },
    features: [
      'Everything in Diamond Plan',
      'Personal matchmaking agent',
      'Unlimited profile suggestions',
      'Background verification assistance',
      'Family mediation service',
      'Date planning assistance',
      '24/7 premium support',
      'Exclusive events access',
      'Priority customer service',
      'Custom matching preferences'
    ],
    color: 'from-purple-500 to-pink-600',
    icon: '👑'
  }
]

// Mock profiles data
export const mockProfiles: Profile[] = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    age: 26,
    gender: 'female',
    religion: 'Islam',
    caste: 'Sheikh',
    education: 'Master\'s Degree',
    profession: 'Software Engineer',
    income: 85000,
    location: 'New York, USA',
    country: 'United States',
    state: 'New York',
    city: 'New York City',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    compatibility: 95,
    isVerified: true,
    isPremium: true,
    height: '5\'6"',
    maritalStatus: 'Never Married',
    dietaryPreference: 'Non-Vegetarian',
    smokingHabit: 'Never',
    drinkingHabit: 'Never',
    aboutMe: 'Passionate software engineer who loves traveling and exploring new cultures.',
    lastActive: '2024-01-20T10:30:00Z',
    profileViews: 156,
    joinedDate: '2023-12-15'
  },
  {
    id: 2,
    name: 'Ahmed Khan',
    age: 29,
    gender: 'male',
    religion: 'Islam',
    caste: 'Khan',
    education: 'Bachelor\'s Degree',
    profession: 'Doctor',
    income: 120000,
    location: 'Toronto, Canada',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    compatibility: 88,
    isVerified: true,
    isPremium: false,
    height: '5\'10"',
    maritalStatus: 'Never Married',
    dietaryPreference: 'Non-Vegetarian',
    smokingHabit: 'Never',
    drinkingHabit: 'Socially',
    aboutMe: 'Dedicated doctor with a passion for helping others and traveling.',
    lastActive: '2024-01-20T08:15:00Z',
    profileViews: 203,
    joinedDate: '2023-11-20'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    age: 24,
    gender: 'female',
    religion: 'Hinduism',
    caste: 'Brahmin',
    education: 'Master\'s Degree',
    profession: 'Teacher',
    income: 45000,
    location: 'Mumbai, India',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    compatibility: 92,
    isVerified: true,
    isPremium: true,
    height: '5\'4"',
    maritalStatus: 'Never Married',
    dietaryPreference: 'Vegetarian',
    smokingHabit: 'Never',
    drinkingHabit: 'Never',
    aboutMe: 'Dedicated teacher who believes in traditional values and family importance.',
    lastActive: '2024-01-20T12:45:00Z',
    profileViews: 89,
    joinedDate: '2024-01-05'
  },
  {
    id: 4,
    name: 'Michael Johnson',
    age: 32,
    gender: 'male',
    religion: 'Christianity',
    caste: 'Catholic',
    education: 'PhD/Doctorate',
    profession: 'Business Owner',
    income: 150000,
    location: 'Los Angeles, USA',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    compatibility: 78,
    isVerified: true,
    isPremium: true,
    height: '6\'1"',
    maritalStatus: 'Divorced',
    dietaryPreference: 'Non-Vegetarian',
    smokingHabit: 'Never',
    drinkingHabit: 'Socially',
    aboutMe: 'Successful entrepreneur looking for a life partner to share adventures.',
    lastActive: '2024-01-19T16:20:00Z',
    profileViews: 312,
    joinedDate: '2023-10-10'
  },
  {
    id: 5,
    name: 'Fatima Ali',
    age: 27,
    gender: 'female',
    religion: 'Islam',
    caste: 'Ali',
    education: 'Bachelor\'s Degree',
    profession: 'Marketing Manager',
    income: 65000,
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    state: 'Punjab',
    city: 'Lahore',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    compatibility: 85,
    isVerified: false,
    isPremium: false,
    height: '5\'5"',
    maritalStatus: 'Never Married',
    dietaryPreference: 'Non-Vegetarian',
    smokingHabit: 'Never',
    drinkingHabit: 'Never',
    aboutMe: 'Creative marketing professional with a love for art and culture.',
    lastActive: '2024-01-20T14:10:00Z',
    profileViews: 67,
    joinedDate: '2023-12-28'
  }
]