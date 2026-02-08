'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Heart, Sparkles, Shield, Star, Users, CheckCircle, TrendingUp, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '15K+', label: 'Success Stories', icon: Heart },
    { value: '98%', label: 'Match Rate', icon: TrendingUp },
  ]

  const features = [
    { icon: Sparkles, text: 'AI-Powered Matching' },
    { icon: Shield, text: '100% Verified Profiles' },
    { icon: Heart, text: 'Privacy Protected' },
  ]

  const testimonials = [
    { name: 'Ayesha & Ahmed', text: 'Found my perfect match!', image: getImageSrc(PROFILE_IMAGES.ayesha) },
    { name: 'Fatima & Hassan', text: 'Best decision ever!', image: getImageSrc(PROFILE_IMAGES.fatima) },
    { name: 'Zara & Usman', text: 'Happily married now!', image: getImageSrc(PROFILE_IMAGES.zara) },
    { name: 'Ali Khan', text: 'Met my soulmate here!', image: getImageSrc(PROFILE_IMAGES.ahmed) },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-emerald-900 to-cyan-900">
      {/* Multi-Color Animated Background Gradient - Logo Color Scheme */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/70 via-emerald-800/50 to-green-900/60 animate-gradient-xy opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-900/40 via-transparent to-teal-800/50 opacity-75"></div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px] animate-pulse-subtle"></div>

      {/* Enhanced Gradient Orbs with Parallax - Teal/Emerald Color Scheme */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob will-change-transform"
        style={{ transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px)` }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 will-change-transform"
        style={{ transform: `translate(${-mousePosition.x * 1.3}px, ${mousePosition.y * 0.9}px)` }}
      ></div>
      <div
        className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 will-change-transform"
        style={{ transform: `translate(${mousePosition.x * 0.8}px, ${-mousePosition.y * 1.1}px)` }}
      ></div>

      {/* Additional Accent Orbs */}
      <div
        className="absolute top-1/2 -right-48 w-80 h-80 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob will-change-transform"
        style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 1.5}px)` }}
      ></div>
      <div
        className="absolute -top-40 right-1/3 w-72 h-72 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"
        style={{ transform: `translate(${mousePosition.x * 0.7}px, ${mousePosition.y * 0.8}px)` }}
      ></div>

      {/* Floating Particles - Teal/Green Color Scheme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const colors = ['16, 185, 129', '20, 184, 166', '6, 182, 212', '34, 197, 94', '0, 184, 148', '45, 212, 191'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={i}
              className="absolute rounded-full animate-float will-change-transform"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `rgba(${randomColor}, ${0.2 + Math.random() * 0.4})`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 15}s`,
                boxShadow: `0 0 ${2 + Math.random() * 3}px rgba(${randomColor}, 0.5)`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex items-start lg:items-center justify-center px-4 pt-36 pb-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full max-w-7xl">

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8 w-full max-w-2xl order-last lg:order-first">
            {/* Badge - Modern Design */}
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 backdrop-blur-lg border border-teal-400/40 text-white text-[10px] sm:text-xs font-semibold hover:from-teal-500/30 hover:to-emerald-500/30 transition-all duration-300 group">
              <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0 group-hover:animate-spin" />
              <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">Pakistan's Most Trusted Platform</span>
              <div className="flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/20 text-green-300 text-xs font-bold border border-green-400/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>

            {/* Main Heading with Gradient - Compact */}
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.15] tracking-tighter">
                <span className="block bg-gradient-to-r from-white via-emerald-200 to-teal-300 text-transparent bg-clip-text drop-shadow-2xl">Find Your</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 animate-gradient-x drop-shadow-2xl leading-none mt-1 sm:mt-2">Perfect Match</span>
              </h1>
            </div>

            {/* CTA Buttons - Modern Ultra Design */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/register" className="group">
                <button className="relative w-full px-8 py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl shadow-teal-500/50 hover:shadow-teal-600/70 transition-all duration-300 overflow-hidden hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2 whitespace-nowrap font-semibold">
                    Start Free Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>
              </Link>

              <Link href="/dashboard/search" className="group">
                <button className="relative w-full px-8 py-4 bg-gradient-to-br from-white/20 to-teal-500/20 text-white border border-white/40 rounded-2xl font-bold text-base sm:text-lg hover:border-white/60 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 backdrop-blur-xl hover:from-white/30 hover:to-teal-500/30">
                  <Heart className="w-5 h-5 group-hover:fill-teal-400 group-hover:text-teal-400 transition-all duration-300" />
                  <span className="font-semibold">Browse Profiles</span>
                </button>
              </Link>
            </div>

            {/* Stats - Modern Grid Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative text-center p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-white/15 to-teal-500/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-teal-500/30 hover:from-white/25 hover:to-teal-500/20"
                >
                  <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <stat.icon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:to-teal-300 transition-all">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1 font-semibold group-hover:text-white/90 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Profile Stack */}
          <div className="relative w-full max-w-lg mx-auto lg:ml-auto order-first lg:order-last mb-12 lg:mb-0">
            {/* Main Card Container */}
            <div className="relative w-full h-fit">
              {/* Floating Active Users - Top Left */}
              <div className="absolute -top-6 -left-4 z-30 bg-gradient-to-br from-teal-500 to-emerald-500 p-3 rounded-2xl shadow-2xl shadow-teal-500/50 animate-float animation-delay-2000 hover:shadow-teal-500/70 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="text-xl font-bold">2.5K+</div>
                    <div className="text-xs opacity-90 whitespace-nowrap">Online</div>
                  </div>
                </div>
              </div>

              {/* Profile Cards Stack */}
              <div className="relative w-full flex items-center justify-center">
                <div className="relative w-full max-w-md h-[380px] sm:h-[620px]">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute left-0 right-0 mx-auto top-0 w-full transition-all duration-700 ${index === activeIndex
                        ? 'opacity-100 scale-100 z-10'
                        : index === (activeIndex + 1) % testimonials.length
                          ? 'opacity-70 scale-95 z-5'
                          : 'opacity-40 scale-90 z-0'
                        }`}
                      style={{
                        transform: index === activeIndex
                          ? 'rotate(0deg) translateY(0)'
                          : index === (activeIndex + 1) % testimonials.length
                            ? 'rotate(2deg) translateY(15px)'
                            : 'rotate(4deg) translateY(30px)'
                      }}
                    >
                      <div className="bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-2xl border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-2xl hover:shadow-teal-500/40 transition-all duration-300">
                        {/* Profile Image */}
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-xl mx-auto">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover object-center"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                          {/* Verified Badge */}
                          <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>

                          {/* Name Overlay */}
                          <div className="absolute bottom-4 left-4 right-4 text-center">
                            <h3 className="text-white text-lg font-bold mb-1">{testimonial.name}</h3>
                            <div className="flex items-center justify-center gap-1 text-white/80 text-xs">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{testimonial.text}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center gap-1 group hover:scale-105">
                            <Heart className="w-4 h-4 group-hover:fill-white transition-all" />
                            Like
                          </button>
                          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-400/30 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="relative flex justify-center gap-2 z-20 mt-8 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${index === activeIndex
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 w-6 h-2.5'
                      : 'bg-white/30 hover:bg-white/50 w-2.5 h-2.5'
                      }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-white/5"
          />
        </svg>
      </div>
    </section>
  )
}
