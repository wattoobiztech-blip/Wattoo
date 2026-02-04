'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
  isPassword?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, isPassword, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className="relative">
        <div className="relative">
          {/* Icon */}
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          )}

          {/* Input */}
          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
            className={cn(
              'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300',
              Icon && 'pl-10',
              isPassword && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none origin-left transition-all duration-200',
              (isFocused || props.value) && '-translate-y-[36px] scale-85',
              error ? 'text-red-400' : isFocused ? 'text-primary-500' : 'text-gray-400'
            )}
            style={{ paddingLeft: Icon ? '28px' : '0' }}
          >
            {label}
          </label>

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mt-1 ml-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input