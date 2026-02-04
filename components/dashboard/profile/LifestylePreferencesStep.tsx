'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { 
  GraduationCap, Briefcase, Utensils, Heart, Target, 
  ArrowLeft, ArrowRight, User, Users 
} from 'lucide-react'

import { lifestylePreferencesSchema, type LifestylePreferencesData } from '@/lib/dashboard-validations'
import { 
  educationOptions, 
  dietaryHabitsOptions, 
  commonHobbies, 
  heightOptions,
  incomeRanges,
  religionOptions,
  countryOptions
} from '@/lib/dashboard-constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import TagInput from '@/components/ui/TagInput'
import RangeSlider from '@/components/ui/RangeSlider'
import Button from '@/components/ui/Button'

interface LifestylePreferencesStepProps {
  onNext: (data: LifestylePreferencesData) => void
  onPrevious: () => void
  defaultValues?: Partial<LifestylePreferencesData>
  isLoading?: boolean
}

export default function LifestylePreferencesStep({ 
  onNext, 
  onPrevious, 
  defaultValues, 
  isLoading 
}: LifestylePreferencesStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LifestylePreferencesData>({
    resolver: zodResolver(lifestylePreferencesSchema),
    defaultValues: {
      preferredAgeMin: 24,
      preferredAgeMax: 35,
      hobbiesInterests: [],
      preferredReligion: [],
      preferredCaste: [],
      preferredEducation: [],
      preferredLocation: [],
      ...defaultValues,
    },
  })

  const watchedValues = watch()
  const aboutYourself = watch('aboutYourself') || ''
  const lifeGoals = watch('lifeGoals') || ''
  const otherPreferences = watch('otherPreferences') || ''

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle & Partner Preferences</h2>
        <p className="text-gray-600">Tell us about yourself and what you're looking for</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - About You */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">About You</h3>
            </div>

            {/* Education */}
            <Select
              label="Education"
              options={educationOptions}
              value={watchedValues.education || ''}
              onChange={(value) => setValue('education', value)}
              error={errors.education?.message}
              icon={GraduationCap}
              searchable
            />

            {/* Occupation Details */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Occupation Details</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  placeholder="Brief description of your work and experience"
                  rows={3}
                  maxLength={500}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  {...register('occupationDetails')}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.occupationDetails?.message}</span>
                <span>{watchedValues.occupationDetails?.length || 0}/500</span>
              </div>
            </div>

            {/* Dietary Habits */}
            <Select
              label="Dietary Habits"
              options={dietaryHabitsOptions}
              value={watchedValues.dietaryHabits || ''}
              onChange={(value) => setValue('dietaryHabits', value)}
              error={errors.dietaryHabits?.message}
              icon={Utensils}
            />

            {/* Hobbies & Interests */}
            <TagInput
              label="Hobbies & Interests"
              value={watchedValues.hobbiesInterests || []}
              onChange={(tags) => setValue('hobbiesInterests', tags)}
              suggestions={commonHobbies}
              error={errors.hobbiesInterests?.message}
              maxTags={8}
              placeholder="Add your hobbies and interests"
            />

            {/* About Yourself */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">About Yourself</label>
              <textarea
                placeholder="Tell us about yourself, your personality, values, and what makes you unique..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                {...register('aboutYourself')}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.aboutYourself?.message}</span>
                <span>{aboutYourself.length}/500</span>
              </div>
            </div>

            {/* Life Goals */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Life Goals</label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  placeholder="What are your aspirations and goals in life?"
                  rows={3}
                  maxLength={500}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  {...register('lifeGoals')}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.lifeGoals?.message}</span>
                <span>{lifeGoals.length}/500</span>
              </div>
            </div>
          </div>

          {/* Right Column - Partner Preferences */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Partner Preferences</h3>
            </div>

            {/* Preferred Age Range */}
            <RangeSlider
              label="Preferred Age Range"
              min={18}
              max={80}
              value={[watchedValues.preferredAgeMin || 24, watchedValues.preferredAgeMax || 35]}
              onChange={([min, max]) => {
                setValue('preferredAgeMin', min)
                setValue('preferredAgeMax', max)
              }}
              formatValue={(value) => `${value} years`}
              error={errors.preferredAgeMin?.message || errors.preferredAgeMax?.message}
            />

            {/* Preferred Height Range */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Min Height"
                options={heightOptions}
                value={watchedValues.preferredHeightMin || ''}
                onChange={(value) => setValue('preferredHeightMin', value)}
                placeholder="Any"
              />
              <Select
                label="Max Height"
                options={heightOptions}
                value={watchedValues.preferredHeightMax || ''}
                onChange={(value) => setValue('preferredHeightMax', value)}
                placeholder="Any"
              />
            </div>

            {/* Preferred Religion */}
            <TagInput
              label="Preferred Religion"
              value={watchedValues.preferredReligion || []}
              onChange={(tags) => setValue('preferredReligion', tags)}
              suggestions={Object.keys(religionOptions)}
              maxTags={3}
              placeholder="Select preferred religions"
            />

            {/* Preferred Education */}
            <TagInput
              label="Preferred Education"
              value={watchedValues.preferredEducation || []}
              onChange={(tags) => setValue('preferredEducation', tags)}
              suggestions={educationOptions}
              maxTags={4}
              placeholder="Select preferred education levels"
            />

            {/* Preferred Location */}
            <TagInput
              label="Preferred Location"
              value={watchedValues.preferredLocation || []}
              onChange={(tags) => setValue('preferredLocation', tags)}
              suggestions={countryOptions}
              maxTags={5}
              placeholder="Select preferred countries/locations"
            />

            {/* Preferred Income Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Min Income (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  placeholder="40000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('preferredIncomeMin', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Max Income (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  placeholder="100000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('preferredIncomeMax', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Other Preferences */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Other Preferences</label>
              <textarea
                placeholder="Any other specific preferences or requirements..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                {...register('otherPreferences')}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.otherPreferences?.message}</span>
                <span>{otherPreferences.length}/500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            icon={ArrowLeft}
            onClick={onPrevious}
            className="px-8"
          >
            Previous
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            isLoading={isLoading}
            className="px-8"
          >
            Continue to Photos
          </Button>
        </div>
      </form>
    </motion.div>
  )
}