#!/bin/bash

echo "=========================================="
echo "Removing framer-motion from all files"
echo "=========================================="
echo ""

# Find all .tsx files and remove framer-motion imports
find . -name "*.tsx" -type f ! -path "./node_modules/*" ! -path "./.next/*" -exec sed -i "s/import { motion, AnimatePresence } from 'framer-motion'/\/\/ framer-motion removed/g" {} \;
find . -name "*.tsx" -type f ! -path "./node_modules/*" ! -path "./.next/*" -exec sed -i "s/import { motion } from 'framer-motion'/\/\/ framer-motion removed/g" {} \;
find . -name "*.tsx" -type f ! -path "./node_modules/*" ! -path "./.next/*" -exec sed -i "s/import { AnimatePresence } from 'framer-motion'/\/\/ framer-motion removed/g" {} \;

echo "✓ Removed framer-motion imports"
echo ""
echo "Note: You may need to manually replace motion.* components with regular HTML elements"
echo ""
echo "Done!"
