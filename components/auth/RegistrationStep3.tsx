'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from '@/components/ui/Motion'
import { Upload, X, ArrowLeft, Check, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

import { registrationStep3Schema, type RegistrationStep3Data } from '@/lib/validations'
import Button from '@/components/ui/Button'

interface RegistrationStep3Props {
  onSubmit: (data: RegistrationStep3Data) => void
  onPrevious: () => void
  isLoading: boolean
  defaultValues?: Partial<RegistrationStep3Data>
}

export default function RegistrationStep3({ onSubmit, onPrevious, isLoading, defaultValues }: RegistrationStep3Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegistrationStep3Data>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues,
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setValue('profilePicture', file)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setValue('profilePicture', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Picture</h2>
        <p className="text-gray-400">Add a photo to complete your profile</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Area */}
        <div className="space-y-4">
          {!selectedImage ? (
            <motion.div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-gray-600 hover:border-gray-500 bg-white/5'
              }`}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              </motion.div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                Drop your photo here, or click to browse
              </h3>
              <p className="text-gray-400 text-sm">
                Supports JPG, PNG up to 5MB
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-primary-500/30">
                <Image
                  src={selectedImage}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-green-400 font-medium flex items-center justify-center">
                  <Check className="h-4 w-4 mr-2" />
                  Photo uploaded successfully
                </p>
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-primary-400 hover:text-primary-300 text-sm mt-2 transition-colors duration-200"
                >
                  Change photo
                </button>
              </div>
            </motion.div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Photo Guidelines
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use a clear, recent photo of yourself</li>
              <li>• Face should be clearly visible</li>
              <li>• Avoid group photos or photos with sunglasses</li>
              <li>• Professional or casual photos work best</li>
            </ul>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            icon={ArrowLeft}
            onClick={onPrevious}
            className="flex-1"
            disabled={isLoading}
          >
            Previous
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="flex-1"
          >
            Complete Registration
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => onSubmit({})}
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            disabled={isLoading}
          >
            Skip for now (you can add a photo later)
          </button>
        </div>
      </form>
    </motion.div>
  )
}