'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { Search, MapPin, Calendar, Users, Heart, Sparkles, Filter, ChevronDown, X, Plus } from 'lucide-react'
import RangeSlider from '@/components/ui/RangeSlider'

export default function SearchSection() {
  const [gender, setGender] = useState('')
  const [ageRange, setAgeRange] = useState<[number, number]>([24, 35])
  const [religion, setReligion] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']



  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ultra Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50/40 to-cyan-50/40">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-teal-300/5 to-emerald-300/5 rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-left"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-emerald-100 px-6 py-3 rounded-full mb-6 border border-teal-200/50"
              >
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span className="text-teal-700 font-semibold text-sm">AI-Powered Matching</span>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Your
                <br />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 bg-clip-text text-transparent">
                  Perfect Match
                </span>
              </h2>

              <p className="text-xl text-gray-600 max-w-xl leading-relaxed mb-8">
                Advanced AI algorithms analyze compatibility across 50+ dimensions to find your ideal life partner. Join thousands of happy couples who found love with Rishta.com.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-teal-500 font-bold text-lg">50+</span>
                  <span className="text-gray-600 text-sm">Matching<br />Parameters</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-emerald-500 font-bold text-lg">98%</span>
                  <span className="text-gray-600 text-sm">Success<br />Rate</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-cyan-500 font-bold text-lg">24/7</span>
                  <span className="text-gray-600 text-sm">Verified<br />Profiles</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Glassmorphism Container */}
                <div
                  className="relative backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(88, 28, 135, 0.9) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full opacity-60 animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full opacity-40 animate-pulse"></div>

                  {/* Search Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-3 mb-2">
                      <Heart className="w-5 h-5 text-teal-400" />
                      <h3 className="text-xl font-bold text-white">Start Your Journey</h3>
                      <Heart className="w-5 h-5 text-teal-400" />
                    </div>
                  </div>

                  {/* New Form Layout */}
                  <div className="space-y-5">
                    {/* Row 1: Looking For & Religion */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Looking For */}
                      <div>
                        <label htmlFor="gender-select" className="block text-sm font-medium text-gray-300 mb-2">I&apos;m looking for</label>
                        <div className="relative">
                          <select
                            id="gender-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-sm"
                            title="Select gender preference"
                            aria-label="Select gender preference"
                          >
                            <option value="" className="text-gray-900">Woman</option>
                            <option value="man" className="text-gray-900">Man</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Religion */}
                      <div>
                        <label htmlFor="religion-select" className="block text-sm font-medium text-gray-300 mb-2">Religion</label>
                        <div className="relative">
                          <select
                            id="religion-select"
                            value={religion}
                            onChange={(e) => setReligion(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-sm"
                            title="Select religion"
                            aria-label="Select religion"
                          >
                            <option value="" className="text-gray-900">Islam</option>
                            <option value="christianity" className="text-gray-900">Christianity</option>
                            <option value="hinduism" className="text-gray-900">Hinduism</option>
                            <option value="sikhism" className="text-gray-900">Sikhism</option>
                            <option value="other" className="text-gray-900">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Age Range Slider */}
                    <div className="py-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-400" />
                        Age Range
                      </label>
                      <RangeSlider
                        label="Age Range"
                        min={18}
                        max={70}
                        value={ageRange}
                        onChange={setAgeRange}
                        formatValue={(val) => `${val} yrs`}
                        className="text-white"
                        labelClassName="text-gray-300"
                        valueClassName="text-teal-400"
                      />
                    </div>

                    {/* Row 3: Country & City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Country */}
                      <div>
                        <label htmlFor="country-select" className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <div className="relative">
                          <select
                            id="country-select"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-sm"
                            title="Select country"
                            aria-label="Select country"
                          >
                            <option value="" className="text-gray-900">Pakistan</option>
                            <option value="uk" className="text-gray-900">United Kingdom</option>
                            <option value="usa" className="text-gray-900">USA</option>
                            <option value="canada" className="text-gray-900">Canada</option>
                            <option value="uae" className="text-gray-900">UAE</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label htmlFor="city-select" className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <div className="relative">
                          <select
                            id="city-select"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-sm"
                            title="Select city"
                            aria-label="Select city"
                          >
                            <option value="" className="text-gray-900">Select City</option>
                            {cities.map(c => (
                              <option key={c} value={c.toLowerCase()} className="text-gray-900">{c}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <span>Let's Begin</span>
                          <Heart className="w-5 h-5 fill-white" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Popular Professions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-6 text-lg">Browse by City</p>
            <div className="flex flex-wrap justify-center gap-3">
              {cities.map((city, index) => (
                <motion.button
                  key={city}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-gray-700 hover:text-teal-700 font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/30 hover:border-white/50"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    backdropFilter: 'blur(16px) saturate(150%)',
                  }}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}