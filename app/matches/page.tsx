'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  Heart, X, Star, MapPin, Briefcase, GraduationCap, 
  Calendar, Eye, MessageCircle, Filter, Search,
  Users, Clock, CheckCircle, AlertCircle, Sparkles,
  ArrowLeft, ArrowRight, Zap, Crown, Shield
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'
import Header from '@/components/Header'

// Mock matches data
const getMatches = () => [
  {
    id: '1',
    name: 'Fatima Sheikh',
    age: 25,
    profession: 'Doctor',
    location: 'Karachi, Pakistan',
    education: 'MBBS',
    image: getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima),
    matchPercentage: 94,
    verified: true,
    premium: true,
    online: true,
    lastSeen: '2 hours ago',
    mutualInterests: ['Reading', 'Traveling', 'Music'],
    status: 'new',
    likedYou: true
  },
  {
    id: '2',
    name: 'Zara Butt',
    age: 27,
    profession: 'Teacher',
    location: 'Lahore, Pakistan',
    education: 'Masters in Education',
    image: getImageSrc(PROFILE_IMAGES.zara, FALLBACK_IMAGES.profiles.zara),
    matchPercentage: 89,
    verified: true,
    premium: false,
    online: false,
    lastSeen: '1 day ago',
    mutualInterests: ['Art', 'Cooking', 'Photography'],
    status: 'mutual',
    likedYou: true
  },
  {
    id: '3',
    name: 'Ayesha Khan',
    age: 26,
    profession: 'Software Engineer',
    location: 'Islamabad, Pakistan',
    education: 'Masters in CS',
    image: getImageSrc(PROFILE_IMAGES.ayesha, FALLBACK_IMAGES.profiles.ayesha),
    matchPercentage: 87,
    verified: true,
    premium: true,
    online: true,
    lastSeen: 'Online now',
    mutualInterests: ['Technology', 'Fitness', 'Movies'],
    status: 'liked',
    likedYou: false
  }
]

const getRecentActivity = () => [
  {
    id: '1',
    type: 'like',
    user: 'Fatima Sheikh',
    message: 'liked your profile',
    time: '2 hours ago',
    image: getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima)
  },
  {
    id: '2',
    type: 'view',
    user: 'Zara Butt',
    message: 'viewed your profile',
    time: '5 hours ago',
    image: getImageSrc(PROFILE_IMAGES.zara, FALLBACK_IMAGES.profiles.zara)
  },
  {
    id: '3',
    type: 'message',
    user: 'Ayesha Khan',
    message: 'sent you a message',
    time: '1 day ago',
    image: getImageSrc(PROFILE_IMAGES.ayesha, FALLBACK_IMAGES.profiles.ayesha)
  }
]

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState(getMatches())
  const [recentActivity, setRecentActivity] = useState(getRecentActivity())
  const [activeTab, setActiveTab] = useState('matches')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'matches', label: 'My Matches', count: matches.length },
    { id: 'liked', label: 'Liked You', count: matches.filter(m => m.likedYou).length },
    { id: 'activity', label: 'Recent Activity', count: recentActivity.length },
  ]

  const handleLike = (matchId: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, status: match.likedYou ? 'mutual' : 'liked' }
        : match
    ))
  }

  const handlePass = (matchId: string) => {
    setMatches(prev => prev.filter(match => match.id !== matchId))
    if (currentMatchIndex >= matches.length - 1) {
      setCurrentMatchIndex(Math.max(0, currentMatchIndex - 1))
    }
  }

  const nextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length)
  }

  const prevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'mutual': return 'bg-green-500'
      case 'liked': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New Match'
      case 'mutual': return 'Mutual Like'
      case 'liked': return 'You Liked'
      default: return 'Match'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Main Header */}
      <Header />
      
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 mt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">My Matches</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search matches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Matches</p>
                <p className="text-3xl font-bold">{matches.length}</p>
              </div>
              <Heart className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Mutual Likes</p>
                <p className="text-3xl font-bold">{matches.filter(m => m.status === 'mutual').length}</p>
              </div>
              <Sparkles className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Profile Views</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Eye className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Messages</p>
                <p className="text-3xl font-bold">23</p>
              </div>
              <MessageCircle className="w-8 h-8 text-orange-200" />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 mb-8"
        >
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
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
          >
            {activeTab === 'matches' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Card Stack View */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/50">
                    {matches.length > 0 ? (
                      <div className="relative">
                        {/* Current Match Card */}
                        <motion.div
                          key={currentMatchIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                            <Image
                              src={matches[currentMatchIndex]?.image}
                              alt={matches[currentMatchIndex]?.name}
                              fill
                              className="object-cover"
                            />
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(matches[currentMatchIndex]?.status)}`}>
                                {getStatusLabel(matches[currentMatchIndex]?.status)}
                              </span>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                              {matches[currentMatchIndex]?.verified && (
                                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                                  <Shield className="w-3 h-3" />
                                  <span>Verified</span>
                                </span>
                              )}
                              {matches[currentMatchIndex]?.premium && (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                                  <Crown className="w-3 h-3" />
                                  <span>Premium</span>
                                </span>
                              )}
                              {matches[currentMatchIndex]?.online && (
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  <span>Online</span>
                                </span>
                              )}
                            </div>

                            {/* Match Percentage */}
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="font-bold text-purple-600">{matches[currentMatchIndex]?.matchPercentage}% Match</span>
                              </div>
                            </div>

                            {/* Navigation Arrows */}
                            {matches.length > 1 && (
                              <>
                                <button
                                  onClick={prevMatch}
                                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                >
                                  <ArrowLeft className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={nextMatch}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                >
                                  <ArrowRight className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>

                          {/* Match Info */}
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-3xl font-bold text-gray-900">{matches[currentMatchIndex]?.name}</h2>
                              <p className="text-gray-600 text-lg">{matches[currentMatchIndex]?.age} years • {matches[currentMatchIndex]?.location}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Briefcase className="w-4 h-4 text-purple-500" />
                                <span className="text-gray-700">{matches[currentMatchIndex]?.profession}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4 text-purple-500" />
                                <span className="text-gray-700">{matches[currentMatchIndex]?.education}</span>
                              </div>
                            </div>

                            {/* Mutual Interests */}
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Common Interests</p>
                              <div className="flex flex-wrap gap-2">
                                {matches[currentMatchIndex]?.mutualInterests.map((interest) => (
                                  <span
                                    key={interest}
                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 pt-4">
                              <button
                                onClick={() => handlePass(matches[currentMatchIndex]?.id)}
                                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-4 rounded-2xl hover:bg-gray-200 transition-all"
                              >
                                <X className="w-5 h-5" />
                                <span>Pass</span>
                              </button>
                              <button
                                onClick={() => handleLike(matches[currentMatchIndex]?.id)}
                                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all"
                              >
                                <Heart className="w-5 h-5" />
                                <span>Like</span>
                              </button>
                              <button
                                onClick={() => router.push(`/profile/${matches[currentMatchIndex]?.id}`)}
                                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-500 transition-all"
                              >
                                <Eye className="w-5 h-5" />
                                <span>View Profile</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches yet</h3>
                        <p className="text-gray-500">Keep exploring to find your perfect match!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Matches List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">All Matches</h3>
                  <div className="space-y-3">
                    {matches.map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white/80 backdrop-blur-xl rounded-xl p-4 border transition-all cursor-pointer ${
                          index === currentMatchIndex 
                            ? 'border-purple-300 shadow-lg' 
                            : 'border-white/50 hover:border-purple-200'
                        }`}
                        onClick={() => setCurrentMatchIndex(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Image
                              src={match.image}
                              alt={match.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                            {match.online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{match.name}</p>
                            <p className="text-sm text-gray-600">{match.matchPercentage}% match</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(match.status)}`}></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.filter(match => match.likedYou).map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-white/50 hover:shadow-xl transition-all"
                  >
                    <div className="relative h-64">
                      <Image
                        src={match.image}
                        alt={match.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>Liked You</span>
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                          <h3 className="font-bold text-gray-900">{match.name}</h3>
                          <p className="text-sm text-gray-600">{match.age} years • {match.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLike(match.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
                        >
                          Like Back
                        </button>
                        <button
                          onClick={() => router.push(`/profile/${match.id}`)}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <Image
                        src={activity.image}
                        alt={activity.user}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {activity.user} <span className="font-normal text-gray-600">{activity.message}</span>
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activity.type === 'like' && <Heart className="w-5 h-5 text-pink-500" />}
                        {activity.type === 'view' && <Eye className="w-5 h-5 text-blue-500" />}
                        {activity.type === 'message' && <MessageCircle className="w-5 h-5 text-green-500" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}