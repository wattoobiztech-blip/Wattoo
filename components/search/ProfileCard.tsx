'use client'

import React, { useState } from 'react'
import { motion } from '@/components/ui/Motion'
import {
  Heart, Bookmark, Eye, MapPin, Briefcase,
  GraduationCap, Star, Verified, Crown,
  Calendar, Ruler, Users
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { type Profile } from '@/lib/search-constants'
import { searchApi } from '@/lib/search-api'

interface ProfileCardProps {
  profile: Profile
}

export default function ProfileCard({ profile }: ProfileCardProps) {
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
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 group"
    >
      <Link href={`/dashboard/profile/${profile.id}`}>
        {/* Profile Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={profile.photo}
            alt={profile.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Premium Border */}
          {profile.isPremium && (
            <div className="absolute inset-0 border-2 border-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-2xl" />
          )}

          {/* Status Indicators */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {profile.isVerified && (
              <div className="bg-green-500 text-white p-1.5 rounded-full">
                <Verified className="h-3 w-3 fill-current" />
              </div>
            )}
            {profile.isPremium && (
              <div className="bg-yellow-500 text-white p-1.5 rounded-full">
                <Crown className="h-3 w-3 fill-current" />
              </div>
            )}
          </div>

          {/* Online Status */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              {getTimeAgo(profile.lastActive)}
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">
                {profile.compatibility}% Match
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLoading}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              disabled={isLoading}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${isSaved
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white'
                }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-5">
          {/* Name and Age */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {profile.name}
            </h3>
            <span className="text-gray-600 font-medium">{profile.age}</span>
          </div>

          {/* Basic Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Ruler className="h-4 w-4" />
              <span>{profile.height}</span>
              <span>•</span>
              <span>{profile.maritalStatus}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span className="truncate">{profile.profession}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <GraduationCap className="h-4 w-4" />
              <span className="truncate">{profile.education}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{profile.location}</span>
            </div>
          </div>

          {/* Religion & Caste Badges */}
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
          </div>

          {/* About Me Preview */}
          {profile.aboutMe && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {profile.aboutMe}
            </p>
          )}

          {/* View Profile Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Profile</span>
          </motion.button>

          {/* Profile Stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span>{profile.profileViews} views</span>
            <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}