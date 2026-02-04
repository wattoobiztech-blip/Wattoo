const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getAllTsxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function replaceFramerMotion(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace framer-motion imports with our wrapper
    if (content.includes("from 'framer-motion'")) {
      content = content.replace(
        /import\s+{\s*motion,\s*AnimatePresence\s*}\s+from\s+['"]framer-motion['"]/g,
        "import { motion, AnimatePresence } from '@/components/ui/Motion'"
      );
      content = content.replace(
        /import\s+{\s*AnimatePresence,\s*motion\s*}\s+from\s+['"]framer-motion['"]/g,
        "import { motion, AnimatePresence } from '@/components/ui/Motion'"
      );
      content = content.replace(
        /import\s+{\s*motion\s*}\s+from\s+['"]framer-motion['"]/g,
        "import { motion } from '@/components/ui/Motion'"
      );
      content = content.replace(
        /import\s+{\s*AnimatePresence\s*}\s+from\s+['"]framer-motion['"]/g,
        "import { AnimatePresence } from '@/components/ui/Motion'"
      );
      content = content.replace(
        /import\s+{\s*motion,\s*useScroll,\s*useTransform,\s*useAnimationFrame\s*}\s+from\s+['"]framer-motion['"]/g,
        "import { motion } from '@/components/ui/Motion'"
      );
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`✗ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('Finding all TypeScript/TSX files...\n');
const files = getAllTsxFiles('.');

console.log(`Found ${files.length} files. Replacing framer-motion imports...\n`);

let fixedCount = 0;
files.forEach(file => {
  if (replaceFramerMotion(file)) {
    fixedCount++;
  }
});

console.log(`\n✓ Done! Fixed ${fixedCount} files.`);
console.log('\nNote: Motion props (whileHover, animate, etc.) will be ignored but won\'t cause errors.');
