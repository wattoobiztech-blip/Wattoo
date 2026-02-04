'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimationFrame } from '@/components/ui/Motion'
import { ArrowRight, Heart, Users, Shield, Star, Zap, MapPin, Crown, Verified } from 'lucide-react'
import Image from 'next/image'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  const profiles = [
    { id: 1, name: 'Ayesha Khan', age: 26, profession: 'Software Engineer', location: 'Karachi', image: getImageSrc(PROFILE_IMAGES.ayesha, FALLBACK_IMAGES.profiles.ayesha), verified: true, premium: true },
    { id: 2, name: 'Ahmed Ali', age: 29, profession: 'Doctor', location: 'Lahore', image: getImageSrc(PROFILE_IMAGES.ahmed, FALLBACK_IMAGES.profiles.ahmed), verified: true, premium: false },
    { id: 3, name: 'Fatima Sheikh', age: 24, profession: 'Teacher', location: 'Islamabad', image: getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima), verified: true, premium: true },
    { id: 4, name: 'Hassan Malik', age: 31, profession: 'Business Owner', location: 'Rawalpindi', image: getImageSrc(PROFILE_IMAGES.hassan, FALLBACK_IMAGES.profiles.hassan), verified: true, premium: false },
    { id: 5, name: 'Zara Butt', age: 27, profession: 'Marketing Manager', location: 'Faisalabad', image: getImageSrc(PROFILE_IMAGES.zara, FALLBACK_IMAGES.profiles.zara), verified: true, premium: true },
    { id: 6, name: 'Usman Chaudhry', age: 28, profession: 'Chartered Accountant', location: 'Multan', image: getImageSrc(PROFILE_IMAGES.usman, FALLBACK_IMAGES.profiles.usman), verified: true, premium: false },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Profile Carousel Animation Logic
  const [isHovered, setIsHovered] = useState(false)
  const xTranslation = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useAnimationFrame((t: number, delta: number) => {
    if (!containerRef.current || isHovered) return
    xTranslation.current -= 0.8
    if (Math.abs(xTranslation.current) >= containerRef.current.scrollWidth / 2) {
      xTranslation.current = 0
    }
    containerRef.current.style.transform = `translateX(${xTranslation.current}px)`
  })

  // Bubbles Logic
  const bubbles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    x: Math.random() * 100,
    duration: Math.random() * 15 + 15,
    delay: Math.random() * 5
  }))

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-[#fff0f3] via-[#fff5f7] to-[#fce4ec] flex flex-col justify-between pt-24">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Circular Patterns - White & Pink/Purple Gradients */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 20 + i * 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute rounded-full border-[1.5px] border-white/40"
              style={{
                width: `${(i + 1) * 350}px`,
                height: `${(i + 1) * 350}px`,
                left: `${50 - ((i + 1) * 15)}%`,
                top: `${50 - ((i + 1) * 15)}%`,
                background: i % 2 === 0
                  ? 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 80%)'
                  : 'radial-gradient(circle at center, rgba(139,92,246,0.05) 0%, rgba(219,39,119,0.05) 100%)',
                boxShadow: '0 0 60px rgba(255,182,193,0.1)'
              }}
            />
          ))}
        </div>

        {/* Floating Bubbles */}
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ x: `${bubble.x}%`, y: "110%", opacity: 0 }}
            animate={{
              y: ["110%", "-10%"],
              opacity: [0, 0.3, 0]
            }}
            transition={{ duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" }}
            className="absolute bg-white/50 rounded-full blur-[1px]"
            style={{ width: bubble.size, height: bubble.size }}
          />
        ))}

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-pink-300/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-300/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative group max-w-lg mx-auto lg:mx-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="relative w-full aspect-[4/3] rounded-[60px] overflow-hidden border-8 border-white shadow-[0_25px_50px_rgba(255,182,193,0.3)] bg-white"
                >
                  <Image
                    src="/images/hero/pakistani-couple.png"
                    alt="Pakistani Couple"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Floating Badges */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 -right-4 md:-right-8 bg-white/95 backdrop-blur-2xl border border-pink-100 p-4 rounded-2xl shadow-xl z-30"
                >
                  <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-none">Find Your</h1>
                </motion.div>

                <motion.div
                  initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -bottom-4 -left-4 md:-left-8 bg-gradient-to-br from-pink-400 to-[#ff85a2] p-4 rounded-2xl shadow-xl z-30"
                >
                  <h1 className="text-xl md:text-2xl font-black text-white leading-none">Perfect Match</h1>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-6 rotate-[5deg] lg:rotate-[8deg] max-w-md mx-auto">
                {[
                  { icon: Shield, label: 'Verified', color: 'text-pink-500' },
                  { icon: Zap, label: 'Fast Match', color: 'text-pink-500' },
                  { icon: Heart, label: 'True Love', color: 'text-pink-500' },
                  { icon: Star, label: 'Premium', color: 'text-pink-500' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: i * 0.5 }}
                    className="p-6 rounded-[35px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_35px_rgba(255,182,193,0.2)] flex flex-col items-center justify-center space-y-3 hover:scale-105 transition-transform"
                  >
                    <div className="p-3 bg-pink-50/50 rounded-xl">
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <span className="text-slate-800 font-bold text-lg tracking-tight">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-10 max-w-sm ml-auto mr-4"
              >
                <p className="text-sm md:text-base text-slate-500 italic border-r-4 border-pink-300 pr-6 text-right bg-white/30 backdrop-blur-sm p-4 rounded-l-2xl shadow-sm">
                  "Love is not about finding the perfect person, but seeing an imperfect person perfectly."
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Centered Buttons Outside Grid Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 133, 162, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-pink-500 to-[#ff85a2] text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.95)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/80 backdrop-blur-md text-slate-700 border border-pink-100 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg"
            >
              Find Your Partner
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Profile Carousel */}
      <div className="relative z-30 w-full -mt-12 mb-8">
        <div
          className="relative overflow-hidden group py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#fff0f3] via-[#fff0f3]/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#fce4ec] via-[#fce4ec]/50 to-transparent z-10 pointer-events-none" />

          <div
            ref={containerRef}
            className="flex space-x-8 whitespace-nowrap px-8 w-max"
          >
            {[...profiles, ...profiles, ...profiles].map((profile, index) => (
              <motion.div
                key={`${profile.id}-${index}`}
                whileHover={{ y: -10, scale: 1.02 }}
                className="w-[380px] h-[160px] bg-white/80 backdrop-blur-xl border-2 border-white rounded-[40px] p-6 flex items-center space-x-6 shadow-[0_10px_30px_rgba(255,182,193,0.2)] hover:shadow-[0_20px_50px_rgba(255,182,193,0.4)] transition-all duration-500 cursor-pointer relative"
              >
                <div className="relative w-28 h-28 rounded-[30px] overflow-hidden shrink-0 border-2 border-pink-50 shadow-sm">
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                  {profile.premium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-br from-pink-400 to-pink-600 p-1.5 rounded-xl">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-slate-900 font-bold text-2xl truncate tracking-tight">{profile.name}</h4>
                    {profile.verified && <Verified className="w-5 h-5 text-pink-500 shrink-0" />}
                  </div>
                  <p className="text-slate-500 text-base mt-1 truncate font-medium">{profile.profession}</p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center text-xs text-slate-600 bg-pink-50/50 px-3 py-1.5 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-pink-500" />
                      {profile.location}
                    </div>
                    <div className="flex items-center text-xs text-slate-600 bg-pink-50/50 px-3 py-1.5 rounded-xl">
                      <Users className="w-3.5 h-3.5 mr-2 text-pink-500" />
                      {profile.age} Yrs
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
        section { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
    </section>
  )
}
