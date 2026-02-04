'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  User, Edit3, Camera, MapPin, Briefcase, GraduationCap, 
  Calendar, Heart, Eye, Star, Settings, Share2, Download,
  Phone, Mail, Instagram, Facebook, Linkedin, Award,
  Users, Coffee, Target, Image as ImageIcon, Plus,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'
import Header from '@/components/Header'

// Mock user profile data
const getUserProfile = () => ({
  id: 'current-user',
  name: 'Sarah Ahmed',
  age: 24,
  profession: 'Graphic Designer',
  company: 'Creative Studio Pvt Ltd',
  education: 'Bachelor in Fine Arts',
  university: 'National College of Arts',
  cast: 'Sheikh',
  religion: 'Islam',
  location: 'Lahore, Pakistan',
  height: '5\'3"',
  weight: '52 kg',
  maritalStatus: 'Never Married',
  motherTongue: 'Urdu',
  languages: ['Urdu', 'English', 'Punjabi'],
  income: '₹5-8 Lakhs',
  images: [
    getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima),
    getImageSrc(PROFILE_IMAGES.ayesha, FALLBACK_IMAGES.profiles.ayesha),
    getImageSrc(PROFILE_IMAGES.zara, FALLBACK_IMAGES.profiles.zara),
  ],
  verified: true,
  premium: true,
  online: true,
  lastSeen: 'Online now',
  joinedDate: 'October 2023',
  profileViews: 2156,
  likes: 342,
  rating: 4.8,
  responseRate: '98%',
  responseTime: 'Within 1 hour',
  about: 'Creative and passionate graphic designer who loves art, travel, and meaningful conversations. Looking for someone who appreciates creativity and shares similar values.',
  
  familyInfo: {
    fatherOccupation: 'Engineer',
    motherOccupation: 'Teacher',
    siblings: '1 Sister',
    familyType: 'Nuclear Family',
    familyValues: 'Modern with traditional values',
    familyIncome: '₹12-18 Lakhs'
  },
  
  lifestyle: {
    diet: 'Vegetarian',
    drinking: 'Never',
    smoking: 'Never',
    exercise: 'Regular',
    pets: 'Love cats'
  },
  
  interests: [
    'Art & Design', 'Photography', 'Traveling', 'Reading', 
    'Music', 'Cooking', 'Yoga', 'Movies'
  ],
  
  preferences: {
    ageRange: '25-30',
    heightRange: '5\'6" - 6\'0"',
    education: 'Graduate or above',
    profession: 'Any',
    location: 'Pakistan',
    maritalStatus: 'Never Married'
  },
  
  socialMedia: {
    instagram: '@sarah_designs',
    facebook: 'sarah.ahmed.designer',
    linkedin: 'sarah-ahmed-designer'
  },
  
  achievements: [
    'Best Designer Award 2023',
    'Featured in Design Magazine',
    'Freelance Success Story'
  ],
  
  profileCompletion: 95,
  accountStatus: 'active',
  membershipType: 'premium',
  membershipExpiry: '2024-12-31'
})

export default function UserProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(getUserProfile())
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'details', label: 'Details', icon: Settings },
    { id: 'preferences', label: 'Preferences', icon: Target },
    { id: 'privacy', label: 'Privacy', icon: Eye },
  ]

  const stats = [
    { label: 'Profile Views', value: profile.profileViews, icon: Eye, color: 'text-blue-600' },
    { label: 'Likes Received', value: profile.likes, icon: Heart, color: 'text-pink-600' },
    { label: 'Profile Rating', value: profile.rating, icon: Star, color: 'text-yellow-600' },
    { label: 'Response Rate', value: profile.responseRate, icon: CheckCircle, color: 'text-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Main Header */}
      <Header />
      
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 mt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">My Profile</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50"
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={profile.images[0]}
                    alt={profile.name}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={() => setShowImageUpload(true)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Status Badges */}
                <div className="flex justify-center mt-4 space-x-2">
                  {profile.verified && (
                    <span className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                  {profile.premium && (
                    <span className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs">
                      <Award className="w-3 h-3" />
                      <span>Premium</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                <p className="text-gray-600 mb-2">{profile.age} years • {profile.location}</p>
                <p className="text-purple-600 font-medium">{profile.profession}</p>
              </div>

              {/* Profile Completion */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm font-bold text-purple-600">{profile.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.profileCompletion}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all">
                  <Eye className="w-4 h-4" />
                  <span>Preview Profile</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all">
                  <Share2 className="w-4 h-4" />
                  <span>Share Profile</span>
                </button>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50"
            >
              <div className="flex space-x-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/50"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">About Me</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{profile.about}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Height:</span>
                            <span className="font-semibold">{profile.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cast:</span>
                            <span className="font-semibold">{profile.cast}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Religion:</span>
                            <span className="font-semibold">{profile.religion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mother Tongue:</span>
                            <span className="font-semibold">{profile.motherTongue}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Professional Info</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profession:</span>
                            <span className="font-semibold">{profile.profession}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Company:</span>
                            <span className="font-semibold">{profile.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Education:</span>
                            <span className="font-semibold">{profile.education}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Income:</span>
                            <span className="font-semibold">{profile.income}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Interests & Hobbies</h4>
                      <div className="flex flex-wrap gap-3">
                        {profile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-gray-900">My Photos</h3>
                      <button
                        onClick={() => setShowImageUpload(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Photo</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {profile.images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                        >
                          <Image
                            src={image}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                              <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Add Photo Placeholder */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: profile.images.length * 0.1 }}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                        onClick={() => setShowImageUpload(true)}
                      >
                        <div className="text-center">
                          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Add Photo</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900">Detailed Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Family Information</h4>
                        <div className="space-y-3">
                          {Object.entries(profile.familyInfo).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Lifestyle</h4>
                        <div className="space-y-3">
                          {Object.entries(profile.lifestyle).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className="font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language) => (
                          <span
                            key={language}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Achievements</h4>
                      <div className="space-y-3">
                        {profile.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                            <Award className="w-5 h-5 text-yellow-600" />
                            <span className="font-semibold text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Partner Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {Object.entries(profile.preferences).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {Object.entries(profile.preferences).slice(3).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Privacy Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                        <div className="flex items-center space-x-3 mb-4">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h4 className="text-lg font-bold text-gray-900">Account Status</h4>
                        </div>
                        <p className="text-gray-700">Your account is active and verified. Profile visibility is set to public.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <h5 className="font-semibold text-gray-900 mb-2">Profile Visibility</h5>
                          <p className="text-sm text-gray-600 mb-3">Control who can see your profile</p>
                          <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Public</option>
                            <option>Members Only</option>
                            <option>Premium Members Only</option>
                          </select>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <h5 className="font-semibold text-gray-900 mb-2">Contact Information</h5>
                          <p className="text-sm text-gray-600 mb-3">Who can contact you</p>
                          <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>All Members</option>
                            <option>Premium Members Only</option>
                            <option>Verified Members Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}