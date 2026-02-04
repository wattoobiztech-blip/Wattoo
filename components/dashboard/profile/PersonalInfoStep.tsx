'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { User, Calendar, Ruler, Weight, Palette, Heart, Users } from 'lucide-react'

import { personalInfoSchema, type PersonalInfoData } from '@/lib/dashboard-validations'
import { heightOptions, complexionOptions, maritalStatusOptions, profileCreatedForOptions } from '@/lib/dashboard-constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioGroup from '@/components/ui/RadioGroup'
import Button from '@/components/ui/Button'

interface PersonalInfoStepProps {
  onNext: (data: PersonalInfoData) => void
  defaultValues?: Partial<PersonalInfoData>
  isLoading?: boolean
}

export default function PersonalInfoStep({ onNext, defaultValues, isLoading }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      weightUnit: 'kg',
      ...defaultValues,
    },
  })

  const watchedValues = watch()
  const weightUnit = watch('weightUnit')

  const weightOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lbs', label: 'Pounds (lbs)' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            icon={User}
            error={errors.fullName?.message}
            value={watchedValues.fullName || ''}
            {...register('fullName')}
          />

          {/* Gender (Pre-filled, disabled) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={watchedValues.gender ? watchedValues.gender.charAt(0).toUpperCase() + watchedValues.gender.slice(1) : ''}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500">This was set during registration and cannot be changed</p>
          </div>

          {/* Date of Birth (Pre-filled, disabled) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={watchedValues.dateOfBirth || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500">This was set during registration and cannot be changed</p>
          </div>

          {/* Height */}
          <Select
            label="Height"
            options={heightOptions}
            value={watchedValues.height || ''}
            onChange={(value) => setValue('height', value)}
            error={errors.height?.message}
            icon={Ruler}
          />

          {/* Weight */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="30"
                    max="300"
                    placeholder="70"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('weight', { valueAsNumber: true })}
                  />
                </div>
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <RadioGroup
                  label=""
                  options={weightOptions}
                  value={weightUnit || 'kg'}
                  onChange={(value) => setValue('weightUnit', value as 'kg' | 'lbs')}
                  layout="horizontal"
                />
              </div>
            </div>
          </div>

          {/* Complexion */}
          <Select
            label="Complexion"
            options={complexionOptions}
            value={watchedValues.complexion || ''}
            onChange={(value) => setValue('complexion', value)}
            error={errors.complexion?.message}
            icon={Palette}
          />

          {/* Marital Status */}
          <Select
            label="Marital Status"
            options={maritalStatusOptions}
            value={watchedValues.maritalStatus || ''}
            onChange={(value) => setValue('maritalStatus', value)}
            error={errors.maritalStatus?.message}
            icon={Heart}
          />

          {/* Profile Created For */}
          <Select
            label="Profile Created For"
            options={profileCreatedForOptions}
            value={watchedValues.profileCreatedFor || ''}
            onChange={(value) => setValue('profileCreatedFor', value)}
            error={errors.profileCreatedFor?.message}
            icon={Users}
          />
        </div>

        {/* Next Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="px-8"
          >
            Continue to Religious Details
          </Button>
        </div>
      </form>
    </motion.div>
  )
}