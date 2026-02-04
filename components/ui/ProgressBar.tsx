'use client'

import { motion } from '@/components/ui/Motion'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                      : isCurrent
                      ? 'bg-white text-primary-600 ring-4 ring-primary-500/30'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </motion.div>
                
                {stepLabels && (
                  <span className={`mt-2 text-xs ${
                    isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                  }`}>
                    {stepLabels[index]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  )
}