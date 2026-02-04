'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  Edit, Share2, Eye, EyeOff, MapPin, Briefcase, 
  GraduationCap, Heart, Users, Calendar, Ruler, 
  Weight, Palette, MessageCircle, Globe, Utensils,
  Target, DollarSign, Crown, Star
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Button from '@/components/ui/Button'
import { mockApi } from '@/lib/mock-api'

export default function ProfilePreviewPage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await mockApi.getProfileData()
        const userProfile = await mockApi.getUserProfile()
        setProfileData(data)
        setIsPublished(userProfile.isProfilePublished)
      } catch (error) {
        console.error('Failed to load profile data:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [])

  const handleTogglePublish = async () => {
    setIsToggling(true)
    try {
      const result = await mockApi.toggleProfilePublish(!isPublished)
      setIsPublished(!isPublished)
      toast.success(result.message)
    } catch (error) {
      console.error('Failed to toggle profile status:', error)
      toast.error('Failed to update profile status')
    } finally {
      setIsToggling(false)
    }
  }

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile/preview/${profileData?.id || 'demo'}`
    navigator.clipboard.writeText(profileUrl)
    toast.success('Profile link copied to clipboard!')
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">Please complete your profile first.</p>
          <Link href="/dashboard/profile/create">
            <Button variant="primary">Complete Profile</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const { personalInfo, religiousBackground, professionalLocation, lifestylePreferences, photos } = profileData

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Preview</h1>
            <p className="text-gray-600">
              This is how your profile appears to other users
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Publish Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {isPublished ? 'Published' : 'Draft'}
              </span>
              <button
                onClick={handleTogglePublish}
                disabled={isToggling}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isPublished ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isPublished ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              {isPublished ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {/* Action Buttons */}
            <Button
              variant="secondary"
              icon={Share2}
              onClick={handleShare}
            >
              Share
            </Button>
            
            <Link href="/dashboard/profile/create">
              <Button variant="primary" icon={Edit}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-primary-500 to-purple-500">
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                {photos?.profilePicture ? (
                  <Image
                    src={photos.profilePicture}
                    alt={personalInfo?.fullName || 'Profile'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Verified Badge */}
              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isPublished ? 'Live Profile' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 p-8">
            {/* Basic Info */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {personalInfo?.fullName}
                  </h2>
                  <p className="text-gray-600">
                    {personalInfo?.profileCreatedFor === 'Self' ? 'Looking for a life partner' : `Profile for ${personalInfo?.profileCreatedFor}`}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Age</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {personalInfo?.dateOfBirth ? 
                      new Date().getFullYear() - new Date(personalInfo.dateOfBirth).getFullYear() 
                      : 'N/A'
                    } years
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Ruler className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{personalInfo?.height}</div>
                  <div className="text-xs text-gray-500">Height</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{religiousBackground?.religion}</div>
                  <div className="text-xs text-gray-500">Religion</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{lifestylePreferences?.education}</div>
                  <div className="text-xs text-gray-500">Education</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">
                    {professionalLocation?.jobBusiness === 'job' ? 'Job' : 'Business'}
                  </div>
                  <div className="text-xs text-gray-500">Profession</div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {lifestylePreferences?.aboutYourself && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {lifestylePreferences.aboutYourself}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Age:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {personalInfo?.dateOfBirth ? 
                        new Date().getFullYear() - new Date(personalInfo.dateOfBirth).getFullYear() 
                        : 'N/A'
                      } years
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Height:</span>
                    <span className="text-sm font-medium text-gray-900">{personalInfo?.height}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Weight className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Weight:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {personalInfo?.weight} {personalInfo?.weightUnit}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Complexion:</span>
                    <span className="text-sm font-medium text-gray-900">{personalInfo?.complexion}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Marital Status:</span>
                    <span className="text-sm font-medium text-gray-900">{personalInfo?.maritalStatus}</span>
                  </div>
                </div>
              </div>

              {/* Religious & Cultural */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Religious & Cultural</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Religion:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {religiousBackground?.religion}
                      {religiousBackground?.religiousSubcategory && ` (${religiousBackground.religiousSubcategory})`}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Caste:</span>
                    <span className="text-sm font-medium text-gray-900">{religiousBackground?.caste}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Mother Tongue:</span>
                    <span className="text-sm font-medium text-gray-900">{religiousBackground?.motherTongue}</span>
                  </div>
                  
                  {religiousBackground?.ethnicity && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Ethnicity:</span>
                      <span className="text-sm font-medium text-gray-900">{religiousBackground.ethnicity}</span>
                    </div>
                  )}
                  
                  {religiousBackground?.familyValues && religiousBackground.familyValues.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Heart className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Family Values:</span>
                      <div className="flex flex-wrap gap-1">
                        {religiousBackground.familyValues.map((value: string, index: number) => (
                          <span key={index} className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                <div className="space-y-3">
                  {professionalLocation?.jobBusiness === 'job' ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Job Title:</span>
                        <span className="text-sm font-medium text-gray-900">{professionalLocation.jobTitle}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Company:</span>
                        <span className="text-sm font-medium text-gray-900">{professionalLocation.companyName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Industry:</span>
                        <span className="text-sm font-medium text-gray-900">{professionalLocation.industry}</span>
                      </div>
                      
                      {professionalLocation.annualIncome && (
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Annual Income:</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${professionalLocation.annualIncome.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Business:</span>
                        <span className="text-sm font-medium text-gray-900">{professionalLocation?.businessName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm font-medium text-gray-900">{professionalLocation?.businessType}</span>
                      </div>
                      
                      {professionalLocation?.annualTurnover && (
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Annual Turnover:</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${professionalLocation.annualTurnover.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium text-gray-900">{professionalLocation?.countryOfWork}</span>
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Education:</span>
                    <span className="text-sm font-medium text-gray-900">{lifestylePreferences?.education}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Utensils className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Diet:</span>
                    <span className="text-sm font-medium text-gray-900">{lifestylePreferences?.dietaryHabits}</span>
                  </div>
                  
                  {lifestylePreferences?.hobbiesInterests && lifestylePreferences.hobbiesInterests.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Heart className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Interests:</span>
                      <div className="flex flex-wrap gap-1">
                        {lifestylePreferences.hobbiesInterests.map((hobby: string, index: number) => (
                          <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lifestylePreferences?.lifeGoals && (
                    <div className="flex items-start space-x-3">
                      <Target className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Goals:</span>
                      <span className="text-sm text-gray-700">{lifestylePreferences.lifeGoals}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Partner Preferences */}
            {lifestylePreferences && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Age Range:</div>
                    <div className="text-sm font-medium text-gray-900">
                      {lifestylePreferences.preferredAgeMin} - {lifestylePreferences.preferredAgeMax} years
                    </div>
                  </div>
                  
                  {lifestylePreferences.preferredHeightMin && lifestylePreferences.preferredHeightMax && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Height Range:</div>
                      <div className="text-sm font-medium text-gray-900">
                        {lifestylePreferences.preferredHeightMin} - {lifestylePreferences.preferredHeightMax}
                      </div>
                    </div>
                  )}
                  
                  {lifestylePreferences.preferredReligion && lifestylePreferences.preferredReligion.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Preferred Religion:</div>
                      <div className="flex flex-wrap gap-1">
                        {lifestylePreferences.preferredReligion.map((religion: string, index: number) => (
                          <span key={index} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {religion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lifestylePreferences.preferredEducation && lifestylePreferences.preferredEducation.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Preferred Education:</div>
                      <div className="flex flex-wrap gap-1">
                        {lifestylePreferences.preferredEducation.map((education: string, index: number) => (
                          <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {education}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {lifestylePreferences.otherPreferences && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Other Preferences:</div>
                    <p className="text-sm text-gray-700">{lifestylePreferences.otherPreferences}</p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Photos */}
            {photos?.additionalPhotos && photos.additionalPhotos.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">More Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.additionalPhotos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}