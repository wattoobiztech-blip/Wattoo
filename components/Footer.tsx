'use client'

import { motion } from '@/components/ui/Motion'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LOGO_IMAGES } from '@/lib/image-constants'

export default function Footer() {
  const footerSections = [
    {
      title: 'About',
      links: [
        { name: 'Our Story', href: '#' },
        { name: 'How It Works', href: '#' },
        { name: 'Success Stories', href: '#' },
        { name: 'Press & Media', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Premium Membership', href: '#' },
        { name: 'Matchmaking', href: '#' },
        { name: 'Profile Verification', href: '#' },
        { name: 'Wedding Planning', href: '#' },
        { name: 'Astrology', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Refund Policy', href: '#' },
        { name: 'Community Guidelines', href: '#' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Customer Support', href: '#' },
        { name: 'Feedback', href: '#' },
        { name: 'Report Issue', href: '#' },
        { name: 'Partner With Us', href: '#' },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Love Stories
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest success stories, dating tips, and exclusive offers delivered to your inbox
            </p>
            
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Logo */}
                <div className="flex items-center mb-6">
                  <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Image
                      src={LOGO_IMAGES.main}
                      alt="Rishta.com Logo"
                      width={180}
                      height={54}
                      className="h-14 w-auto cursor-pointer"
                    />
                  </Link>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  India's most trusted matrimonial platform, connecting hearts and creating beautiful love stories since 2010. 
                  Join millions of happy couples who found their soulmate with us.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Phone className="h-4 w-4 text-primary-500" />
                    <span>+91 1800-123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="h-4 w-4 text-primary-500" />
                    <span>support@rishta.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="h-4 w-4 text-primary-500" />
                    <span>Mumbai, Maharashtra, India</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mt-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-colors duration-300 hover:bg-gray-700`}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1, duration: 0.8 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-6">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <motion.a
                          href={link.href}
                          whileHover={{ x: 5 }}
                          className="text-gray-400 hover:text-primary-400 transition-colors duration-300 block"
                        >
                          {link.name}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <div className="text-gray-400 text-sm">
              © 2024 Rishta.com. All rights reserved. Made with ❤️ in India.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                Cookie Settings
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
            className="absolute bottom-0 text-primary-500/20 text-2xl"
            style={{ left: `${Math.random() * 100}%` }}
          >
            💖
          </motion.div>
        ))}
      </div>
    </footer>
  )
}