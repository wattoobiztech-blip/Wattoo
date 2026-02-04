// Script to create placeholder images for the matrimonial website
// This creates simple colored rectangles as placeholders

const fs = require('fs')
const path = require('path')

// Create SVG placeholder images
function createSVGPlaceholder(width, height, color, text, filename) {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}dd;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.8">
    ${text}
  </text>
</svg>`.trim()

  const filePath = path.join(__dirname, '..', 'public', 'images', filename)
  fs.writeFileSync(filePath, svg)
  console.log(`Created: ${filename}`)
}

// Create hero images
createSVGPlaceholder(2069, 1380, '#8B5CF6', 'Hero Image 1', 'hero/couple-1.svg')
createSVGPlaceholder(2069, 1380, '#EC4899', 'Hero Image 2', 'hero/couple-2.svg')  
createSVGPlaceholder(2069, 1380, '#3B82F6', 'Hero Image 3', 'hero/couple-3.svg')

// Create profile images
const profiles = [
  { name: 'Ayesha Khan', color: '#F59E0B', file: 'profiles/ayesha-khan.svg' },
  { name: 'Ahmed Ali', color: '#10B981', file: 'profiles/ahmed-ali.svg' },
  { name: 'Fatima Sheikh', color: '#EF4444', file: 'profiles/fatima-sheikh.svg' },
  { name: 'Hassan Malik', color: '#8B5CF6', file: 'profiles/hassan-malik.svg' },
  { name: 'Zara Butt', color: '#EC4899', file: 'profiles/zara-butt.svg' },
  { name: 'Usman Chaudhry', color: '#3B82F6', file: 'profiles/usman-chaudhry.svg' },
]

profiles.forEach(profile => {
  createSVGPlaceholder(400, 400, profile.color, profile.name, profile.file)
})

// Create background patterns
const patternSVG = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="2" fill="#8B5CF6" opacity="0.1"/>
      <circle cx="0" cy="0" r="1" fill="#EC4899" opacity="0.05"/>
      <circle cx="60" cy="60" r="1" fill="#3B82F6" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#pattern)"/>
</svg>`.trim()

fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', 'backgrounds', 'hero-pattern.svg'), patternSVG)
fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', 'backgrounds', 'search-pattern.svg'), patternSVG)
fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', 'backgrounds', 'features-pattern.svg'), patternSVG)

console.log('All placeholder images created successfully!')