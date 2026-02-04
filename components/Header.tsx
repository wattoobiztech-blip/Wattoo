'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LOGO_IMAGES } from '@/lib/image-constants'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isStickyUserMenuOpen, setIsStickyUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const stickyDropdownRef = useRef<HTMLDivElement>(null)

  const navItems = ['Home', 'Browse', 'Matches', 'Success Stories', 'Premium']
  const stickyNavItems = ['Home', 'Browse', 'Matches', 'Stories', 'Premium']

  const dropdownItems = [
    { icon: '👤', label: 'My Profile', link: '/user-profile' },
    { icon: '💖', label: 'My Matches', link: '/matches' },
    { icon: '👑', label: 'Subscription', link: '/subscription' },
    { icon: '⚙️', label: 'Settings', link: '/settings' },
    { icon: '🚪', label: 'Logout', link: '/logout' },
  ]

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside to close dropdown - Main Header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Click outside to close dropdown - Sticky Header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stickyDropdownRef.current && !stickyDropdownRef.current.contains(event.target as Node)) {
        setIsStickyUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Main Header - Liquid Transparent */}
      {!isScrolled && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-white/20 backdrop-blur-xl border-b border-white/30"
        >
          {/* Enhanced Liquid Glass Effect Background for Main Header */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-purple-50/10 backdrop-blur-xl" />
          
          <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-between">
            {/* Logo - Left Side */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Image
                  src={LOGO_IMAGES.main}
                  alt="Rishta.com Logo"
                  width={160}
                  height={48}
                  className="h-12 w-auto cursor-pointer"
                  priority
                />
              </Link>
            </motion.div>

            {/* Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={item === 'Home' ? '/' : '#'}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-gray-800 font-medium hover:text-purple-600 transition-all duration-300 relative group py-2"
                >
                  {item}
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            {/* User Menu - Right Side */}
            <div className="flex items-center space-x-4">
              {/* Desktop User Menu */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-full hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 group-hover:scale-105 transition-transform shadow-lg">
                    U
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-64 py-2 rounded-xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl z-50"
                    >
                      {/* Arrow indicator */}
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-white/90 border-l border-t border-white/50 transform rotate-45 backdrop-blur-xl"></div>
                      
                      {dropdownItems.map((item, index) => (
                        <motion.a
                          key={item.label}
                          href={item.link}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50/80 hover:text-purple-600 transition-all duration-200 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="text-xl mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden bg-white/20 backdrop-blur-xl border-t border-white/30 shadow-lg"
              >
                <div className="container mx-auto px-6 py-6 space-y-4">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item}
                      href={item === 'Home' ? '/' : '#'}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="block text-gray-700 font-medium hover:text-purple-600 transition-colors duration-300 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}

      {/* Sticky Header - Liquid Transparent with Functional Dropdown */}
      {isScrolled && (
        <div className="fixed top-5 left-0 right-0 z-40 flex justify-center">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-[90%] max-w-4xl h-[60px] rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl px-6 flex items-center justify-between animate-slideDown overflow-visible"
          >
            {/* Enhanced Liquid Glass Effect Background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-purple-50/5 backdrop-blur-xl animate-glassPulse" />
            
            {/* Content Layer */}
            <div className="relative z-10 flex items-center justify-between w-full">
              {/* Logo in Sticky */}
              <motion.div 
                className="flex items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <Image
                    src={LOGO_IMAGES.compact}
                    alt="Rishta.com Logo"
                    width={100}
                    height={33}
                    className="h-8 w-auto cursor-pointer"
                  />
                </Link>
              </motion.div>

              {/* Navigation in Sticky */}
              <nav className="hidden lg:flex items-center space-x-6">
                {stickyNavItems.map((item, index) => (
                  <motion.a
                    key={item}
                    href={item === 'Home' ? '/' : '#'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="text-gray-800 font-medium hover:text-purple-600 transition-all duration-200 text-sm relative group"
                  >
                    {item}
                    <motion.span 
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.a>
                ))}
              </nav>

              {/* User Menu in Sticky - Functional Dropdown */}
              <div className="relative" ref={stickyDropdownRef}>
                <motion.button
                  onClick={() => setIsStickyUserMenuOpen(!isStickyUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center text-white font-bold cursor-pointer text-sm border border-white/30 group-hover:scale-105 transition-transform duration-200 shadow-md">
                    U
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-700 transition-transform duration-300 ${isStickyUserMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Sticky Header Dropdown Menu */}
                <AnimatePresence>
                  {isStickyUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl z-[60]"
                    >
                      {/* Arrow indicator */}
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white/90 border-l border-t border-white/50 transform rotate-45 backdrop-blur-xl"></div>
                      
                      {dropdownItems.map((item, index) => (
                        <motion.a
                          key={item.label}
                          href={item.link}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-purple-50/80 hover:text-purple-600 transition-all duration-200 group text-sm"
                          onClick={() => setIsStickyUserMenuOpen(false)}
                        >
                          <span className="text-lg mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.header>
        </div>
      )}

      {/* Spacer removed - Hero section should start from top */}
      {/* <div className="h-[70px]" /> */}

      {/* Enhanced CSS Animations */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glassPulse {
          0%, 100% { 
            opacity: 0.9; 
          }
          50% { 
            opacity: 1; 
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-glassPulse {
          animation: glassPulse 4s ease-in-out infinite;
        }

        /* Enhanced glass morphism */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px) saturate(120%);
          -webkit-backdrop-filter: blur(4px) saturate(120%);
        }

        /* Smooth transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Performance optimizations */
        .backdrop-blur-xl,
        .backdrop-blur-sm {
          will-change: backdrop-filter;
        }

        .transition-all {
          will-change: transform, opacity, background-color;
        }

        /* Enhanced hover effects for glass elements */
        .hover\\:bg-white\\/20:hover {
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
        }

        .hover\\:bg-white\\/30:hover {
          background-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(6px);
        }

        /* Ensure dropdowns appear above everything */
        .z-\\[60\\] {
          z-index: 60;
        }

        /* Liquid glass effect enhancements */
        .liquid-glass {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(147, 51, 234, 0.02) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  )
}