'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import {
  Heart, X, Clock, Star, Sparkles,
  RefreshCw, Settings, TrendingUp, Users,
  MapPin, GraduationCap, Briefcase, Calendar
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Button from '@/components/ui/Button'
import { searchApi, type DailyMatch } from '@/lib/search-api'

export default function MatchesPage() {
  const [dailyMatches, setDailyMatches] = useState<DailyMatch[]>([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [matchActions, setMatchActions] = useState<{ [key: number]: 'liked' | 'passed' | 'maybe' }>({})

  useEffect(() => {
    loadDailyMatches()
  }, [])

  const loadDailyMatches = async () => {
    setIsLoading(true)
    try {
      const matches = await searchApi.getDailyMatches()
      setDailyMatches(matches)
    } catch (error) {
      console.error('Failed to load matches:', error)
      toast.error('Failed to load matches')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshMatches = async () => {
    setIsRefreshing(true)
    try {
      const matches = await searchApi.getDailyMatches()
      setDailyMatches(matches)
      setCurrentMatchIndex(0)
      setMatchActions({})
      toast.success('New matches loaded!')
    } catch (error) {
      toast.error('Failed to refresh matches')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleMatchAction = async (action: 'liked' | 'passed' | 'maybe') => {
    if (currentMatchIndex >= dailyMatches.length) return

    const currentMatch = dailyMatches[currentMatchIndex]

    // Update local state
    setMatchActions(prev => ({
      ...prev,
      [currentMatch.profile.id]: action
    }))

    // Show feedback
    const messages = {
      liked: 'Profile liked! 💖',
      passed: 'Profile passed',
      maybe: 'Added to maybe later'
    }
    toast.success(messages[action])

    // Move to next match
    setTimeout(() => {
      setCurrentMatchIndex(prev => prev + 1)
    }, 300)

    // API call (in real app)
    try {
      if (action === 'liked') {
        await searchApi.toggleLike(currentMatch.profile.id)
      }
    } catch (error) {
      console.error('Failed to update match action:', error)
    }
  }

  const currentMatch = dailyMatches[currentMatchIndex]
  const hasMoreMatches = currentMatchIndex < dailyMatches.length

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding your perfect matches...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Daily Matches</h1>
            <p className="text-gray-300">
              Curated profiles based on your preferences and compatibility
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={refreshMatches}
              variant="secondary"
              icon={RefreshCw}
              isLoading={isRefreshing}
            >
              Refresh
            </Button>

            <Link href="/dashboard/matches/preferences">
              <Button variant="outline" icon={Settings}>
                Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Match Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Match {Math.min(currentMatchIndex + 1, dailyMatches.length)} of {dailyMatches.length}
            </span>
            <span className="text-sm text-gray-500">
              {dailyMatches.length - currentMatchIndex} remaining
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentMatchIndex) / dailyMatches.length) * 100}%`
              }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {hasMoreMatches && currentMatch ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Match Card */}
            <div className="lg:col-span-2">
              {/* @ts-ignore */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMatch.profile.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ duration: 0.5 }}
                  className="glass rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                >
                  {/* Profile Image */}
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={currentMatch.profile.photo}
                      alt={currentMatch.profile.name}
                      fill
                      className="object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Compatibility Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">
                          {currentMatch.compatibility}% Match
                        </span>
                      </div>
                    </div>

                    {/* Premium Badge */}
                    {currentMatch.profile.isPremium && (
                      <div className="absolute top-6 right-6">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Premium
                        </div>
                      </div>
                    )}

                    {/* Basic Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {currentMatch.profile.name}, {currentMatch.profile.age}
                      </h2>
                      <div className="flex items-center space-x-4 text-white/90">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{currentMatch.profile.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{currentMatch.profile.profession}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-white/5 rounded-xl">
                        <Calendar className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                        <div className="font-semibold text-white">{currentMatch.profile.age}</div>
                        <div className="text-sm text-gray-600">Years</div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="font-semibold text-white text-sm">{currentMatch.profile.education}</div>
                        <div className="text-sm text-gray-600">Education</div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="font-semibold text-white">{currentMatch.profile.religion}</div>
                        <div className="text-sm text-gray-600">Religion</div>
                      </div>
                    </div>

                    {/* About */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {currentMatch.profile.aboutMe}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMatchAction('passed')}
                        className="w-16 h-16 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <X className="h-8 w-8" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMatchAction('maybe')}
                        className="w-16 h-16 bg-white/10 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <Clock className="h-8 w-8" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMatchAction('liked')}
                        className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                      >
                        <Heart className="h-10 w-10" />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-center space-x-8 mt-4 text-sm text-gray-600">
                      <span>Pass</span>
                      <span>Maybe</span>
                      <span className="font-semibold text-primary-600">Like</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Match Insights */}
            <div className="space-y-6">
              {/* Compatibility Breakdown */}
              <div className="glass rounded-2xl p-6 shadow-sm border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                  Compatibility Score
                </h3>

                <div className="space-y-4">
                  {[
                    { label: 'Religious Match', score: 95, color: 'bg-green-500' },
                    { label: 'Age Compatibility', score: 88, color: 'bg-blue-500' },
                    { label: 'Education Level', score: 92, color: 'bg-purple-500' },
                    { label: 'Location', score: 75, color: 'bg-yellow-500' },
                    { label: 'Lifestyle', score: 85, color: 'bg-pink-500' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="font-semibold">{item.score}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why This Match */}
              <div className="glass rounded-2xl p-6 shadow-sm border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary-600" />
                  Why This Match?
                </h3>

                <div className="space-y-3">
                  {currentMatch.reasons.map((reason, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{reason}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Common Interests */}
              <div className="glass rounded-2xl p-6 shadow-sm border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Common Interests
                </h3>

                <div className="flex flex-wrap gap-2">
                  {currentMatch.commonInterests.map((interest, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No More Matches */
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                You've seen all matches for today!
              </h2>

              <p className="text-gray-300 mb-8">
                Come back tomorrow for fresh matches, or explore more profiles in search.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={refreshMatches}
                  variant="primary"
                  icon={RefreshCw}
                  isLoading={isRefreshing}
                >
                  Get New Matches
                </Button>

                <Link href="/dashboard/search">
                  <Button variant="secondary">
                    Browse All Profiles
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}