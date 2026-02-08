'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import {
  ArrowLeft, Heart, MessageCircle, Share2, Flag, Star, MapPin,
  Briefcase, GraduationCap, Calendar, Users, Phone, Mail,
  Camera, Shield, Crown, Eye, ChevronLeft, ChevronRight, X,
  Instagram, Facebook, Twitter, Linkedin, Globe, Music,
  Book, Dumbbell, Plane, Coffee, Award, Target
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'
import Header from '@/components/Header'

// Mock profile data - replace with API call
const getProfileData = (id: string) => ({
  id,
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

  // Detailed Information
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

  // Additional features
  compatibilityScore: 92,
  matchPercentage: 87,
  commonInterests: ['Reading', 'Technology', 'Traveling'],
  mutualConnections: 5
})

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [profile, setProfile] = useState(getProfileData(params.id))
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('about')
  const [isLiked, setIsLiked] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const tabs = [
    { id: 'about', label: 'About', icon: Users },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
    { id: 'preferences', label: 'Preferences', icon: Target },
    { id: 'gallery', label: 'Gallery', icon: Camera },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profile.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Main Header */}
      <Header />

      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 mt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Profile Images & Quick Info */}
          <div className="lg:col-span-1 space-y-6">

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50"
            >
              {/* Main Image */}
              <div className="relative h-96 overflow-hidden">
                <Image
                  src={profile.images[currentImageIndex]}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Image Navigation */}
                {profile.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="flex flex-col space-y-2">
                    {profile.online && (
                      <div className="flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Online</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    {profile.premium && (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <Crown className="h-3 w-3" />
                        <span>Premium</span>
                      </div>
                    )}

                    {profile.verified && (
                      <div className="flex items-center space-x-1 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <Shield className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Indicators */}
                {profile.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {profile.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{profile.profileViews}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{profile.likes}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{profile.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${isLiked
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-pink-50'
                  }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like Profile'}</span>
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Send Message</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all ${isFollowing
                    ? 'bg-green-500 text-white'
                    : 'bg-white/80 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-green-50'
                    }`}
                >
                  <Star className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white/80 backdrop-blur-xl border border-white/50 text-gray-700 py-3 px-4 rounded-xl hover:bg-blue-50 transition-all">
                  <Eye className="w-5 h-5" />
                  <span>Gallery</span>
                </button>
              </div>
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">{profile.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">{profile.profession}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">{profile.education}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">{profile.age} years old</span>
                </div>
              </div>
            </motion.div>

            {/* Compatibility Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Compatibility</h3>

              {/* Match Percentage */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Match Score</span>
                  <span className="text-2xl font-bold text-purple-600">{profile.matchPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.matchPercentage}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* Common Interests */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700 mb-2 block">Common Interests</span>
                <div className="flex flex-wrap gap-2">
                  {profile.commonInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-white/80 text-purple-700 rounded-full text-xs font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mutual Connections */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{profile.mutualConnections} mutual connections</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{profile.age} years</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{profile.rating}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Last seen</div>
                  <div className="font-semibold text-gray-700">{profile.lastSeen}</div>
                </div>
              </div>

              {/* Response Stats */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.responseRate}</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{profile.responseTime}</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50"
            >
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.id
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
            {/* @ts-ignore */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/50"
              >
                {activeTab === 'about' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">About Me</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{profile.about}</p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Height:</span>
                            <span className="font-semibold">{profile.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-semibold">{profile.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cast:</span>
                            <span className="font-semibold">{profile.cast}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Religion:</span>
                            <span className="font-semibold">{profile.religion}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Marital Status:</span>
                            <span className="font-semibold">{profile.maritalStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mother Tongue:</span>
                            <span className="font-semibold">{profile.motherTongue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Income:</span>
                            <span className="font-semibold">{profile.income}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joined:</span>
                            <span className="font-semibold">{profile.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language) => (
                          <span
                            key={language}
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Interests & Hobbies</h4>
                      <div className="flex flex-wrap gap-3">
                        {profile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-all"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'family' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Family Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Father's Occupation:</span>
                          <span className="font-semibold">{profile.familyInfo.fatherOccupation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mother's Occupation:</span>
                          <span className="font-semibold">{profile.familyInfo.motherOccupation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Siblings:</span>
                          <span className="font-semibold">{profile.familyInfo.siblings}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Family Type:</span>
                          <span className="font-semibold">{profile.familyInfo.familyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Family Values:</span>
                          <span className="font-semibold">{profile.familyInfo.familyValues}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Family Income:</span>
                          <span className="font-semibold">{profile.familyInfo.familyIncome}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'lifestyle' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Lifestyle & Habits</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diet:</span>
                          <span className="font-semibold">{profile.lifestyle.diet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Drinking:</span>
                          <span className="font-semibold">{profile.lifestyle.drinking}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Smoking:</span>
                          <span className="font-semibold">{profile.lifestyle.smoking}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Exercise:</span>
                          <span className="font-semibold">{profile.lifestyle.exercise}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pets:</span>
                          <span className="font-semibold">{profile.lifestyle.pets}</span>
                        </div>
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
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age Range:</span>
                          <span className="font-semibold">{profile.preferences.ageRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Height Range:</span>
                          <span className="font-semibold">{profile.preferences.heightRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Education:</span>
                          <span className="font-semibold">{profile.preferences.education}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profession:</span>
                          <span className="font-semibold">{profile.preferences.profession}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-semibold">{profile.preferences.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Marital Status:</span>
                          <span className="font-semibold">{profile.preferences.maritalStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Photo Gallery</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                          onClick={() => {
                            setCurrentImageIndex(index)
                            setShowImageModal(true)
                          }}
                        >
                          <Image
                            src={image}
                            alt={`${profile.name} photo ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Social Media Links */}
                    {profile.socialMedia && (
                      <div className="mt-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Connect on Social Media</h4>
                        <div className="flex space-x-4">
                          {profile.socialMedia.instagram && (
                            <a
                              href={`https://instagram.com/${profile.socialMedia.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                            >
                              <Instagram className="w-5 h-5" />
                              <span>Instagram</span>
                            </a>
                          )}
                          {profile.socialMedia.facebook && (
                            <a
                              href={`https://facebook.com/${profile.socialMedia.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            >
                              <Facebook className="w-5 h-5" />
                              <span>Facebook</span>
                            </a>
                          )}
                          {profile.socialMedia.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${profile.socialMedia.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-all"
                            >
                              <Linkedin className="w-5 h-5" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact {profile.name}</h3>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-3 bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-500 transition-all">
                  <Phone className="w-5 h-5" />
                  <span>Request Phone Number</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-500 transition-all">
                  <Mail className="w-5 h-5" />
                  <span>Send Email</span>
                </button>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative w-full h-full max-w-3xl max-h-[80vh]">
                <Image
                  src={profile.images[currentImageIndex]}
                  alt={`${profile.name} photo ${currentImageIndex + 1}`}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>

              {/* Navigation */}
              {profile.images.length > 1 && (
                <>
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} of {profile.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Report Profile</h3>

              <div className="space-y-3">
                {['Fake Profile', 'Inappropriate Content', 'Harassment', 'Spam', 'Other'].map((reason) => (
                  <button
                    key={reason}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // Handle report submission
                      setShowReportModal(false)
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="w-full mt-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <div className="relative">
          <button
            onClick={() => setShowContactModal(true)}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20"></div>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}