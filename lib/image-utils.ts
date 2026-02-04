// Image utility functions for the matrimonial website

import { IMAGE_SETTINGS } from './image-constants'

/**
 * Generate responsive image sizes for Next.js Image component
 */
export function getImageSizes(type: 'hero' | 'profile' | 'thumbnail' = 'profile'): string {
  switch (type) {
    case 'hero':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
    case 'profile':
      return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
    case 'thumbnail':
      return '(max-width: 768px) 25vw, 200px'
    default:
      return '100vw'
  }
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getImageProps(
  src: string,
  alt: string,
  type: 'hero' | 'profile' | 'thumbnail' = 'profile'
) {
  const settings = IMAGE_SETTINGS.sizes[type]
  
  return {
    src,
    alt,
    width: settings.width,
    height: settings.height,
    quality: IMAGE_SETTINGS.quality,
    sizes: getImageSizes(type),
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(settings.width, settings.height),
  }
}

/**
 * Generate a blur data URL for image placeholders
 */
export function generateBlurDataURL(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:#EC4899;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Check if image exists (for fallback logic)
 */
export async function imageExists(src: string): Promise<boolean> {
  if (typeof window === 'undefined') return true // Server-side, assume exists
  
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

/**
 * Get image with automatic fallback
 */
export async function getImageWithFallback(
  primarySrc: string,
  fallbackSrc: string
): Promise<string> {
  const exists = await imageExists(primarySrc)
  return exists ? primarySrc : fallbackSrc
}

/**
 * Preload critical images
 */
export function preloadImages(imageSrcs: string[]): void {
  if (typeof window === 'undefined') return
  
  imageSrcs.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

/**
 * Image optimization for different formats
 */
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  format?: 'webp' | 'jpg' | 'png'
): string {
  // For local images, return as-is (Next.js handles optimization)
  if (src.startsWith('/')) {
    return src
  }
  
  // For external images, add optimization parameters
  const url = new URL(src)
  if (width) url.searchParams.set('w', width.toString())
  if (height) url.searchParams.set('h', height.toString())
  if (format) url.searchParams.set('fm', format)
  
  return url.toString()
}