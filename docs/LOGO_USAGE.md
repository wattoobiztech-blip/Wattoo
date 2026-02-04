# Logo Usage Guide - Rishta.com

## Logo Variants

### 1. Main Logo (`logo.svg`)
- **Size**: 200x60px
- **Usage**: Main headers, desktop navigation, large displays
- **Features**: 
  - Full "Rishta.com" text with gradient
  - Heart icon with gradient
  - Animated decorative elements
  - Optimized for larger spaces

### 2. Compact Logo (`logo-compact.svg`)
- **Size**: 120x40px  
- **Usage**: Mobile headers, sticky navigation, compact spaces
- **Features**:
  - Smaller "Rishta.com" text
  - Simplified heart icon
  - Minimal decorative elements
  - Optimized for smaller spaces

### 3. Favicon (`favicon.svg`)
- **Size**: 32x32px
- **Usage**: Browser tabs, app icons, bookmarks
- **Features**:
  - Heart icon only
  - Circular gradient background
  - No text (icon-only)
  - High contrast for small sizes

## Implementation

### In Components
```typescript
import { LOGO_IMAGES } from '@/lib/image-constants'
import Image from 'next/image'

// Main logo
<Image
  src={LOGO_IMAGES.main}
  alt="Rishta.com Logo"
  width={160}
  height={48}
  className="h-12 w-auto"
  priority
/>

// Compact logo
<Image
  src={LOGO_IMAGES.compact}
  alt="Rishta.com Logo"
  width={100}
  height={33}
  className="h-8 w-auto"
/>
```

### In Layout (Favicon)
```typescript
export const metadata: Metadata = {
  icons: {
    icon: '/images/icons/favicon.svg',
    shortcut: '/images/icons/favicon.svg',
    apple: '/images/icons/favicon.svg',
  },
}
```

## Current Usage

### Header Component
- **Main Header**: Uses `logo.svg` (160x48 display size)
- **Sticky Header**: Uses `logo-compact.svg` (100x33 display size)
- **Mobile Menu**: Inherits from main header

### Footer Component
- **Footer Brand**: Uses `logo.svg` (180x54 display size)

### Browser
- **Favicon**: Uses `favicon.svg` for all browser icons

## Design Elements

### Color Scheme
- **Primary Gradient**: Purple (#8B5CF6) → Pink (#EC4899) → Blue (#3B82F6)
- **Heart Gradient**: Pink (#EC4899) → Orange (#F97316)
- **Text Color**: Gradient for "Rishta", Gray (#6B7280) for ".com"

### Typography
- **Font**: Montserrat (fallback: Arial, sans-serif)
- **Weights**: 800 (Rishta), 600 (.com)
- **Responsive**: Scales appropriately for each variant

### Animations
- **Decorative Dots**: Subtle opacity animations (2-3s duration)
- **Performance**: Lightweight SVG animations
- **Accessibility**: Respects `prefers-reduced-motion`

## Responsive Behavior

### Desktop (>1024px)
- Main logo in header (160x48)
- Compact logo in sticky header (100x33)

### Tablet (768px-1024px)
- Main logo in header (140x42)
- Compact logo in sticky header (90x30)

### Mobile (<768px)
- Compact logo in header (100x33)
- Favicon in mobile menu toggle

## Brand Guidelines

### Do's
✅ Use appropriate logo variant for context
✅ Maintain aspect ratio when scaling
✅ Ensure sufficient contrast with background
✅ Use provided color schemes
✅ Keep adequate white space around logo

### Don'ts
❌ Don't stretch or distort the logo
❌ Don't change colors outside brand palette
❌ Don't use low-resolution versions
❌ Don't place on busy backgrounds without contrast
❌ Don't remove or modify the heart icon

## File Specifications

### Format
- **Primary**: SVG (scalable, small file size)
- **Fallback**: PNG (if SVG not supported)

### Optimization
- Minified SVG code
- Embedded gradients and animations
- Optimized for web performance
- Cross-browser compatible

### Accessibility
- Proper alt text in implementations
- High contrast ratios
- Scalable for zoom levels up to 200%

## Future Enhancements

### Planned Additions
- Dark mode logo variants
- Monochrome versions for special uses
- Animated logo for loading states
- Social media profile versions

### Customization Options
- Theme-based color variations
- Seasonal/holiday variants
- Localized versions for different markets

This logo system provides a consistent, professional brand identity across all touchpoints of the Rishta.com matrimonial platform.