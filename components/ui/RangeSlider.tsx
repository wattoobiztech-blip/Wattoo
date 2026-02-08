'use client'

import { useState, useEffect, useRef } from 'react'
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
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export default function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (val) => val.toString(),
  error,
  className,
  labelClassName = "text-gray-700",
  valueClassName = "text-gray-900"
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sliderRef.current) return

      const sliderRect = sliderRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const percentage = Math.min(100, Math.max(0, ((clientX - sliderRect.left) / sliderRect.width) * 100))
      const newValue = ((percentage / 100) * (max - min)) + min

      if (isDragging === 'min') {
        const clampedMin = Math.min(Math.max(min, newValue), value[1] - step)
        onChange([Math.round(clampedMin / step) * step, value[1]])
      } else {
        const clampedMax = Math.max(Math.min(max, newValue), value[0] + step)
        onChange([value[0], Math.round(clampedMax / step) * step])
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, min, max, step, value, onChange])

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <label className={`block text-sm font-medium ${labelClassName}`}>{label}</label>

      <div className="px-3">
        {/* Value Display */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-medium ${valueClassName}`}>
            {formatValue(value[0])}
          </span>
          <span className="text-sm text-gray-500">to</span>
          <span className={`text-sm font-medium ${valueClassName}`}>
            {formatValue(value[1])}
          </span>
        </div>

        {/* Slider Container */}
        <div
          ref={sliderRef}
          className="relative h-6 flex items-center cursor-pointer touch-none"
        >
          {/* Track */}
          <div className="absolute w-full h-2 bg-gray-200 rounded-full">
            {/* Active Range */}
            <div
              className="absolute h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
              style={{
                left: `${getPercentage(value[0])}%`,
                width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
              }}
            />
          </div>

          {/* Min Thumb */}
          <motion.div
            role="slider"
            aria-valuemin={min}
            aria-valuemax={value[1] - step}
            aria-valuenow={value[0]}
            aria-label={`${label} minimum`}
            className={`absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full cursor-pointer shadow-lg z-10 ${isDragging === 'min' ? 'scale-110 z-20' : ''
              }`}
            style={{ left: `calc(${getPercentage(value[0])}% - 12px)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            onMouseDown={(e: any) => { e.preventDefault(); setIsDragging('min'); }}
            onTouchStart={() => setIsDragging('min')}
          />

          {/* Max Thumb */}
          <motion.div
            role="slider"
            aria-valuemin={value[0] + step}
            aria-valuemax={max}
            aria-valuenow={value[1]}
            aria-label={`${label} maximum`}
            className={`absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full cursor-pointer shadow-lg z-10 ${isDragging === 'max' ? 'scale-110 z-20' : ''
              }`}
            style={{ left: `calc(${getPercentage(value[1])}% - 12px)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            onMouseDown={(e: any) => { e.preventDefault(); setIsDragging('max'); }}
            onTouchStart={() => setIsDragging('max')}
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