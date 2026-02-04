# Image Storage for Rishta.com

This directory contains all images used in the matrimonial website.

## Directory Structure

```
public/images/
├── hero/           # Hero section background images
├── profiles/       # Profile photos for featured members
├── backgrounds/    # Background patterns and textures
├── icons/          # Custom icons and logos
└── README.md       # This file
```

## Image Categories

### Hero Images (`/hero/`)
- `couple-1.svg` - Main hero background (2069x1380)
- `couple-2.svg` - Second slide background (2069x1380)  
- `couple-3.svg` - Third slide background (2069x1380)

### Profile Images (`/profiles/`)
- `ayesha-khan.svg` - Female profile photo (400x400)
- `ahmed-ali.svg` - Male profile photo (400x400)
- `fatima-sheikh.svg` - Female profile photo (400x400)
- `hassan-malik.svg` - Male profile photo (400x400)
- `zara-butt.svg` - Female profile photo (400x400)
- `usman-chaudhry.svg` - Male profile photo (400x400)

### Background Patterns (`/backgrounds/`)
- `hero-pattern.svg` - Decorative pattern for hero section
- `search-pattern.svg` - Pattern for search section
- `features-pattern.svg` - Pattern for features section

### Logo Images (`/icons/`)
- `logo.svg` - Main logo for headers and large displays (200x60)
- `logo-compact.svg` - Compact logo for mobile and small spaces (120x40)
- `favicon.svg` - Favicon and app icon (32x32)

## Image Guidelines

### Formats
- **Primary**: SVG for scalability and small file sizes
- **Secondary**: WebP for photographs (when available)
- **Fallback**: JPG for broad compatibility

### Sizes
- **Hero Images**: 2069x1380px (3:2 aspect ratio)
- **Profile Photos**: 400x400px (1:1 aspect ratio)
- **Thumbnails**: 200x200px (1:1 aspect ratio)
- **Icons**: 24x24px, 32x32px, 48x48px

### Optimization
- All images should be optimized for web
- SVG files should be minified
- JPG quality: 85-90%
- WebP quality: 80-85%

## Usage in Components

Images are managed through the `lib/image-constants.ts` file:

```typescript
import { HERO_IMAGES, getImageSrc } from '@/lib/image-constants'

// Use with fallback for development
const imageSrc = getImageSrc(HERO_IMAGES.slide1, fallbackUrl)
```

## Development vs Production

- **Development**: Uses fallback URLs (Unsplash) if local images not available
- **Production**: Always uses local images for better performance and reliability

## Adding New Images

1. Add image file to appropriate directory
2. Update `lib/image-constants.ts` with new image path
3. Add fallback URL for development (optional)
4. Update component to use new image constant

## Performance Notes

- All images use Next.js Image component for optimization
- Lazy loading is enabled by default
- Images are served with proper caching headers
- SVG images load instantly and scale perfectly

## Placeholder Images

Current images are SVG placeholders with:
- Gradient backgrounds
- Text labels for identification
- Proper dimensions for each use case
- Optimized file sizes

Replace these with actual photographs when available.