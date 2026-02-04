'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/components/ui/Motion'
import { LogOut, Heart, CheckCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)

  useEffect(() => {
    // Auto-logout after component mounts
    const timer = setTimeout(() => {
      handleLogout()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear any stored user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.clear()
    }
    
    setIsLoggingOut(false)
    setLoggedOut(true)
    
    // Redirect to home page after 2 seconds
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  const handleStayLoggedIn = () => {
    router.back()
  }

  if (loggedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Successfully Logged Out</h2>
            <p className="text-gray-600 mb-6">
              Thank you for using our matrimonial service. We hope to see you again soon!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 text-center max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <LogOut className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Logging Out...</h2>
          <p className="text-gray-600">
            Please wait while we securely log you out of your account.
          </p>
          
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
        >
          <LogOut className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sign Out</h2>
        <p className="text-gray-600 mb-8">
          Are you sure you want to sign out of your account? You'll need to log in again to access your profile and matches.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Yes, Sign Me Out
          </button>
          
          <button
            onClick={handleStayLoggedIn}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Stay Logged In</span>
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm">Thank you for using our service</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}