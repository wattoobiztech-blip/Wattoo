import { z } from 'zod'

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

// Registration Step 1 Schema
export const registrationStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Registration Step 2 Schema
export const registrationStep2Schema = z.object({
  dateOfBirth: z.string().min(1, 'Please select your date of birth'),
  religion: z.string().min(1, 'Please select your religion'),
  caste: z.string().min(1, 'Please select your caste'),
  country: z.string().min(1, 'Please select your country'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

// Registration Step 3 Schema
export const registrationStep3Schema = z.object({
  profilePicture: z.any().optional(),
})

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegistrationStep1Data = z.infer<typeof registrationStep1Schema>
export type RegistrationStep2Data = z.infer<typeof registrationStep2Schema>
export type RegistrationStep3Data = z.infer<typeof registrationStep3Schema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>