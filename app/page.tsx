'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CallActionSection from '@/components/CallActionSection'
import SearchSection from '@/components/SearchSection'
import FeaturesSection from '@/components/FeaturesSection'
import ProfileShowcase from '@/components/ProfileShowcase'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <CustomCursor />
      <Header />
      <HeroSection />
      <CallActionSection />
      <SearchSection />
      <FeaturesSection />
      <ProfileShowcase />
      <Footer />
    </main>
  )
}