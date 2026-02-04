'use client'

import { useState } from 'react'
import { motion } from '@/components/ui/Motion'
import { 
  RotateCcw, Save, Users, Calendar, MapPin, 
  GraduationCap, Briefcase, DollarSign, Heart,
  Ruler, Utensils, Cigarette, Wine
} from 'lucide-react'

import Button from '@/components/ui/Button'
import RangeSlider from '@/components/ui/RangeSlider'
import TagInput from '@/components/ui/TagInput'
import Select from '@/components/ui/Select'
import RadioGroup from '@/components/ui/RadioGroup'

import { 
  type SearchFilters,
  genderOptions,
  maritalStatusOptions,
  dietaryPreferenceOptions,
  smokingHabitOptions,
  drinkingHabitOptions,
  employmentTypeOptions,
  locationData,
  religions,
  castes,
  educationOptions,
  industryOptions,
  heightOptions
} from '@/lib/search-constants'

interface SearchFiltersProps {
  filters: Partial<SearchFilters>
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onReset: () => void
  onSave: () => void
}

export default function SearchFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  onSave 
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'basic', 'location', 'professional'
  ])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ [key]: value })
  }

  const getStatesForCountry = (country: string) => {
    return Object.keys(locationData[country as keyof typeof locationData] || {})
  }

  const getCitiesForState = (country: string, state: string) => {
    const countryData = locationData[country as keyof typeof locationData]
    if (!countryData) return []
    return countryData[state as keyof typeof countryData] || []
  }

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string
    icon: any
    sectionKey: string
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSections.includes(sectionKey)
    
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-0 space-y-4">
            {children}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h2>
        
        <div className="flex space-x-2">
          <Button
            onClick={onReset}
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            onClick={onSave}
            variant="primary"
            size="sm"
            icon={Save}
            className="flex-1"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Filters */}
        <FilterSection title="Basic Filters" icon={Users} sectionKey="basic">
          {/* Gender */}
          <RadioGroup
            label="Gender"
            options={genderOptions}
            value={filters.gender || 'both'}
            onChange={(value) => updateFilter('gender', value)}
            layout="horizontal"
          />

          {/* Age Range */}
          <RangeSlider
            label="Age Range"
            min={18}
            max={70}
            value={[filters.ageMin || 22, filters.ageMax || 35]}
            onChange={([min, max]) => {
              updateFilter('ageMin', min)
              updateFilter('ageMax', max)
            }}
            formatValue={(value) => `${value} years`}
          />

          {/* Religion */}
          <TagInput
            label="Religion"
            value={filters.religion || []}
            onChange={(value) => updateFilter('religion', value)}
            suggestions={religions}
            maxTags={5}
            placeholder="Select religions"
          />

          {/* Caste */}
          <TagInput
            label="Caste/Community"
            value={filters.caste || []}
            onChange={(value) => updateFilter('caste', value)}
            suggestions={castes}
            maxTags={5}
            placeholder="Select castes/communities"
          />
        </FilterSection>

        {/* Location Filters */}
        <FilterSection title="Location" icon={MapPin} sectionKey="location">
          {/* Country */}
          <Select
            label="Country"
            options={Object.keys(locationData)}
            value={filters.country || ''}
            onChange={(value) => {
              updateFilter('country', value)
              updateFilter('state', '')
              updateFilter('city', '')
            }}
            placeholder="Select country"
          />

          {/* State */}
          {filters.country && (
            <Select
              label="State/Province"
              options={getStatesForCountry(filters.country)}
              value={filters.state || ''}
              onChange={(value) => {
                updateFilter('state', value)
                updateFilter('city', '')
              }}
              placeholder="Select state"
            />
          )}

          {/* City */}
          {filters.country && filters.state && (
            <Select
              label="City"
              options={getCitiesForState(filters.country, filters.state)}
              value={filters.city || ''}
              onChange={(value) => updateFilter('city', value)}
              placeholder="Select city"
            />
          )}

          {/* Distance Radius */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Distance Radius: {filters.distanceRadius || 50} km
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={filters.distanceRadius || 50}
              onChange={(e) => updateFilter('distanceRadius', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10 km</span>
              <span>500 km</span>
            </div>
          </div>
        </FilterSection>

        {/* Professional Filters */}
        <FilterSection title="Professional" icon={Briefcase} sectionKey="professional">
          {/* Education */}
          <TagInput
            label="Education"
            value={filters.education || []}
            onChange={(value) => updateFilter('education', value)}
            suggestions={educationOptions}
            maxTags={4}
            placeholder="Select education levels"
          />

          {/* Profession */}
          <TagInput
            label="Profession"
            value={filters.profession || []}
            onChange={(value) => updateFilter('profession', value)}
            suggestions={industryOptions}
            maxTags={4}
            placeholder="Select professions"
          />

          {/* Income Range */}
          <RangeSlider
            label="Annual Income (USD)"
            min={20000}
            max={500000}
            step={5000}
            value={[filters.incomeMin || 30000, filters.incomeMax || 200000]}
            onChange={([min, max]) => {
              updateFilter('incomeMin', min)
              updateFilter('incomeMax', max)
            }}
            formatValue={(value) => `$${value.toLocaleString()}`}
          />

          {/* Employment Type */}
          <RadioGroup
            label="Employment Type"
            options={employmentTypeOptions}
            value={filters.employmentType || 'both'}
            onChange={(value) => updateFilter('employmentType', value)}
            layout="horizontal"
          />
        </FilterSection>

        {/* Lifestyle Filters */}
        <FilterSection title="Lifestyle" icon={Heart} sectionKey="lifestyle">
          {/* Marital Status */}
          <TagInput
            label="Marital Status"
            value={filters.maritalStatus || []}
            onChange={(value) => updateFilter('maritalStatus', value)}
            suggestions={maritalStatusOptions}
            maxTags={3}
            placeholder="Select marital status"
          />

          {/* Height Range */}
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Min Height"
              options={heightOptions}
              value={filters.heightMin || ''}
              onChange={(value) => updateFilter('heightMin', value)}
              placeholder="Any"
            />
            <Select
              label="Max Height"
              options={heightOptions}
              value={filters.heightMax || ''}
              onChange={(value) => updateFilter('heightMax', value)}
              placeholder="Any"
            />
          </div>

          {/* Dietary Preference */}
          <TagInput
            label="Dietary Preference"
            value={filters.dietaryPreference || []}
            onChange={(value) => updateFilter('dietaryPreference', value)}
            suggestions={dietaryPreferenceOptions}
            maxTags={3}
            placeholder="Select dietary preferences"
          />

          {/* Smoking Habit */}
          <TagInput
            label="Smoking Habit"
            value={filters.smokingHabit || []}
            onChange={(value) => updateFilter('smokingHabit', value)}
            suggestions={smokingHabitOptions}
            maxTags={3}
            placeholder="Select smoking habits"
          />

          {/* Drinking Habit */}
          <TagInput
            label="Drinking Habit"
            value={filters.drinkingHabit || []}
            onChange={(value) => updateFilter('drinkingHabit', value)}
            suggestions={drinkingHabitOptions}
            maxTags={3}
            placeholder="Select drinking habits"
          />
        </FilterSection>
      </div>
    </div>
  )
}