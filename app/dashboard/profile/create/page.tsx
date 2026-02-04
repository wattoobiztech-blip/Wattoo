'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { toast } from 'react-hot-toast'
import { Save, CheckCircle } from 'lucide-react'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ProgressBar from '@/components/ui/ProgressBar'
import PersonalInfoStep from '@/components/dashboard/profile/PersonalInfoStep'
import ReligiousBackgroundStep from '@/components/dashboard/profile/ReligiousBackgroundStep'
import ProfessionalLocationStep from '@/components/dashboard/profile/ProfessionalLocationStep'
import LifestylePreferencesStep from '@/components/dashboard/profile/LifestylePreferencesStep'
import PhotosStep from '@/components/dashboard/profile/PhotosStep'

import { mockApi } from '@/lib/mock-api'
import type {
  PersonalInfoData,
  ReligiousBackgroundData,
  ProfessionalLocationData,
  LifestylePreferencesData,
  PhotosData
} from '@/lib/dashboard-validations'

export default function CreateProfilePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const [formData, setFormData] = useState<{
    personalInfo?: PersonalInfoData
    religiousBackground?: ReligiousBackgroundData
    professionalLocation?: ProfessionalLocationData
    lifestylePreferences?: LifestylePreferencesData
    photos?: PhotosData
  }>({})

  const totalSteps = 5
  const stepLabels = [
    'Personal Info',
    'Religious Details',
    'Professional Info',
    'Lifestyle & Preferences',
    'Photos'
  ]

  // Auto-save functionality
  const autoSave = async (step: string, data: any) => {
    setIsSaving(true)
    try {
      await mockApi.saveProfileSection(step, data)
      setLastSaved(new Date())
      
      // Update profile completion percentage
      const completionPercentage = Math.round((currentStep / totalSteps) * 100)
      await mockApi.updateProfileCompletion(completionPercentage)
      
    } catch (error) {
      console.error('Auto-save failed:', error)
      toast.error('Failed to save progress')
    } finally {
      setIsSaving(false)
    }
  }

  // Load existing profile data
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true)
      try {
        const profileData = await mockApi.getProfileData()
        setFormData(profileData)
      } catch (error) {
        console.error('Failed to load profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [])

  const handlePersonalInfoSubmit = async (data: PersonalInfoData) => {
    setFormData(prev => ({ ...prev, personalInfo: data }))
    await autoSave('personalInfo', data)
    setCurrentStep(2)
  }

  const handleReligiousBackgroundSubmit = async (data: ReligiousBackgroundData) => {
    setFormData(prev => ({ ...prev, religiousBackground: data }))
    await autoSave('religiousBackground', data)
    setCurrentStep(3)
  }

  const handleProfessionalLocationSubmit = async (data: ProfessionalLocationData) => {
    setFormData(prev => ({ ...prev, professionalLocation: data }))
    await autoSave('professionalLocation', data)
    setCurrentStep(4)
  }

  const handleLifestylePreferencesSubmit = async (data: LifestylePreferencesData) => {
    setFormData(prev => ({ ...prev, lifestylePreferences: data }))
    await autoSave('lifestylePreferences', data)
    setCurrentStep(5)
  }

  const handlePhotosSubmit = async (data: PhotosData) => {
    setIsLoading(true)
    try {
      setFormData(prev => ({ ...prev, photos: data }))
      
      // Upload photos if any
      if (data.profilePicture || (data.additionalPhotos && data.additionalPhotos.length > 0)) {
        const filesToUpload = []
        if (data.profilePicture) filesToUpload.push(data.profilePicture)
        if (data.additionalPhotos) filesToUpload.push(...data.additionalPhotos)
        
        await mockApi.uploadPhotos(filesToUpload)
      }
      
      // Save complete profile
      const completeProfile = {
        ...formData,
        photos: data
      }
      
      await mockApi.saveProfileSection('complete', completeProfile)
      await mockApi.updateProfileCompletion(100)
      
      toast.success('Profile completed successfully!')
      
      // Redirect to profile preview
      window.location.href = '/dashboard/profile/preview'
      
    } catch (error) {
      console.error('Failed to complete profile:', error)
      toast.error('Failed to complete profile')
    } finally {
      setIsLoading(false)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isLoading && Object.keys(formData).length === 0) {
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

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Fill out all sections to increase your chances of finding the perfect match
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            stepLabels={stepLabels}
          />
        </div>

        {/* Auto-save Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                <span className="text-sm text-gray-600">Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              </>
            ) : null}
          </div>
          
          <div className="text-sm text-gray-500">
            Auto-save enabled
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <PersonalInfoStep
                key="step1"
                onNext={handlePersonalInfoSubmit}
                defaultValues={formData.personalInfo}
                isLoading={isSaving}
              />
            )}
            
            {currentStep === 2 && (
              <ReligiousBackgroundStep
                key="step2"
                onNext={handleReligiousBackgroundSubmit}
                onPrevious={goToPreviousStep}
                defaultValues={formData.religiousBackground}
                isLoading={isSaving}
              />
            )}
            
            {currentStep === 3 && (
              <ProfessionalLocationStep
                key="step3"
                onNext={handleProfessionalLocationSubmit}
                onPrevious={goToPreviousStep}
                defaultValues={formData.professionalLocation}
                isLoading={isSaving}
              />
            )}
            
            {currentStep === 4 && (
              <LifestylePreferencesStep
                key="step4"
                onNext={handleLifestylePreferencesSubmit}
                onPrevious={goToPreviousStep}
                defaultValues={formData.lifestylePreferences}
                isLoading={isSaving}
              />
            )}
            
            {currentStep === 5 && (
              <PhotosStep
                key="step5"
                onComplete={handlePhotosSubmit}
                onPrevious={goToPreviousStep}
                defaultValues={formData.photos}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or check our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 underline">
              profile completion guide
            </a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}