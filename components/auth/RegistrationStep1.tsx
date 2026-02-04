'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react'

import { registrationStep1Schema, type RegistrationStep1Data } from '@/lib/validations'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PasswordStrength from '@/components/ui/PasswordStrength'

interface RegistrationStep1Props {
  onSubmit: (data: RegistrationStep1Data) => void
  defaultValues?: Partial<RegistrationStep1Data>
}

export default function RegistrationStep1({ onSubmit, defaultValues }: RegistrationStep1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationStep1Data>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues,
  })

  const watchedValues = watch()
  const password = watch('password')

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-gray-400">Let's start with your basic details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          icon={User}
          error={errors.fullName?.message}
          value={watchedValues.fullName || ''}
          {...register('fullName')}
        />

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
        <div>
          <Input
            label="Password"
            isPassword
            icon={Lock}
            error={errors.password?.message}
            value={watchedValues.password || ''}
            {...register('password')}
          />
          <PasswordStrength password={password || ''} />
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          isPassword
          icon={Lock}
          error={errors.confirmPassword?.message}
          value={watchedValues.confirmPassword || ''}
          {...register('confirmPassword')}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          type="tel"
          icon={Phone}
          error={errors.phoneNumber?.message}
          value={watchedValues.phoneNumber || ''}
          {...register('phoneNumber')}
        />

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Gender</label>
          <div className="grid grid-cols-3 gap-4">
            {['male', 'female', 'other'].map((gender) => (
              <label
                key={gender}
                className="relative flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-200"
              >
                <input
                  type="radio"
                  value={gender}
                  {...register('gender')}
                  className="sr-only"
                />
                <span className="text-white capitalize font-medium">
                  {gender}
                </span>
                {watchedValues.gender === gender && (
                  <motion.div
                    layoutId="gender-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg opacity-20"
                  />
                )}
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Next Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          className="w-full"
        >
          Continue to Personal Details
        </Button>
      </form>
    </motion.div>
  )
}