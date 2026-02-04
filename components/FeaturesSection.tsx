'use client'

import { motion } from '@/components/ui/Motion'
import { Brain, Shield, Crown, ArrowRight } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Matching',
      description: 'Our AI algorithm analyzes 200+ compatibility factors to find your perfect match with 99% accuracy.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Every profile is manually verified with government ID, ensuring authentic and genuine connections.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Crown,
      title: 'Premium Service',
      description: 'Dedicated relationship managers, priority matching, and exclusive events for premium members.',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">Rishta.com</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of matrimonial services with our cutting-edge technology and personalized approach
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                scale: 1.02
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover-glow">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Floating Animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  className="relative z-10"
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-100 to-primary-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 delay-100" />
              </div>

              {/* Flip Effect Overlay */}
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                whileHover={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl p-8 flex items-center justify-center text-white text-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <feature.icon className="h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm opacity-90">Hover to see more details about our {feature.title.toLowerCase()} feature</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-primary-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Explore All Features</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}