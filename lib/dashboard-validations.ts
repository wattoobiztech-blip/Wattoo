import { z } from 'zod'

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.number().min(30, 'Weight must be at least 30').max(300, 'Weight must be less than 300'),
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  complexion: z.string().min(1, 'Complexion is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  profileCreatedFor: z.string().min(1, 'Profile created for is required'),
})

// Step 2: Religious & Background Schema
export const religiousBackgroundSchema = z.object({
  religion: z.string().min(1, 'Religion is required'),
  religiousSubcategory: z.string().optional(),
  caste: z.string().min(1, 'Caste/Community is required'),
  motherTongue: z.string().min(1, 'Mother tongue is required'),
  ethnicity: z.string().optional(),
  familyValues: z.array(z.string()).min(1, 'Select at least one family value'),
  religiousPractice: z.number().min(1).max(5),
})

// Step 3: Professional & Location Schema
export const professionalLocationSchemaBase = z.object({
  jobBusiness: z.enum(['job', 'business']),
  // Job fields
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  annualIncome: z.number().optional(),
  companyAddress: z.string().optional(),
  countryOfWork: z.string().optional(),
  // Business fields
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessAddress: z.string().optional(),
  annualTurnover: z.number().optional(),
  natureOfBusiness: z.string().optional(),
  numberOfEmployees: z.number().optional(),
})

export const professionalLocationSchema = professionalLocationSchemaBase.refine((data) => {
  if (data.jobBusiness === 'job') {
    return data.jobTitle && data.companyName && data.industry && data.annualIncome
  } else {
    return data.businessName && data.businessType && data.annualTurnover
  }
}, {
  message: 'Please fill all required fields for your profession',
})

// Step 4: Lifestyle & Preferences Schema
export const lifestylePreferencesSchemaBase = z.object({
  // About You
  education: z.string().min(1, 'Education is required'),
  occupationDetails: z.string().max(500, 'Occupation details must be less than 500 characters'),
  dietaryHabits: z.string().min(1, 'Dietary habits are required'),
  hobbiesInterests: z.array(z.string()).min(1, 'Select at least one hobby or interest'),
  aboutYourself: z.string().min(50, 'About yourself must be at least 50 characters').max(500, 'About yourself must be less than 500 characters'),
  lifeGoals: z.string().max(500, 'Life goals must be less than 500 characters'),

  // Partner Preferences
  preferredAgeMin: z.number().min(18, 'Minimum age must be at least 18').max(80, 'Maximum age must be less than 80'),
  preferredAgeMax: z.number().min(18, 'Minimum age must be at least 18').max(80, 'Maximum age must be less than 80'),
  preferredHeightMin: z.string().optional(),
  preferredHeightMax: z.string().optional(),
  preferredReligion: z.array(z.string()).optional(),
  preferredCaste: z.array(z.string()).optional(),
  preferredEducation: z.array(z.string()).optional(),
  preferredLocation: z.array(z.string()).optional(),
  preferredIncomeMin: z.number().optional(),
  preferredIncomeMax: z.number().optional(),
  otherPreferences: z.string().max(500, 'Other preferences must be less than 500 characters').optional(),
})

export const lifestylePreferencesSchema = lifestylePreferencesSchemaBase.refine((data) => data.preferredAgeMin <= data.preferredAgeMax, {
  message: 'Minimum age must be less than or equal to maximum age',
  path: ['preferredAgeMax'],
})

// Step 5: Photos Schema
export const photosSchema = z.object({
  profilePicture: z.any().optional(),
  additionalPhotos: z.array(z.any()).max(5, 'Maximum 5 additional photos allowed').optional(),
})

// Complete Profile Schema
export const completeProfileSchema = personalInfoSchema
  .merge(religiousBackgroundSchema)
  .merge(professionalLocationSchemaBase)
  .merge(lifestylePreferencesSchemaBase)
  .merge(photosSchema)

// Type exports
export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type ReligiousBackgroundData = z.infer<typeof religiousBackgroundSchema>
export type ProfessionalLocationData = z.infer<typeof professionalLocationSchema>
export type LifestylePreferencesData = z.infer<typeof lifestylePreferencesSchema>
export type PhotosData = z.infer<typeof photosSchema>
export type CompleteProfileData = z.infer<typeof completeProfileSchema>