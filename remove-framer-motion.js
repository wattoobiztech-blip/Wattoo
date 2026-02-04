// Script to remove framer-motion from all components
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'components/ui/Input.tsx',
  'components/ui/PasswordStrength.tsx',
  'components/ui/ProgressBar.tsx',
  'components/ui/RadioGroup.tsx',
  'components/ui/RangeSlider.tsx',
  'components/ui/Select.tsx',
  'components/ui/TagInput.tsx',
];

filesToFix.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove framer-motion import
    content = content.replace(/import\s+{[^}]*}\s+from\s+['"]framer-motion['"]\s*\n?/g, '');
    content = content.replace(/import\s+\*\s+as\s+\w+\s+from\s+['"]framer-motion['"]\s*\n?/g, '');
    
    // Replace motion.div with div
    content = content.replace(/<motion\.div/g, '<div');
    content = content.replace(/<\/motion\.div>/g, '</div>');
    
    // Replace motion.button with button
    content = content.replace(/<motion\.button/g, '<button');
    content = content.replace(/<\/motion\.button>/g, '</button>');
    
    // Replace motion.span with span
    content = content.replace(/<motion\.span/g, '<span');
    content = content.replace(/<\/motion\.span>/g, '</span>');
    
    // Replace motion.label with label
    content = content.replace(/<motion\.label/g, '<label');
    content = content.replace(/<\/motion\.label>/g, '</label>');
    
    // Remove motion props
    content = content.replace(/\s+initial={{[^}]*}}/g, '');
    content = content.replace(/\s+animate={{[^}]*}}/g, '');
    content = content.replace(/\s+exit={{[^}]*}}/g, '');
    content = content.replace(/\s+whileHover={{[^}]*}}/g, '');
    content = content.replace(/\s+whileTap={{[^}]*}}/g, '');
    content = content.replace(/\s+transition={{[^}]*}}/g, '');
    content = content.replace(/\s+variants={{[^}]*}}/g, '');
    
    // Remove AnimatePresence
    content = content.replace(/<AnimatePresence[^>]*>/g, '<>');
    content = content.replace(/<\/AnimatePresence>/g, '</>');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
  } catch (error) {
    console.log(`✗ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\nDone! All UI components fixed.');
