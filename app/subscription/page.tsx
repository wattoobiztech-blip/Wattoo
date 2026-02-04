'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  Crown, Check, X, Star, Zap, Heart, Eye, MessageCircle,
  Shield, Sparkles, Gift, Calendar, CreditCard, ArrowRight,
  Users, Infinity, Award, Lock, Unlock, ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

// Subscription plans data
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    duration: 'Forever',
    color: 'from-gray-400 to-gray-600',
    popular: false,
    features: [
      { name: 'Create Profile', included: true },
      { name: 'Browse Profiles', included: true, limit: '10 per day' },
      { name: 'Send Likes', included: true, limit: '5 per day' },
      { name: 'Basic Search', included: true },
      { name: 'View Profile Photos', included: false },
      { name: 'Send Messages', included: false },
      { name: 'See Who Liked You', included: false },
      { name: 'Advanced Filters', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Profile Boost', included: false }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2999,
    originalPrice: 4999,
    duration: '3 Months',
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'Unlimited Profile Views', included: true },
      { name: 'Unlimited Likes', included: true },
      { name: 'View All Profile Photos', included: true },
      { name: 'Send Messages', included: true, limit: '50 per day' },
      { name: 'See Who Liked You', included: true },
      { name: 'Advanced Search Filters', included: true },
      { name: 'Read Receipts', included: true },
      { name: 'Profile Verification Badge', included: true },
      { name: 'Priority Customer Support', included: true }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 4999,
    originalPrice: 7999,
    duration: '6 Months',
    color: 'from-yellow-400 to-orange-500',
    popular: false,
    features: [
      { name: 'Everything in Premium', included: true },
      { name: 'Unlimited Messages', included: true },
      { name: 'Profile Boost (2x visibility)', included: true },
      { name: 'Super Likes', included: true, limit: '5 per day' },
      { name: 'Incognito Mode', included: true },
      { name: 'Advanced Match Algorithm', included: true },
      { name: 'Video Call Feature', included: true },
      { name: 'Relationship Counseling', included: true },
      { name: 'VIP Customer Support', included: true },
      { name: 'Success Story Feature', included: true }
    ]
  }
]

const currentSubscription = {
  plan: 'premium',
  expiryDate: '2024-12-31',
  daysLeft: 45,
  autoRenew: true
}

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, popular: true },
  { id: 'jazzcash', name: 'JazzCash', icon: '📱', popular: true },
  { id: 'easypaisa', name: 'EasyPaisa', icon: '💳', popular: true },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', popular: false }
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [showPayment, setShowPayment] = useState(false)
  const [billingCycle, setBillingCycle] = useState('monthly')

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    setShowPayment(true)
  }

  const handlePayment = () => {
    // Handle payment processing
    console.log('Processing payment for:', selectedPlan, selectedPayment)
    // Redirect to payment gateway or show success
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Main Header */}
      <Header />
      
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 mt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Subscription</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Current Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Premium Member</h2>
              </div>
              <p className="text-purple-100 text-lg">
                Your subscription expires in <span className="font-bold">{currentSubscription.daysLeft} days</span>
              </p>
              <p className="text-purple-200 text-sm">
                Expires on {currentSubscription.expiryDate}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-bold">₹2,999</div>
                <div className="text-purple-200 text-sm">per 3 months</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentSubscription.autoRenew ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm">
                  Auto-renewal {currentSubscription.autoRenew ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                Manage
              </button>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all font-semibold">
                Upgrade
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Find the perfect plan to discover your soulmate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-purple-300 scale-105 shadow-purple-200/50' 
                    : 'border-white/50 hover:border-purple-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    {plan.id === 'basic' && <Users className="w-8 h-8 text-white" />}
                    {plan.id === 'premium' && <Crown className="w-8 h-8 text-white" />}
                    {plan.id === 'gold' && <Award className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.price === 0 ? (
                      <div className="text-3xl font-bold text-gray-900">Free</div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</div>
                        {plan.originalPrice && (
                          <div className="text-lg text-gray-500 line-through">₹{plan.originalPrice.toLocaleString()}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.duration}</p>
                  {plan.originalPrice && (
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        feature.included ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                        {feature.limit && (
                          <span className="text-xs text-gray-500 block">{feature.limit}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    plan.id === 'basic'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105`
                  }`}
                >
                  {plan.id === 'basic' ? 'Current Plan' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/50 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Upgrade to Premium?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Infinity className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Unlimited Access</h4>
              <p className="text-sm text-gray-600">Browse unlimited profiles and send unlimited likes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">See Who Likes You</h4>
              <p className="text-sm text-gray-600">Know who's interested in you before you like them back</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Direct Messaging</h4>
              <p className="text-sm text-gray-600">Start conversations with your matches instantly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Profile Boost</h4>
              <p className="text-sm text-gray-600">Get 2x more profile views with our boost feature</p>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 border border-white/50"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Stories</h3>
            <p className="text-gray-600">Join thousands of couples who found love with Premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"Found my soulmate within 2 months of upgrading to Premium!"</p>
              <p className="font-semibold text-gray-900">- Sarah & Ahmed</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"The advanced filters helped me find exactly what I was looking for."</p>
              <p className="font-semibold text-gray-900">- Fatima & Hassan</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"Premium features made the whole process so much easier and faster."</p>
              <p className="font-semibold text-gray-900">- Zara & Usman</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h3>
              
              {/* Selected Plan Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan
                    </h4>
                    <p className="text-sm text-gray-600">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      ₹{subscriptionPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === method.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {typeof method.icon === 'string' ? (
                          <span className="text-2xl">{method.icon}</span>
                        ) : (
                          <method.icon className="w-6 h-6 text-gray-600" />
                        )}
                        <span className="font-medium text-gray-900">{method.name}</span>
                        {method.popular && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Popular</span>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPayment === method.id
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Pay Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}