// Image constants for the matrimonial website
// All images are stored locally in public/images/

export const HERO_IMAGES = {
  slide1: '/images/hero/couple-1.svg',
  slide2: '/images/hero/couple-2.svg',
  slide3: '/images/hero/couple-3.svg',
} as const

export const PROFILE_IMAGES = {
  // Female profiles
  ayesha: '/images/profiles/profile_ayesha-khan.jpg',
  fatima: '/images/profiles/profile_fatima-sheikh.jpg',
  zara: '/images/profiles/profile_zara-butt.png',

  // Male profiles  
  ahmed: '/images/profiles/profile_ahmed-ali.jpg',
  hassan: '/images/profiles/profile_hassan-malik.jpg',
  usman: '/images/profiles/profile_usman-chaudhry.jpg',
} as const

export const BACKGROUND_IMAGES = {
  heroPattern: '/images/backgrounds/hero-pattern.svg',
  searchPattern: '/images/backgrounds/search-pattern.svg',
  featuresPattern: '/images/backgrounds/features-pattern.svg',
} as const

export const LOGO_IMAGES = {
  main: '/images/icons/logo.svg',
  compact: '/images/icons/logo-compact.svg',
  favicon: '/images/icons/favicon.svg',
} as const

// Fallback images for development (using placeholder services)
export const FALLBACK_IMAGES = {
  hero: {
    slide1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    slide2: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    slide3: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
  },
  profiles: {
    ayesha: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    fatima: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    zara: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    ahmed: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    hassan: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    usman: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  }
} as const

// Helper function to get image with fallback
export function getImageSrc(localPath: string, fallbackUrl?: string): string {
  // In production, always use local images
  if (process.env.NODE_ENV === 'production') {
    return localPath
  }

  // In development, use fallback if provided, otherwise use local
  return fallbackUrl || localPath
}

// Image optimization settings
export const IMAGE_SETTINGS = {
  quality: 90,
  formats: ['webp', 'jpg'],
  sizes: {
    hero: { width: 2069, height: 1380 },
    profile: { width: 400, height: 400 },
    thumbnail: { width: 200, height: 200 },
  }
} as const