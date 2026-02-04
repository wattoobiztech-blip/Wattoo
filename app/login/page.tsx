'use client'

import { useState } from 'react'
import { motion } from '@/components/ui/Motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Heart, ArrowLeft, Chrome } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import { loginSchema, type LoginFormData } from '@/lib/validations'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CustomCursor from '@/components/CustomCursor'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const watchedValues = watch()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Login Data:', data)
    toast.success('Login successful! Welcome back.')
    
    setIsLoading(false)
  }

  const handleGoogleLogin = () => {
    toast.success('Google login integration coming soon!')
  }

  return (
    <div className="min-h-screen flex">
      <CustomCursor />
      
      {/* Left Side - Background Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=1200&fit=crop"
          alt="Couple holding hands"
          fill
          className="object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/80 via-purple-500/70 to-primary-600/80" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
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
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="h-16 w-16 mb-8 mx-auto text-white/90" />
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Every love story is beautiful,
              <br />
              but yours should be unique
            </h2>
            <p className="text-xl text-white/90 max-w-md">
              Join millions of couples who found their perfect match through our platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <Heart className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">Rishta.com</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue your journey</p>
          </div>

          {/* Login Form */}
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

            {/* Password */}
            <Input
              label="Password"
              isPassword
              icon={Lock}
              error={errors.password?.message}
              value={watchedValues.password || ''}
              {...register('password')}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              icon={Chrome}
              onClick={handleGoogleLogin}
              className="w-full"
            >
              Continue with Google
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Link 
                href="/register" 
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}