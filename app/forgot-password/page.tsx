'use client'

import { useState } from 'react'
import { motion } from '@/components/ui/Motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, Heart, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { forgotPasswordSchema, type ForgotPasswordData } from '@/lib/validations'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CustomCursor from '@/components/CustomCursor'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const watchedValues = watch()

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Forgot Password Data:', data)
    setIsEmailSent(true)
    toast.success('Password reset link sent to your email!')
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <CustomCursor />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
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
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Login */}
        <Link href="/login" className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">Rishta.com</span>
          </div>
          
          {!isEmailSent ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-400">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mb-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-gray-400">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
            </>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          {!isEmailSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                error={errors.email?.message}
                value={watchedValues.email || ''}
                {...register('email')}
              />

              {/* Send Reset Link Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Send}
                isLoading={isLoading}
                className="w-full"
              >
                Send Reset Link
              </Button>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Remember your password?{' '}
                  <Link 
                    href="/login" 
                    className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    If an account with that email exists, you'll receive a password reset link shortly.
                  </p>
                </div>

                <div className="text-sm text-gray-400 space-y-2">
                  <p>Didn't receive the email? Check your spam folder.</p>
                  <p>Still having trouble? Contact our support team.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setIsEmailSent(false)}
                  className="w-full"
                >
                  Try Another Email
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <Link href="/login" className="w-full">
                    Back to Login
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Need help?{' '}
            <a 
              href="#" 
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}