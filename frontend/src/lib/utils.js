import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

// Format date
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

// Format date with time
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get relative time
export function getRelativeTime(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(date)
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get status color
export function getStatusColor(status) {
  const colors = {
    PENDING: 'status-pending',
    ANALYZING: 'status-analyzing',
    COMPLETED: 'status-completed',
    FAILED: 'status-failed',
  }
  return colors[status] || 'status-pending'
}

// Get status text
export function getStatusText(status) {
  const texts = {
    PENDING: 'Pending',
    ANALYZING: 'Analyzing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
  }
  return texts[status] || 'Unknown'
}

// Get role text
export function getRoleText(role) {
  const texts = {
    ADMIN: 'Administrator',
    USER: 'User',
  }
  return texts[role] || 'Unknown'
}

// Get season text
export function getSeasonText(season) {
  const texts = {
    KHARIF: 'Kharif',
    RABI: 'Rabi',
    ZAID: 'Zaid',
  }
  return texts[season] || 'Unknown'
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Truncate text
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Get initials
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substr(0, 2)
}

// Sleep function for testing
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Safe render function to prevent React object rendering errors
export function safeRender(data, fallback = 'N/A') {
  if (data === null || data === undefined) {
    return fallback
  }
  
  if (typeof data === 'string' || typeof data === 'number') {
    return data
  }
  
  if (typeof data === 'boolean') {
    return data ? 'Yes' : 'No'
  }
  
  if (Array.isArray(data)) {
    return data.join(', ')
  }
  
  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2)
  }
  
  return String(data)
}

