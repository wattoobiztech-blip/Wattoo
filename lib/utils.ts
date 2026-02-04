import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.match(/[a-z]/)) score++
  if (password.match(/[A-Z]/)) score++
  if (password.match(/[0-9]/)) score++
  if (password.match(/[^a-zA-Z0-9]/)) score++

  if (score <= 2) {
    return { score, label: 'Weak', color: 'bg-red-500' }
  } else if (score <= 3) {
    return { score, label: 'Medium', color: 'bg-yellow-500' }
  } else {
    return { score, label: 'Strong', color: 'bg-green-500' }
  }
}