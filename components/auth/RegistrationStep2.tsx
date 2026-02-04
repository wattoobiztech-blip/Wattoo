'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { Calendar, Users, Globe, ArrowRight, ArrowLeft } from 'lucide-react'

import { registrationStep2Schema, type RegistrationStep2Data } from '@/lib/validations'
import { religions, castes, countries } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface RegistrationStep2Props {
  onSubmit: (data: RegistrationStep2Data) => void
  onPrevious: () => void
  defaultValues?: Partial<RegistrationStep2Data>
}

export default function RegistrationStep2({ onSubmit, onPrevious, defaultValues }: RegistrationStep2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegistrationStep2Data>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues,
  })

  const watchedValues = watch()

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Personal Details</h2>
        <p className="text-gray-400">Tell us more about yourself</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          type="date"
          icon={Calendar}
          error={errors.dateOfBirth?.message}
          value={watchedValues.dateOfBirth || ''}
          {...register('dateOfBirth')}
        />

        {/* Religion */}
        <Select
          label="Religion"
          options={religions}
          value={watchedValues.religion || ''}
          onChange={(value) => setValue('religion', value)}
          error={errors.religion?.message}
          icon={Users}
        />

        {/* Caste */}
        <Select
          label="Caste"
          options={castes}
          value={watchedValues.caste || ''}
          onChange={(value) => setValue('caste', value)}
          error={errors.caste?.message}
          icon={Users}
          searchable
        />

        {/* Country */}
        <Select
          label="Country/Nationality"
          options={countries}
          value={watchedValues.country || ''}
          onChange={(value) => setValue('country', value)}
          error={errors.country?.message}
          icon={Globe}
          searchable
        />

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('agreeToTerms')}
            className="w-5 h-5 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-primary-500 focus:ring-2 mt-0.5"
          />
          <div className="flex-1">
            <label className="text-sm text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                Privacy Policy
              </a>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm mt-1">{errors.agreeToTerms.message}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            icon={ArrowLeft}
            onClick={onPrevious}
            className="flex-1"
          >
            Previous
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            className="flex-1"
          >
            Continue to Profile Picture
          </Button>
        </div>
      </form>
    </motion.div>
  )
}