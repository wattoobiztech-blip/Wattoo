'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { 
  registrationStep1Schema, 
  registrationStep2Schema, 
  registrationStep3Schema,
  type RegistrationStep1Data,
  type RegistrationStep2Data,
  type RegistrationStep3Data
} from '@/lib/validations'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import CustomCursor from '@/components/CustomCursor'
import RegistrationStep1 from '@/components/auth/RegistrationStep1'
import RegistrationStep2 from '@/components/auth/RegistrationStep2'
import RegistrationStep3 from '@/components/auth/RegistrationStep3'

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<{
    step1?: RegistrationStep1Data
    step2?: RegistrationStep2Data
    step3?: RegistrationStep3Data
  }>({})

  const stepLabels = ['Basic Info', 'Personal Details', 'Profile Picture']

  const handleStep1Submit = (data: RegistrationStep1Data) => {
    setFormData(prev => ({ ...prev, step1: data }))
    setCurrentStep(2)
  }

  const handleStep2Submit = (data: RegistrationStep2Data) => {
    setFormData(prev => ({ ...prev, step2: data }))
    setCurrentStep(3)
  }

  const handleStep3Submit = async (data: RegistrationStep3Data) => {
    setIsLoading(true)
    
    const completeData = {
      ...formData.step1,
      ...formData.step2,
      ...data
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Complete Registration Data:', completeData)
    toast.success('Registration successful! Welcome to Rishta.com')
    
    setIsLoading(false)
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <CustomCursor />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">Rishta.com</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-400">Join thousands of people finding their perfect match</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={3} 
          stepLabels={stepLabels}
        />

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <RegistrationStep1
                key="step1"
                onSubmit={handleStep1Submit}
                defaultValues={formData.step1}
              />
            )}
            
            {currentStep === 2 && (
              <RegistrationStep2
                key="step2"
                onSubmit={handleStep2Submit}
                onPrevious={goToPreviousStep}
                defaultValues={formData.step2}
              />
            )}
            
            {currentStep === 3 && (
              <RegistrationStep3
                key="step3"
                onSubmit={handleStep3Submit}
                onPrevious={goToPreviousStep}
                isLoading={isLoading}
                defaultValues={formData.step3}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <span className="text-gray-400">Already have an account? </span>
          <Link 
            href="/login" 
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}