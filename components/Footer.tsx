'use client'

import { motion } from '@/components/ui/Motion'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LOGO_IMAGES } from '@/lib/image-constants'

export default function Footer() {
  const links = [
    { name: 'About', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Success Stories', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src={LOGO_IMAGES.main}
                alt="Rishta.com Logo"
                width={140}
                height={42}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm">
              © 2024 Rishta.com. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-teal-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}