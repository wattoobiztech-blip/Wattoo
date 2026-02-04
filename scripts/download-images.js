// Script to download and optimize images for the matrimonial website
// Run this script to replace placeholder images with real photos

const https = require('https')
const fs = require('fs')
const path = require('path')

// Image URLs to download
const imageUrls = {
  // Hero images
  'hero/couple-1.jpg': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
  'hero/couple-2.jpg': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
  'hero/couple-3.jpg': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
  
  // Profile images
  'profiles/ayesha-khan.jpg': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  'profiles/ahmed-ali.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'profiles/fatima-sheikh.jpg': 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
  'profiles/hassan-malik.jpg': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  'profiles/zara-butt.jpg': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  'profiles/usman-chaudhry.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
}

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '..', 'public', 'images', filepath)
    const dir = path.dirname(fullPath)
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    const file = fs.createWriteStream(fullPath)
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Downloaded: ${filepath}`)
          resolve()
        })
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {}) // Delete the file on error
      reject(err)
    })
  })
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image download...')
  
  for (const [filepath, url] of Object.entries(imageUrls)) {
    try {
      await downloadImage(url, filepath)
    } catch (error) {
      console.error(`Error downloading ${filepath}:`, error.message)
    }
  }
  
  console.log('Image download completed!')
  console.log('\nNext steps:')
  console.log('1. Update lib/image-constants.ts to use .jpg extensions')
  console.log('2. Remove .svg placeholder files if desired')
  console.log('3. Test the website with new images')
}

// Run the download
if (require.main === module) {
  downloadAllImages().catch(console.error)
}

module.exports = { downloadAllImages, downloadImage }