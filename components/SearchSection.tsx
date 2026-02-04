'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { Search, MapPin, Calendar, Users, Heart, Sparkles, Filter, ChevronDown, X, Plus } from 'lucide-react'

export default function SearchSection() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedAge, setSelectedAge] = useState('')
  const [selectedReligion, setSelectedReligion] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const quickFilters = [
    { id: 'verified', label: 'Verified Profiles', icon: '✓' },
    { id: 'premium', label: 'Premium Members', icon: '👑' },
    { id: 'recent', label: 'Recently Active', icon: '🟢' },
    { id: 'photos', label: 'With Photos', icon: '📸' },
  ]

  const professions = ['Doctor', 'Engineer', 'Teacher', 'Business Owner', 'IT Professional', 'Lawyer', 'Architect', 'Designer']

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ultra Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/40">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
        
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
          {/* Ultra Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6 border border-purple-200/50"
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-semibold text-sm">AI-Powered Matching</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced AI algorithms analyze compatibility across 50+ dimensions to find your ideal life partner
            </p>
          </motion.div>

          {/* Ultra Modern Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Main Search Card */}
            <div className="relative">
              {/* Glassmorphism Container */}
              <div 
                className="relative backdrop-blur-2xl bg-white/70 border border-white/60 rounded-3xl p-8 md:p-12 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)'
                }}
              >
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-60 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-40 animate-pulse"></div>

                {/* Search Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-10"
                >
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <Heart className="w-6 h-6 text-pink-500" />
                    <h3 className="text-2xl font-bold text-gray-800">Start Your Journey</h3>
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <p className="text-gray-600">Tell us your preferences and let AI find your perfect match</p>
                </motion.div>

                {/* Primary Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Age Range */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>Age Range</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={selectedAge}
                        onChange={(e) => setSelectedAge(e.target.value)}
                        className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer group-hover:border-purple-300"
                      >
                        <option value="">Select Age Range</option>
                        <option value="18-25">18-25 years</option>
                        <option value="26-30">26-30 years</option>
                        <option value="31-35">31-35 years</option>
                        <option value="36-40">36-40 years</option>
                        <option value="40+">40+ years</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none group-hover:text-purple-500 transition-colors" />
                    </div>
                  </motion.div>

                  {/* Cast */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>Cast</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedReligion}
                        onChange={(e) => setSelectedReligion(e.target.value)}
                        placeholder="Search or select cast..."
                        list="cast-options"
                        className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl group-hover:border-purple-300"
                      />
                      <datalist id="cast-options">
                        <option value="Rajput" />
                        <option value="Jatt" />
                        <option value="Arain" />
                        <option value="Gujjar" />
                        <option value="Sheikh" />
                        <option value="Malik" />
                        <option value="Chaudhry" />
                        <option value="Butt" />
                        <option value="Khan" />
                        <option value="Syed" />
                        <option value="Mughal" />
                        <option value="Pathan" />
                        <option value="Baloch" />
                        <option value="Sindhi" />
                        <option value="Other" />
                      </datalist>
                      <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none group-hover:text-purple-500 transition-colors" />
                    </div>
                  </motion.div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>Location</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        placeholder="Search or select city..."
                        list="location-options"
                        className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl group-hover:border-purple-300"
                      />
                      <datalist id="location-options">
                        <option value="Karachi" />
                        <option value="Lahore" />
                        <option value="Islamabad" />
                        <option value="Rawalpindi" />
                        <option value="Faisalabad" />
                        <option value="Multan" />
                        <option value="Peshawar" />
                        <option value="Quetta" />
                        <option value="Sialkot" />
                        <option value="Gujranwala" />
                        <option value="Hyderabad" />
                        <option value="Sukkur" />
                        <option value="Bahawalpur" />
                        <option value="Sargodha" />
                      </datalist>
                      <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none group-hover:text-purple-500 transition-colors" />
                    </div>
                  </motion.div>
                </div>

                {/* Quick Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-purple-500" />
                    <span>Quick Filters</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {quickFilters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        onClick={() => toggleFilter(filter.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                          activeFilters.includes(filter.id)
                            ? 'bg-white/30 backdrop-blur-xl border-white/50 text-purple-800 shadow-lg'
                            : 'bg-white/15 backdrop-blur-xl border-white/25 text-gray-700 hover:border-white/40 hover:bg-white/25'
                        }`}
                        style={{
                          backdropFilter: 'blur(16px) saturate(150%)',
                          background: activeFilters.includes(filter.id) 
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)'
                        }}
                      >
                        <span className="text-sm">{filter.icon}</span>
                        <span className="text-sm font-medium">{filter.label}</span>
                        {activeFilters.includes(filter.id) && (
                          <X className="w-3 h-3" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Search Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      y: -3,
                      boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 shadow-xl overflow-hidden min-w-[200px] justify-center hover:from-purple-500 hover:via-pink-500 hover:to-purple-600"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Search className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Find Matches</span>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    
                    {/* Primary color shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white/15 backdrop-blur-xl border border-white/25 text-purple-700 hover:text-purple-800 font-semibold transition-all duration-300 px-6 py-3 rounded-xl hover:bg-white/25 hover:border-white/40"
                    style={{
                      backdropFilter: 'blur(16px) saturate(150%)',
                    }}
                  >
                    <Filter className="w-5 h-5" />
                    <span>Advanced Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
                  </motion.button>
                </motion.div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="mt-8 pt-8 border-t border-gray-200/60"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                        <Plus className="w-5 h-5 text-purple-500" />
                        <span>Advanced Search Options</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Education */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Education Level</label>
                          <select className="w-full px-4 py-3 bg-white/90 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700">
                            <option value="">Any Education</option>
                            <option value="graduate">Graduate</option>
                            <option value="postgraduate">Post Graduate</option>
                            <option value="doctorate">Doctorate</option>
                          </select>
                        </div>

                        {/* Income */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Annual Income</label>
                          <select className="w-full px-4 py-3 bg-white/90 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700">
                            <option value="">Any Income</option>
                            <option value="3-5">₹3-5 Lakhs</option>
                            <option value="5-10">₹5-10 Lakhs</option>
                            <option value="10-20">₹10-20 Lakhs</option>
                            <option value="20+">₹20+ Lakhs</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Popular Professions */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600 mb-6 text-lg">Popular by profession</p>
              <div className="flex flex-wrap justify-center gap-3">
                {professions.map((profession, index) => (
                  <motion.button
                    key={profession}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-gray-700 hover:text-purple-700 font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/30 hover:border-white/50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      backdropFilter: 'blur(16px) saturate(150%)',
                    }}
                  >
                    {profession}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}