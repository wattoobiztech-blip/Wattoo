'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { 
  Briefcase, Building, MapPin, DollarSign, Users, 
  ArrowLeft, ArrowRight, ToggleLeft, ToggleRight 
} from 'lucide-react'

import { professionalLocationSchema, type ProfessionalLocationData } from '@/lib/dashboard-validations'
import { industryOptions, businessTypeOptions, countryOptions, incomeRanges } from '@/lib/dashboard-constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface ProfessionalLocationStepProps {
  onNext: (data: ProfessionalLocationData) => void
  onPrevious: () => void
  defaultValues?: Partial<ProfessionalLocationData>
  isLoading?: boolean
}

export default function ProfessionalLocationStep({ 
  onNext, 
  onPrevious, 
  defaultValues, 
  isLoading 
}: ProfessionalLocationStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfessionalLocationData>({
    resolver: zodResolver(professionalLocationSchema),
    defaultValues: {
      jobBusiness: 'job',
      ...defaultValues,
    },
  })

  const watchedValues = watch()
  const jobBusiness = watch('jobBusiness')

  const toggleJobBusiness = () => {
    const newValue = jobBusiness === 'job' ? 'business' : 'job'
    setValue('jobBusiness', newValue)
    
    // Clear fields when switching
    if (newValue === 'job') {
      setValue('businessName', '')
      setValue('businessType', '')
      setValue('businessAddress', '')
      setValue('annualTurnover', undefined)
      setValue('natureOfBusiness', '')
      setValue('numberOfEmployees', undefined)
    } else {
      setValue('jobTitle', '')
      setValue('companyName', '')
      setValue('industry', '')
      setValue('companyAddress', '')
    }
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Career & Location Details</h2>
        <p className="text-gray-600">Tell us about your professional life</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Job/Business Toggle */}
        <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <span className={`font-medium ${jobBusiness === 'job' ? 'text-primary-600' : 'text-gray-500'}`}>
            Job
          </span>
          <button
            type="button"
            onClick={toggleJobBusiness}
            className="relative inline-flex items-center"
          >
            {jobBusiness === 'job' ? (
              <ToggleLeft className="h-8 w-8 text-primary-600" />
            ) : (
              <ToggleRight className="h-8 w-8 text-primary-600" />
            )}
          </button>
          <span className={`font-medium ${jobBusiness === 'business' ? 'text-primary-600' : 'text-gray-500'}`}>
            Business
          </span>
        </div>

        {/* Job Fields */}
        {jobBusiness === 'job' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <Input
                label="Job Title"
                type="text"
                icon={Briefcase}
                placeholder="e.g., Software Engineer, Doctor, Teacher"
                error={errors.jobTitle?.message}
                value={watchedValues.jobTitle || ''}
                {...register('jobTitle')}
              />

              {/* Company Name */}
              <Input
                label="Company Name"
                type="text"
                icon={Building}
                placeholder="e.g., Google, Microsoft, Local Hospital"
                error={errors.companyName?.message}
                value={watchedValues.companyName || ''}
                {...register('companyName')}
              />

              {/* Industry */}
              <Select
                label="Industry"
                options={industryOptions}
                value={watchedValues.industry || ''}
                onChange={(value) => setValue('industry', value)}
                error={errors.industry?.message}
                icon={Briefcase}
                searchable
              />

              {/* Annual Income */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Annual Income (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="75000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('annualIncome', { valueAsNumber: true })}
                  />
                </div>
                {errors.annualIncome && (
                  <p className="text-red-500 text-sm">{errors.annualIncome.message}</p>
                )}
              </div>

              {/* Company Address */}
              <div className="md:col-span-2">
                <Input
                  label="Company Address"
                  type="text"
                  icon={MapPin}
                  placeholder="Full company address"
                  error={errors.companyAddress?.message}
                  value={watchedValues.companyAddress || ''}
                  {...register('companyAddress')}
                />
              </div>

              {/* Country of Work */}
              <Select
                label="Country of Work"
                options={countryOptions}
                value={watchedValues.countryOfWork || ''}
                onChange={(value) => setValue('countryOfWork', value)}
                error={errors.countryOfWork?.message}
                icon={MapPin}
                searchable
              />
            </div>
          </motion.div>
        )}

        {/* Business Fields */}
        {jobBusiness === 'business' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <Input
                label="Business Name"
                type="text"
                icon={Building}
                placeholder="e.g., Khan Enterprises, Tech Solutions"
                error={errors.businessName?.message}
                value={watchedValues.businessName || ''}
                {...register('businessName')}
              />

              {/* Business Type */}
              <Select
                label="Business Type"
                options={businessTypeOptions}
                value={watchedValues.businessType || ''}
                onChange={(value) => setValue('businessType', value)}
                error={errors.businessType?.message}
                icon={Briefcase}
              />

              {/* Annual Turnover */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Annual Turnover (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="500000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('annualTurnover', { valueAsNumber: true })}
                  />
                </div>
                {errors.annualTurnover && (
                  <p className="text-red-500 text-sm">{errors.annualTurnover.message}</p>
                )}
              </div>

              {/* Number of Employees */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    placeholder="25"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('numberOfEmployees', { valueAsNumber: true })}
                  />
                </div>
                {errors.numberOfEmployees && (
                  <p className="text-red-500 text-sm">{errors.numberOfEmployees.message}</p>
                )}
              </div>

              {/* Nature of Business */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nature of Business</label>
                <textarea
                  placeholder="Brief description of your business activities"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  {...register('natureOfBusiness')}
                />
                {errors.natureOfBusiness && (
                  <p className="text-red-500 text-sm">{errors.natureOfBusiness.message}</p>
                )}
              </div>

              {/* Business Address */}
              <div className="md:col-span-2">
                <Input
                  label="Business Address"
                  type="text"
                  icon={MapPin}
                  placeholder="Full business address"
                  error={errors.businessAddress?.message}
                  value={watchedValues.businessAddress || ''}
                  {...register('businessAddress')}
                />
              </div>
            </div>
          </motion.div>
        )}

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
            Continue to Lifestyle & Preferences
          </Button>
        </div>
      </form>
    </motion.div>
  )
}