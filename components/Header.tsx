'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { Menu, X, ChevronDown, Phone, User, Heart, Crown, Settings, LogOut, Sparkles } from 'lucide-react'
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

  const navItems = ['Home', 'Browse', 'Premium']
  const stickyNavItems = ['Home', 'Browse', 'Premium']

  const dropdownItems = [
    { icon: User, label: 'My Profile', link: '/user-profile' },
    { icon: Heart, label: 'My Matches', link: '/matches' },
    { icon: Crown, label: 'Subscription', link: '/subscription' },
    { icon: Settings, label: 'Settings', link: '/settings' },
    { icon: LogOut, label: 'Logout', link: '/logout' },
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
      {/* Main Header - Gradient Background & Right Aligned Menu */}
      {!isScrolled && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 h-[80px]"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 backdrop-blur-md opacity-95 shadow-lg border-b border-teal-200/30" />

          <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-between">
            {/* Logo - Left Side */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                <Image
                  src={LOGO_IMAGES.main}
                  alt="Rishta.com Logo"
                  width={200}
                  height={60}
                  className="h-14 w-auto cursor-pointer"
                  priority
                />
              </Link>
            </motion.div>

            {/* Navigation & User Menu - Right Aligned */}
            <div className="flex items-center gap-8 ml-auto">
              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item}
                    href={item === 'Home' ? '/' : '#'}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="text-teal-900 text-sm font-semibold capitalize hover:text-teal-700 transition-all duration-300 relative group py-2"
                  >
                    {item}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </nav>

              {/* User Menu - Right Side */}
              <div className="flex items-center space-x-4">
                {/* Instant Contact Button - Main Header */}
                <motion.a
                  href="tel:+923001234567"
                  className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Instant Contact</span>
                </motion.a>

                {/* Desktop User Menu */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-1 rounded-full hover:bg-teal-100/50 transition-all duration-300 group backdrop-blur-md border border-teal-300/40"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/80 to-emerald-500/80 flex items-center justify-center text-white font-bold text-lg border border-teal-400/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      U
                    </div>
                    <ChevronDown className={`w-4 h-4 text-teal-900 transition-transform duration-300 ${isStickyUserMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-64 py-2 rounded-xl bg-white/95 backdrop-blur-xl border border-teal-200/50 shadow-2xl z-50 origin-top-right"
                      >
                        {/* Arrow indicator */}
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-white/95 border-l border-t border-teal-200/50 transform rotate-45 backdrop-blur-xl"></div>

                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-teal-100 mb-2 bg-gradient-to-r from-teal-50 to-emerald-50/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                              U
                            </div>
                            <div>
                              <p className="text-sm font-bold text-teal-900">User Profile</p>
                              <p className="text-xs text-teal-600 font-medium">Verified Member</p>
                            </div>
                          </div>
                        </div>

                        {dropdownItems.map((item, index) => (
                          <motion.a
                            key={item.label}
                            href={item.link}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 group relative mx-2 rounded-lg"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <span className="p-2 bg-gray-100 rounded-full group-hover:bg-teal-100/50 text-gray-500 group-hover:text-teal-600 transition-colors mr-3">
                              <item.icon className="w-4 h-4" />
                            </span>
                            <span className="font-medium text-sm">{item.label}</span>

                            {item.label === 'Subscription' && (
                              <span className="absolute right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                              </span>
                            )}
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-teal-900/20 transition-colors duration-300 backdrop-blur-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6 text-teal-900" /> : <Menu className="w-6 h-6 text-teal-900" />}
                  </motion.div>
                </motion.button>
              </div>
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
                className="lg:hidden bg-emerald-900/95 backdrop-blur-xl border-t border-teal-200/20 shadow-lg absolute w-full left-0 top-[80px]"
              >
                <div className="container mx-auto px-6 py-6 space-y-4">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item}
                      href={item === 'Home' ? '/' : '#'}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="block text-teal-100 font-medium hover:text-emerald-300 transition-colors duration-300 py-2 border-b border-teal-800/30"
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
            className="relative w-[95%] max-w-7xl h-[60px] rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl px-6 flex items-center justify-between animate-slideDown overflow-visible"
          >
            {/* Enhanced Liquid Glass Effect Background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-teal-100/10 backdrop-blur-xl animate-glassPulse" />

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
                    width={160}
                    height={52}
                    className="h-12 w-auto cursor-pointer"
                  />
                </Link>
              </motion.div>

              {/* Right Side Alignment Container */}
              <div className="flex items-center gap-6">
                {/* Navigation in Sticky */}
                <nav className="hidden lg:flex items-center space-x-6">
                  {stickyNavItems.map((item, index) => (
                    <motion.a
                      key={item}
                      href={item === 'Home' ? '/' : '#'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="text-teal-800 font-medium hover:text-teal-600 transition-all duration-200 text-sm relative group"
                    >
                      {item}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.a>
                  ))}
                </nav>

                <div className="flex items-center space-x-3">
                  {/* Instant Contact Button - Sticky Header */}
                  <motion.a
                    href="tel:+923001234567"
                    className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1.5 rounded-full font-medium text-xs shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Instant Contact</span>
                  </motion.a>

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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/80 to-emerald-500/80 flex items-center justify-center text-white font-bold cursor-pointer text-sm border border-teal-400/60 group-hover:scale-105 transition-transform duration-200 shadow-md">
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

                          {/* User Info Header - Sticky */}
                          <div className="px-4 py-3 border-b border-gray-100 mb-2 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                U
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-800">User Profile</p>
                                <p className="text-[10px] text-teal-600 font-medium">Verified Member</p>
                              </div>
                            </div>
                          </div>

                          {dropdownItems.map((item, index) => (
                            <motion.a
                              key={item.label}
                              href={item.link}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-teal-700 transition-all duration-200 group text-sm mx-2 rounded-lg"
                              onClick={() => setIsStickyUserMenuOpen(false)}
                            >
                              <span className="p-1.5 bg-gray-100 rounded-full group-hover:bg-teal-100/50 text-gray-500 group-hover:text-teal-600 transition-colors mr-3">
                                <item.icon className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-medium text-xs">{item.label}</span>
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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