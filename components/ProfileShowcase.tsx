'use client'

import { motion } from '@/components/ui/Motion'
import { MapPin, Briefcase, Heart, Star, Eye, Verified, Crown, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'

export default function ProfileShowcase() {
  const profiles = [
    {
      id: 1,
      name: 'Ayesha Khan',
      age: 26,
      profession: 'Software Engineer',
      cast: 'Khan',
      location: 'Karachi, Pakistan',
      image: getImageSrc(PROFILE_IMAGES.ayesha, FALLBACK_IMAGES.profiles.ayesha),
      rating: 4.9,
      verified: true,
      premium: true,
      online: true,
      likes: 245,
      education: 'Masters in CS',
      height: '5\'4"'
    },
    {
      id: 2,
      name: 'Ahmed Ali',
      age: 29,
      profession: 'Doctor',
      cast: 'Syed',
      location: 'Lahore, Pakistan',
      image: getImageSrc(PROFILE_IMAGES.ahmed, FALLBACK_IMAGES.profiles.ahmed),
      rating: 4.8,
      verified: true,
      premium: false,
      online: false,
      likes: 189,
      education: 'MBBS',
      height: '5\'10"'
    },
    {
      id: 3,
      name: 'Fatima Sheikh',
      age: 24,
      profession: 'Teacher',
      cast: 'Sheikh',
      location: 'Islamabad, Pakistan',
      image: getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima),
      rating: 4.9,
      verified: true,
      premium: true,
      online: true,
      likes: 312,
      education: 'B.Ed',
      height: '5\'3"'
    },
    {
      id: 4,
      name: 'Hassan Malik',
      age: 31,
      profession: 'Business Owner',
      cast: 'Malik',
      location: 'Rawalpindi, Pakistan',
      image: getImageSrc(PROFILE_IMAGES.hassan, FALLBACK_IMAGES.profiles.hassan),
      rating: 4.7,
      verified: true,
      premium: false,
      online: true,
      likes: 156,
      education: 'MBA',
      height: '6\'0"'
    },
    {
      id: 5,
      name: 'Zara Butt',
      age: 27,
      profession: 'Marketing Manager',
      cast: 'Butt',
      location: 'Faisalabad, Pakistan',
      image: getImageSrc(PROFILE_IMAGES.zara, FALLBACK_IMAGES.profiles.zara),
      rating: 4.8,
      verified: true,
      premium: true,
      online: false,
      likes: 278,
      education: 'Masters in Marketing',
      height: '5\'5"'
    },
    {
      id: 6,
      name: 'Usman Chaudhry',
      age: 28,
      profession: 'Chartered Accountant',
      cast: 'Chaudhry',
      location: 'Multan, Pakistan',
      image: getImageSrc(PROFILE_IMAGES.usman, FALLBACK_IMAGES.profiles.usman),
      rating: 4.9,
      verified: true,
      premium: false,
      online: true,
      likes: 203,
      education: 'ACCA',
      height: '5\'8"'
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6 border border-purple-200/50"
          >
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-semibold text-sm">Featured Profiles</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Meet Your
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
              Perfect Match
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover verified profiles of amazing people looking for their life partner
          </p>
        </motion.div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              whileHover={{ 
                y: -15,
                scale: 1.03,
                rotateY: 5,
              }}
              className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {/* Profile Image Section */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Status Indicators */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex flex-col space-y-2">
                    {/* Online Status */}
                    {profile.online && (
                      <div className="flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Online</span>
                      </div>
                    )}
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{profile.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {/* Premium Badge */}
                    {profile.premium && (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <Crown className="h-3 w-3" />
                        <span>Premium</span>
                      </div>
                    )}
                    
                    {/* Verified Badge */}
                    {profile.verified && (
                      <div className="flex items-center space-x-1 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <Verified className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Likes Counter */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/20 backdrop-blur-xl text-white px-3 py-2 rounded-full text-sm font-semibold">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span>{profile.likes}</span>
                </div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 right-4 flex space-x-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                  >
                    <Eye className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-pink-500/80 backdrop-blur-xl border border-pink-400/50 text-white rounded-full flex items-center justify-center hover:bg-pink-500 transition-all duration-300"
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Profile Info Section */}
              <div className="p-6 space-y-4">
                {/* Name and Age */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    {profile.name}
                  </h3>
                  <span className="text-lg font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {profile.age}
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-600 font-medium">{profile.profession}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-pink-500" />
                    <span className="text-gray-600 font-medium">{profile.location.split(',')[0]}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {profile.cast}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {profile.education}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    {profile.height}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center hover:bg-white hover:text-purple-600 transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 delay-100" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of verified profiles and discover your perfect life partner today
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-bold text-lg px-10 py-5 rounded-2xl hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
          >
            <span>Explore All Profiles</span>
            <Heart className="h-6 w-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}