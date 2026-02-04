'use client'

import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { ChevronDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps {
  label: string
  options: string[]
  value?: string
  onChange: (value: string) => void
  error?: string
  icon?: LucideIcon
  placeholder?: string
  searchable?: boolean
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ label, options, value, onChange, error, icon: Icon, placeholder, searchable = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const filteredOptions = searchable 
      ? options.filter(option => 
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options

    return (
      <div className="relative" ref={ref}>
        <div className="relative">
          {/* Icon */}
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          )}

          {/* Select Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300',
              Icon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500'
            )}
          >
            <span className={value ? 'text-white' : 'text-gray-400'}>
              {value || placeholder || `Select ${label}`}
            </span>
            <ChevronDown className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </button>

          {/* Floating Label */}
          <motion.label
            animate={{
              y: isFocused || value ? -24 : 0,
              scale: isFocused || value ? 0.85 : 1,
              color: error ? '#ef4444' : isFocused ? '#ec4899' : '#9ca3af',
            }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none origin-left transition-all duration-200"
            style={{ paddingLeft: Icon ? '28px' : '0' }}
          >
            {label}
          </motion.label>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-hidden"
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-600">
                  <input
                    type="text"
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border-0 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Options */}
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200',
                      value === option ? 'bg-primary-500 text-white' : 'text-gray-300'
                    )}
                  >
                    {option}
                  </button>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="px-4 py-3 text-gray-400 text-center">
                    No options found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1 ml-1"
          >
            {error}
          </motion.p>
        )}

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select