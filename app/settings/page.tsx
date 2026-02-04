'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { 
  Settings as SettingsIcon, User, Bell, Shield, Eye, 
  Globe, Heart, MessageCircle, Lock, Key, Smartphone,
  Mail, Phone, MapPin, Calendar, Palette, Moon, Sun,
  Volume2, VolumeX, Camera, Edit3, Trash2, Download,
  Upload, RefreshCw, LogOut, HelpCircle, Info,
  ChevronRight, Check, X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PROFILE_IMAGES, FALLBACK_IMAGES, getImageSrc } from '@/lib/image-constants'
import Header from '@/components/Header'

// Settings categories
const settingsCategories = [
  {
    id: 'account',
    title: 'Account Settings',
    icon: User,
    description: 'Manage your personal information and account details'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    description: 'Control your privacy settings and account security'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Customize your notification preferences'
  },
  {
    id: 'preferences',
    title: 'App Preferences',
    icon: Palette,
    description: 'Personalize your app experience'
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: HelpCircle,
    description: 'Get help and contact support'
  }
]

// Mock user settings
const userSettings = {
  profile: {
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '+92 300 1234567',
    location: 'Lahore, Pakistan',
    profileImage: getImageSrc(PROFILE_IMAGES.fatima, FALLBACK_IMAGES.profiles.fatima)
  },
  privacy: {
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastSeen: false,
    allowMessages: 'verified',
    showPhoneNumber: false,
    showEmail: false,
    incognitoMode: false
  },
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    newMatches: true,
    messages: true,
    profileViews: true,
    likes: true,
    promotions: false,
    newsletter: true
  },
  preferences: {
    theme: 'light',
    language: 'english',
    autoPlayVideos: true,
    soundEffects: true,
    hapticFeedback: true,
    dataUsage: 'wifi'
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('account')
  const [settings, setSettings] = useState(userSettings)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Main Header */}
      <Header />
      
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 mt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <SettingsIcon className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Settings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 sticky top-32"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <nav className="space-y-2">
                {settingsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.title}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/50"
              >
                {/* Account Settings */}
                {activeCategory === 'account' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h3>
                      <p className="text-gray-600">Manage your personal information and account details</p>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <Image
                            src={settings.profile.profileImage}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{settings.profile.name}</h4>
                          <p className="text-gray-600">{settings.profile.email}</p>
                          <button className="text-purple-600 hover:text-purple-700 font-medium mt-1">
                            Change Profile Photo
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={settings.profile.name}
                              onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="p-3 text-gray-600 hover:text-purple-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="email"
                              value={settings.profile.email}
                              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="p-3 text-gray-600 hover:text-purple-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="tel"
                              value={settings.profile.phone}
                              onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="p-3 text-gray-600 hover:text-purple-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={settings.profile.location}
                              onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="p-3 text-gray-600 hover:text-purple-600 transition-colors">
                              <MapPin className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">Account Actions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center space-x-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                          <Download className="w-5 h-5" />
                          <span>Download My Data</span>
                        </button>
                        <button className="flex items-center space-x-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                          <Upload className="w-5 h-5" />
                          <span>Export Profile</span>
                        </button>
                        <button 
                          onClick={() => setShowLogoutConfirm(true)}
                          className="flex items-center space-x-3 p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center space-x-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy & Security */}
                {activeCategory === 'privacy' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Security</h3>
                      <p className="text-gray-600">Control your privacy settings and account security</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Profile Visibility</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Show Online Status</p>
                              <p className="text-sm text-gray-600">Let others see when you're online</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.privacy.showOnlineStatus}
                              onChange={(value) => updateSetting('privacy', 'showOnlineStatus', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Show Last Seen</p>
                              <p className="text-sm text-gray-600">Display when you were last active</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.privacy.showLastSeen}
                              onChange={(value) => updateSetting('privacy', 'showLastSeen', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Incognito Mode</p>
                              <p className="text-sm text-gray-600">Browse profiles without being seen</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.privacy.incognitoMode}
                              onChange={(value) => updateSetting('privacy', 'incognitoMode', value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Show Phone Number</p>
                              <p className="text-sm text-gray-600">Display your phone number on profile</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.privacy.showPhoneNumber}
                              onChange={(value) => updateSetting('privacy', 'showPhoneNumber', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Show Email Address</p>
                              <p className="text-sm text-gray-600">Display your email on profile</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.privacy.showEmail}
                              onChange={(value) => updateSetting('privacy', 'showEmail', value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Security</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button className="flex items-center space-x-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                            <Key className="w-5 h-5" />
                            <span>Change Password</span>
                          </button>
                          <button className="flex items-center space-x-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                            <Smartphone className="w-5 h-5" />
                            <span>Two-Factor Auth</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeCategory === 'notifications' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h3>
                      <p className="text-gray-600">Customize your notification preferences</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Notification Methods</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Bell className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="font-medium text-gray-900">Push Notifications</p>
                                <p className="text-sm text-gray-600">Receive notifications on your device</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.pushNotifications}
                              onChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Mail className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">Email Notifications</p>
                                <p className="text-sm text-gray-600">Receive notifications via email</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.emailNotifications}
                              onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">SMS Notifications</p>
                                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.smsNotifications}
                              onChange={(value) => updateSetting('notifications', 'smsNotifications', value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Notification Types</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Heart className="w-5 h-5 text-pink-600" />
                              <div>
                                <p className="font-medium text-gray-900">New Matches</p>
                                <p className="text-sm text-gray-600">When you get a new match</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.newMatches}
                              onChange={(value) => updateSetting('notifications', 'newMatches', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">Messages</p>
                                <p className="text-sm text-gray-600">When you receive a message</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.messages}
                              onChange={(value) => updateSetting('notifications', 'messages', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Eye className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="font-medium text-gray-900">Profile Views</p>
                                <p className="text-sm text-gray-600">When someone views your profile</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.profileViews}
                              onChange={(value) => updateSetting('notifications', 'profileViews', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Heart className="w-5 h-5 text-red-600" />
                              <div>
                                <p className="font-medium text-gray-900">Likes</p>
                                <p className="text-sm text-gray-600">When someone likes your profile</p>
                              </div>
                            </div>
                            <ToggleSwitch
                              enabled={settings.notifications.likes}
                              onChange={(value) => updateSetting('notifications', 'likes', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* App Preferences */}
                {activeCategory === 'preferences' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">App Preferences</h3>
                      <p className="text-gray-600">Personalize your app experience</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Appearance</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                            <select 
                              value={settings.preferences.theme}
                              onChange={(e) => updateSetting('preferences', 'theme', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <select 
                              value={settings.preferences.language}
                              onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="english">English</option>
                              <option value="urdu">اردو</option>
                              <option value="punjabi">ਪੰਜਾਬੀ</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Media & Sound</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Auto-play Videos</p>
                              <p className="text-sm text-gray-600">Automatically play videos in profiles</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.preferences.autoPlayVideos}
                              onChange={(value) => updateSetting('preferences', 'autoPlayVideos', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Sound Effects</p>
                              <p className="text-sm text-gray-600">Play sounds for app interactions</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.preferences.soundEffects}
                              onChange={(value) => updateSetting('preferences', 'soundEffects', value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">Haptic Feedback</p>
                              <p className="text-sm text-gray-600">Vibrate for app interactions</p>
                            </div>
                            <ToggleSwitch
                              enabled={settings.preferences.hapticFeedback}
                              onChange={(value) => updateSetting('preferences', 'hapticFeedback', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help & Support */}
                {activeCategory === 'help' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h3>
                      <p className="text-gray-600">Get help and contact support</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Support</h4>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <HelpCircle className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-gray-900">FAQ</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <MessageCircle className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-gray-900">Contact Support</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Info className="w-5 h-5 text-purple-600" />
                              <span className="font-medium text-gray-900">Safety Tips</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Legal</h4>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-900">Terms of Service</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-900">Privacy Policy</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-900">Community Guidelines</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">App Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Version: 2.1.0</p>
                        <p>Last Updated: January 2024</p>
                        <p>Build: 2024.01.15</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to sign out of your account?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => router.push('/login')}
                    className="flex-1 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}