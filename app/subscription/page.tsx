'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import {
  Crown, Check, X, Star, Zap, Heart, Eye, MessageCircle,
  Shield, Sparkles, Gift, Calendar, CreditCard, ArrowRight,
  Users, Infinity as InfinityIcon, Award, Lock, Unlock, ChevronRight
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
    icon: Users,
    features: [
      { name: 'Create Profile', included: true },
      { name: 'Browse Profiles', included: true, limit: '10 per day' },
      { name: 'Send Likes', included: true, limit: '5 per day' },
      { name: 'Basic Search', included: true },
      { name: 'View Profile Photos', included: false },
      { name: 'Send Messages', included: false },
      { name: 'See Who Liked You', included: false },
      { name: 'Advanced Filters', included: false },
      { name: 'Priority Support', included: false }
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
    icon: Crown,
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'Unlimited Profile Views', included: true },
      { name: 'Unlimited Likes', included: true },
      { name: 'View All Profile Photos', included: true },
      { name: 'Send Messages', included: true, limit: '50 per day' },
      { name: 'See Who Liked You', included: true },
      { name: 'Advanced Search Filters', included: true },
      { name: 'Read Receipts', included: true },
      { name: 'Priority Support', included: true }
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
    icon: Award,
    features: [
      { name: 'Everything in Premium', included: true },
      { name: 'Unlimited Messages', included: true },
      { name: 'Profile Boost (2x visibility)', included: true },
      { name: 'Super Likes', included: true, limit: '5 per day' },
      { name: 'Incognito Mode', included: true },
      { name: 'Advanced Match Algorithm', included: true },
      { name: 'Video Call Feature', included: true },
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
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', popular: true },
  { id: 'jazzcash', name: 'JazzCash', icon: '📱', popular: true },
  { id: 'easypaisa', name: 'EasyPaisa', icon: '💳', popular: true },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', popular: false }
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [showPayment, setShowPayment] = useState(false)

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    setShowPayment(true)
  }

  const handlePayment = () => {
    // Basic payment processing simulation
    console.log('Processing payment for:', selectedPlan, selectedPayment)
    // In a real app, this would redirect to a payment gateway or call an API
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <Header />

      {/* Breadcrumbs/Mini-nav */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 mt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Subscription Plans</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Current Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background Icons */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-10">
            <Crown className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Premium Membership</h2>
              </div>
              <p className="text-purple-100 text-lg mb-6 max-w-xl">
                You are currently on the <span className="font-bold">Premium Plan</span>.
                Your membership expires in <span className="font-bold text-yellow-300">{currentSubscription.daysLeft} days</span>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                  <p className="text-purple-200 text-xs uppercase tracking-wider mb-1">Status</p>
                  <p className="font-bold text-sm">Active</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                  <p className="text-purple-200 text-xs uppercase tracking-wider mb-1">Expires On</p>
                  <p className="font-bold text-sm">{currentSubscription.expiryDate}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                  <p className="text-purple-200 text-xs uppercase tracking-wider mb-1">Auto-Renew</p>
                  <p className="font-bold text-sm">{currentSubscription.autoRenew ? 'On' : 'Off'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                  <p className="text-purple-200 text-xs uppercase tracking-wider mb-1">Days Left</p>
                  <p className="font-bold text-sm">{currentSubscription.daysLeft}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">
                Extend Membership
              </button>
              <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-2xl font-medium hover:bg-white/30 transition-all">
                Manage Billing
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Selection */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upgrade your experience and increase your chances of finding the perfect match with our premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl flex flex-col ${plan.popular
                ? 'border-purple-300 scale-105 shadow-xl shadow-purple-200/50'
                : 'border-white/50 hover:border-purple-200'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex flex-col items-center justify-center gap-1 min-h-[80px]">
                  {plan.originalPrice && (
                    <span className="text-gray-400 line-through text-lg">₹{plan.originalPrice.toLocaleString()}</span>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-4xl font-black text-gray-900">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1 text-sm">/{plan.duration}</span>
                  </div>
                  {plan.price > 0 && plan.originalPrice && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mt-2">
                      Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="mt-1 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                      {feature.limit && (
                        <span className="text-[10px] text-purple-500 font-semibold uppercase">{feature.limit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${plan.popular
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {plan.price === 0 ? 'Current Plan' : 'Select ' + plan.name}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table / Why Upgrade Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Go Premium?</h3>
              <p className="text-gray-600 text-lg">
                Premium members are 3x more likely to find a match within the first 30 days. Don&apos;t leave your future to chance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: InfinityIcon, title: 'Unlimited Potential', color: 'from-blue-500 to-indigo-500', desc: 'No limits on profiles, likes, or discovery.' },
                { icon: Zap, title: 'Boost Visibility', color: 'from-yellow-400 to-orange-500', desc: 'Get seen by more relevant potential matches.' },
                { icon: Eye, title: 'See Interested', color: 'from-pink-500 to-rose-500', desc: 'Know exactly who likes your profile instantly.' },
                { icon: MessageCircle, title: 'Direct Access', color: 'from-emerald-500 to-teal-500', desc: 'Start conversations without waiting for matches.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/60 p-6 rounded-3xl border border-white/50 space-y-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Success Stories Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/40 backdrop-blur-md border border-white/50 rounded-[40px] p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Real Connections, Real Stories</h3>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="ml-2 font-bold text-gray-900">4.9/5 Rating</span>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Sarah & Hassan', text: 'Premium filters saved us so much time. We found exactly what we were looking for in just 3 weeks!' },
                { name: 'Fatima & Ali', text: 'The messaging feature allowed us to connect deeply before meeting. Truly worth every rupee.' },
                { name: 'Zoya & Usman', text: 'Profile boost worked like magic. I received 5 matches in the first day of my Gold plan!' }
              ].map((story, i) => (
                <div key={i} className="bg-white/80 p-6 rounded-3xl border border-white/50 shadow-sm relative italic">
                  <p className="text-gray-700 leading-relaxed mb-4">&quot;{story.text}&quot;</p>
                  <p className="not-italic font-bold text-purple-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {story.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPayment(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-all"
                title="Close"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <h3 className="text-3xl font-black text-gray-900 mb-2">Complete Order</h3>
              <p className="text-gray-500 mb-8">Secure 256-bit encrypted transaction</p>

              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[32px] p-6 mb-8 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-xl">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</h4>
                      <p className="text-gray-500 text-sm">Matrimonial Subscription</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-purple-600">₹{subscriptionPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()}</p>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{subscriptionPlans.find(p => p.id === selectedPlan)?.duration}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4 mb-10">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-widest ml-1">Select Payment Method</label>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${selectedPayment === method.id
                        ? 'border-purple-600 bg-purple-50 shadow-md shadow-purple-100'
                        : 'border-gray-100 hover:border-purple-200'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${selectedPayment === method.id ? 'bg-purple-600 shadow-md' : 'bg-gray-50'
                          }`}>
                          {method.icon}
                        </div>
                        <span className={`font-bold transition-all ${selectedPayment === method.id ? 'text-purple-600' : 'text-gray-600'}`}>
                          {method.name}
                        </span>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPayment === method.id ? 'border-purple-600 bg-purple-600' : 'border-gray-200'
                        }`}>
                        {selectedPayment === method.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Lock className="w-5 h-5" />
                  <span>Secure Pay Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-[10px] text-gray-400 font-medium">
                  By clicking Pay Now, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}