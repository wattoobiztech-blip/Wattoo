'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'

interface RangeSliderProps {
  label: string
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (value: number) => string
  error?: string
}

export default function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (val) => val.toString(),
  error
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)

  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.max(min, Math.min(newMin, value[1] - step))
    onChange([clampedMin, value[1]])
  }

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.min(max, Math.max(newMax, value[0] + step))
    onChange([value[0], clampedMax])
  }

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="px-3">
        {/* Value Display */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-900">
            {formatValue(value[0])}
          </span>
          <span className="text-sm text-gray-500">to</span>
          <span className="text-sm font-medium text-gray-900">
            {formatValue(value[1])}
          </span>
        </div>

        {/* Slider Container */}
        <div className="relative h-6 flex items-center">
          {/* Track */}
          <div className="absolute w-full h-2 bg-gray-200 rounded-full">
            {/* Active Range */}
            <div
              className="absolute h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
              style={{
                left: `${getPercentage(value[0])}%`,
                width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
              }}
            />
          </div>

          {/* Min Thumb */}
          <motion.div
            className={`absolute w-6 h-6 bg-white border-2 border-primary-500 rounded-full cursor-pointer shadow-lg ${
              isDragging === 'min' ? 'scale-110' : ''
            }`}
            style={{ left: `calc(${getPercentage(value[0])}% - 12px)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            onMouseDown={() => setIsDragging('min')}
          />

          {/* Max Thumb */}
          <motion.div
            className={`absolute w-6 h-6 bg-white border-2 border-primary-500 rounded-full cursor-pointer shadow-lg ${
              isDragging === 'max' ? 'scale-110' : ''
            }`}
            style={{ left: `calc(${getPercentage(value[1])}% - 12px)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            onMouseDown={() => setIsDragging('max')}
          />

          {/* Hidden Range Inputs */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: isDragging === 'min' ? 3 : 1 }}
          />
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: isDragging === 'max' ? 3 : 1 }}
          />
        </div>

        {/* Scale Markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
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