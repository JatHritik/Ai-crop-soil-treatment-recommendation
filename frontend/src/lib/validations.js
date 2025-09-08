import { z } from 'zod'

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Report validations
export const uploadReportSchema = z.object({
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  area: z.string().min(1, 'Area is required'),
  season: z.enum(['KHARIF', 'RABI', 'ZAID'], {
    errorMap: () => ({ message: 'Please select a valid season' })
  }),
  reportFile: z.any().refine((file) => file && file.size > 0, 'Report file is required'),
})

// Profile validations
export const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
})

// Admin validations
export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
})

// Search and filter validations
export const searchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['PENDING', 'ANALYZING', 'COMPLETED', 'FAILED']).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
})

// File validation
export const fileValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.txt'],
  
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No file selected' }
    }

    if (file.size > this.maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' }
    }

    if (!this.allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported' }
    }

    return { valid: true, error: null }
  }
}

