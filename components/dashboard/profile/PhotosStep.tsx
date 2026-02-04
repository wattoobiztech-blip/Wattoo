'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence } from '@/components/ui/Motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, X, Star, Camera, 
  ArrowLeft, Check, AlertCircle 
} from 'lucide-react'
import Image from 'next/image'

import { photosSchema, type PhotosData } from '@/lib/dashboard-validations'
import Button from '@/components/ui/Button'

interface PhotosStepProps {
  onComplete: (data: PhotosData) => void
  onPrevious: () => void
  defaultValues?: Partial<PhotosData>
  isLoading?: boolean
}

interface PhotoFile {
  file: File
  preview: string
  id: string
}

export default function PhotosStep({ 
  onComplete, 
  onPrevious, 
  defaultValues, 
  isLoading 
}: PhotosStepProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const [profilePictureId, setProfilePictureId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    handleSubmit,
  } = useForm<PhotosData>({
    resolver: zodResolver(photosSchema),
    defaultValues,
  })

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null)

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === 'file-too-large') {
        setUploadError('File size must be less than 5MB')
      } else if (error.code === 'file-invalid-type') {
        setUploadError('Only JPG, PNG, and WEBP files are allowed')
      }
      return
    }

    // Check total photos limit
    if (photos.length + acceptedFiles.length > 6) {
      setUploadError('Maximum 6 photos allowed (1 profile + 5 additional)')
      return
    }

    // Add new photos
    const newPhotos = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2, 11)
    }))

    setPhotos(prev => [...prev, ...newPhotos])

    // Set first photo as profile picture if none selected
    if (!profilePictureId && newPhotos.length > 0) {
      setProfilePictureId(newPhotos[0].id)
    }
  }, [photos.length, profilePictureId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  })

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id))
    
    // If removed photo was profile picture, set first remaining as profile
    if (profilePictureId === id) {
      const remaining = photos.filter(photo => photo.id !== id)
      setProfilePictureId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const setAsProfilePicture = (id: string) => {
    setProfilePictureId(id)
  }

  const onSubmit = () => {
    const profilePicture = photos.find(photo => photo.id === profilePictureId)?.file
    const additionalPhotos = photos
      .filter(photo => photo.id !== profilePictureId)
      .map(photo => photo.file)

    onComplete({
      profilePicture,
      additionalPhotos
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Photos</h2>
        <p className="text-gray-600">Add photos to make your profile more attractive</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Upload Area */}
        <div className="space-y-6">
          {photos.length < 6 && (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop photos here' : 'Upload Photos'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop photos here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, WEBP up to 5MB • Maximum 6 photos
              </p>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{uploadError}</span>
            </div>
          )}

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                      <Image
                        src={photo.preview}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Profile Picture Badge */}
                      {profilePictureId === photo.id && (
                        <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Profile</span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                          {profilePictureId !== photo.id && (
                            <button
                              type="button"
                              onClick={() => setAsProfilePicture(photo.id)}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                              title="Set as profile picture"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                            title="Remove photo"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Photo Guidelines */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Camera className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Photo Guidelines</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Use clear, recent photos of yourself</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Face should be clearly visible</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Avoid group photos or photos with sunglasses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Professional or casual photos work best</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>First photo will be your profile picture</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            icon={ArrowLeft}
            onClick={onPrevious}
            className="px-8"
          >
            Previous
          </Button>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => onComplete({})}
              disabled={isLoading}
              className="px-8"
            >
              Skip Photos
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={photos.length === 0}
              className="px-8"
            >
              Complete Profile
            </Button>
          </div>
        </div>

        {/* Photo Count */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {photos.length}/6 photos uploaded
            {profilePictureId && (
              <span className="ml-2 text-primary-600">
                • Profile picture selected
              </span>
            )}
          </p>
        </div>
      </form>
    </div>
  )
}