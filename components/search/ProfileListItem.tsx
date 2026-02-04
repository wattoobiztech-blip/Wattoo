'use client'

import { useState } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Heart, Bookmark, Eye, MapPin, Briefcase, 
  GraduationCap, Star, Verified, Crown,
  Calendar, Ruler, Users, DollarSign
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { type Profile } from '@/lib/search-constants'
import { searchApi } from '@/lib/search-api'
import Button from '@/components/ui/Button'

interface ProfileListItemProps {
  profile: Profile
}

export default function ProfileListItem({ profile }: ProfileListItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const result = await searchApi.toggleLike(profile.id)
      setIsLiked(result.liked)
      toast.success(result.liked ? 'Profile liked!' : 'Like removed')
    } catch (error) {
      toast.error('Failed to update like status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const result = await searchApi.toggleSave(profile.id)
      setIsSaved(result.saved)
      toast.success(result.saved ? 'Profile saved!' : 'Profile removed from saved')
    } catch (error) {
      toast.error('Failed to update save status')
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Active now'
    if (diffInHours < 24) return `Active ${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Active ${diffInDays}d ago`
    return 'Active 1w+ ago'
  }

  return (
    <motion.div
      whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-primary-200 transition-all duration-300"
    >
      <Link href={`/dashboard/profile/${profile.id}`}>
        <div className="p-6">
          <div className="flex space-x-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-xl overflow-hidden">
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Status Indicators */}
              <div className="absolute -top-2 -right-2 flex space-x-1">
                {profile.isVerified && (
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <Verified className="h-3 w-3 fill-current" />
                  </div>
                )}
                {profile.isPremium && (
                  <div className="bg-yellow-500 text-white p-1 rounded-full">
                    <Crown className="h-3 w-3 fill-current" />
                  </div>
                )}
              </div>

              {/* Compatibility Score */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-white border-2 border-primary-500 px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-gray-900">
                    {profile.compatibility}%
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {profile.name}
                    </h3>
                    <span className="text-gray-600 font-medium">{profile.age} years</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getTimeAgo(profile.lastActive)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isSaved 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium text-gray-900">{profile.height}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Religion:</span>
                    <span className="font-medium text-gray-900">{profile.religion}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">{profile.maritalStatus}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Education:</span>
                    <span className="font-medium text-gray-900 truncate">{profile.education}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Profession:</span>
                    <span className="font-medium text-gray-900 truncate">{profile.profession}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Income:</span>
                    <span className="font-medium text-gray-900">${profile.income.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {profile.religion}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {profile.caste}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {profile.dietaryPreference}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {profile.smokingHabit === 'Never' ? 'Non-Smoker' : profile.smokingHabit}
                </span>
              </div>

              {/* About Me */}
              {profile.aboutMe && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {profile.aboutMe}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{profile.profileViews} views</span>
                  <span>•</span>
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Eye}
                  className="px-4"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}