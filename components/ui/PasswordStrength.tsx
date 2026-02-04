'use client'

import { motion } from '@/components/ui/Motion'
import { getPasswordStrength } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getPasswordStrength(password)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-400">Password Strength</span>
        <span className={`text-sm font-medium ${
          label === 'Weak' ? 'text-red-400' : 
          label === 'Medium' ? 'text-yellow-400' : 
          'text-green-400'
        }`}>
          {label}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= score ? 1 : 0 }}
            transition={{ duration: 0.3, delay: level * 0.1 }}
            className={`h-2 flex-1 rounded-full ${
              level <= score ? color : 'bg-gray-600'
            }`}
            style={{ transformOrigin: 'left' }}
          />
        ))}
      </div>
      
      <div className="mt-1 text-xs text-gray-400">
        {score < 3 && (
          <span>Use uppercase, lowercase, numbers, and symbols</span>
        )}
      </div>
    </div>
  )
}