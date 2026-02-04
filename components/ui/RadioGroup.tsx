'use client'

import { motion } from '@/components/ui/Motion'

interface RadioOption {
  value: string | number
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  options: RadioOption[]
  value: string | number
  onChange: (value: string | number) => void
  error?: string
  layout?: 'horizontal' | 'vertical'
}

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  layout = 'vertical'
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className={`space-y-2 ${layout === 'horizontal' ? 'flex flex-wrap gap-4' : ''}`}>
        {options.map((option, index) => (
          <motion.label
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              value === option.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${layout === 'horizontal' ? 'flex-1 min-w-0' : ''}`}
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            
            {/* Custom Radio Button */}
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 mt-0.5 transition-all duration-200 ${
              value === option.value
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-300'
            }`}>
              {value === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full bg-white scale-50"
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <span className={`block text-sm font-medium ${
                value === option.value ? 'text-primary-900' : 'text-gray-900'
              }`}>
                {option.label}
              </span>
              {option.description && (
                <span className={`block text-xs mt-1 ${
                  value === option.value ? 'text-primary-700' : 'text-gray-500'
                }`}>
                  {option.description}
                </span>
              )}
            </div>

            {/* Selection Indicator */}
            {value === option.value && (
              <motion.div
                layoutId="radio-indicator"
                className="absolute inset-0 border-2 border-primary-500 rounded-lg bg-primary-500/5"
              />
            )}
          </motion.label>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}