'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  CreditCard, Shield, Lock, Check, 
  ArrowLeft, ArrowRight, Star, Crown,
  AlertCircle, Sparkles
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import confetti from 'canvas-confetti'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Button from '@/components/ui/Button'
import { subscriptionPlans } from '@/lib/search-constants'
import { searchApi } from '@/lib/search-api'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const planId = searchParams.get('plan') || 'golden'
  const billingCycle = (searchParams.get('billing') as 'monthly' | 'yearly') || 'monthly'
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  const selectedPlan = subscriptionPlans.find(plan => plan.id === planId)
  const totalSteps = 3

  if (!selectedPlan) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">The selected plan could not be found.</p>
          <Button onClick={() => router.push('/dashboard/subscriptions')}>
            Back to Plans
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const price = billingCycle === 'monthly' ? selectedPlan.price.monthly : selectedPlan.price.yearly
  const savings = billingCycle === 'yearly' ? (selectedPlan.price.monthly * 12) - selectedPlan.price.yearly : 0

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPaymentData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
        }
      }))
    } else {
      setPaymentData(prev => ({ ...prev, [field]: value }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return paymentData.cardNumber.length >= 15 && 
               paymentData.expiryDate.length === 5 && 
               paymentData.cvv.length >= 3 && 
               paymentData.cardholderName.length > 0
      case 2:
        return paymentData.email.includes('@') && 
               paymentData.billingAddress.street.length > 0 && 
               paymentData.billingAddress.city.length > 0
      default:
        return true
    }
  }

  const processPayment = async () => {
    setIsProcessing(true)
    try {
      const result = await searchApi.processSubscription(planId, billingCycle, paymentData)
      
      if (result.success) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        
        toast.success('Payment successful! Welcome to premium!')
        setCurrentStep(3)
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step <= currentStep 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-primary-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure checkout for your {selectedPlan.name}</p>
        </div>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Payment Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-primary-600" />
                    Payment Information
                  </h2>

                  <div className="space-y-6">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          maxLength={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* CVV */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          maxLength={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={paymentData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!validateStep(1)}
                      variant="primary"
                      icon={ArrowRight}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Billing Address */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Billing Information
                  </h2>

                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={paymentData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="123 Main Street"
                        value={paymentData.billingAddress.street}
                        onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="New York"
                          value={paymentData.billingAddress.city}
                          onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="NY"
                          value={paymentData.billingAddress.state}
                          onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* ZIP Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="10001"
                          value={paymentData.billingAddress.zipCode}
                          onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          value={paymentData.billingAddress.country}
                          onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="PK">Pakistan</option>
                          <option value="IN">India</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="secondary"
                      icon={ArrowLeft}
                    >
                      Back
                    </Button>
                    
                    <Button
                      onClick={processPayment}
                      disabled={!validateStep(2)}
                      isLoading={isProcessing}
                      variant="primary"
                    >
                      Complete Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="h-10 w-10 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Payment Successful! 🎉
                  </h2>
                  
                  <p className="text-gray-600 mb-8">
                    Welcome to {selectedPlan.name}! Your premium features are now active.
                  </p>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-5 w-5 text-primary-600" />
                        <span className="text-gray-700">Complete your profile to get better matches</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-primary-600" />
                        <span className="text-gray-700">Browse unlimited profiles with advanced filters</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Crown className="h-5 w-5 text-primary-600" />
                        <span className="text-gray-700">Enjoy priority listing in search results</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      variant="primary"
                    >
                      Go to Dashboard
                    </Button>
                    
                    <Button
                      onClick={() => router.push('/dashboard/search')}
                      variant="secondary"
                    >
                      Start Browsing
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              {/* Plan Details */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">{selectedPlan.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedPlan.name}</div>
                  <div className="text-sm text-gray-600">
                    {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedPlan.name} ({billingCycle})
                  </span>
                  <span className="font-semibold">${price}</span>
                </div>
                
                {billingCycle === 'yearly' && savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Yearly Savings</span>
                    <span>-${savings}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${price}</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>SSL Encrypted Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Cancel Anytime</span>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Included Features</h4>
                <div className="space-y-2">
                  {selectedPlan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {selectedPlan.features.length > 4 && (
                    <div className="text-sm text-gray-500">
                      +{selectedPlan.features.length - 4} more features
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}