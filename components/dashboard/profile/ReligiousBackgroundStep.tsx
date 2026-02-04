'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { Users, Globe, MessageCircle, Heart, ArrowLeft, ArrowRight } from 'lucide-react'

import { religiousBackgroundSchema, type ReligiousBackgroundData } from '@/lib/dashboard-validations'
import { religionOptions, motherTongueOptions, familyValuesOptions, religiousPracticeOptions } from '@/lib/dashboard-constants'
import Select from '@/components/ui/Select'
import TagInput from '@/components/ui/TagInput'
import RadioGroup from '@/components/ui/RadioGroup'
import Button from '@/components/ui/Button'

interface ReligiousBackgroundStepProps {
  onNext: (data: ReligiousBackgroundData) => void
  onPrevious: () => void
  defaultValues?: Partial<ReligiousBackgroundData>
  isLoading?: boolean
}

export default function ReligiousBackgroundStep({ 
  onNext, 
  onPrevious, 
  defaultValues, 
  isLoading 
}: ReligiousBackgroundStepProps) {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReligiousBackgroundData>({
    resolver: zodResolver(religiousBackgroundSchema),
    defaultValues,
  })

  const watchedValues = watch()
  const selectedReligion = watch('religion')

  const getReligionSubcategories = (religion: string) => {
    return religionOptions[religion as keyof typeof religionOptions] || []
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Religious & Family Details</h2>
        <p className="text-gray-600">Help us understand your background and values</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Religion */}
          <Select
            label="Religion"
            options={Object.keys(religionOptions)}
            value={watchedValues.religion || ''}
            onChange={(value) => {
              setValue('religion', value)
              setValue('religiousSubcategory', '') // Reset subcategory when religion changes
            }}
            error={errors.religion?.message}
            icon={Users}
          />

          {/* Religious Subcategory */}
          {selectedReligion && (
            <Select
              label="Religious Subcategory"
              options={getReligionSubcategories(selectedReligion)}
              value={watchedValues.religiousSubcategory || ''}
              onChange={(value) => setValue('religiousSubcategory', value)}
              icon={Users}
              placeholder="Select subcategory (optional)"
            />
          )}

          {/* Caste/Community */}
          <Select
            label="Caste/Community"
            options={[]} // Will be populated from constants
            value={watchedValues.caste || ''}
            onChange={(value) => setValue('caste', value)}
            error={errors.caste?.message}
            icon={Users}
            searchable
            placeholder="Search and select your caste/community"
          />

          {/* Mother Tongue */}
          <Select
            label="Mother Tongue"
            options={motherTongueOptions}
            value={watchedValues.motherTongue || ''}
            onChange={(value) => setValue('motherTongue', value)}
            error={errors.motherTongue?.message}
            icon={MessageCircle}
            searchable
          />

          {/* Ethnicity (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ethnicity (Optional)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Pakistani, Indian, Arab, etc."
                value={watchedValues.ethnicity || ''}
                onChange={(e) => setValue('ethnicity', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Family Values */}
        <TagInput
          label="Family Values"
          value={watchedValues.familyValues || []}
          onChange={(tags) => setValue('familyValues', tags)}
          suggestions={familyValuesOptions}
          error={errors.familyValues?.message}
          maxTags={5}
          placeholder="Select values that describe your family"
        />

        {/* Religious Practice Level */}
        <RadioGroup
          label="Religious Practice Level"
          options={religiousPracticeOptions.map(option => ({
            value: option.value,
            label: option.label,
            description: `Level ${option.value} - How religious you consider yourself`
          }))}
          value={watchedValues.religiousPractice || 3}
          onChange={(value) => setValue('religiousPractice', Number(value))}
          error={errors.religiousPractice?.message}
        />

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
            Continue to Professional Details
          </Button>
        </div>
      </form>
    </motion.div>
  )
}