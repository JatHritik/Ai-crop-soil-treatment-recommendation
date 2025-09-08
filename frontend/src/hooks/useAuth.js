import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authAPI, userAPI } from '../lib/api'
import { useAuth as useAuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

// Auth mutations
export const useLogin = () => {
  const { login } = useAuthContext()
  
  return useMutation(login, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Welcome back!')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed')
    },
  })
}

export const useRegister = () => {
  const { register } = useAuthContext()
  
  return useMutation(register, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Account created successfully!')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed')
    },
  })
}

export const useLogout = () => {
  const { logout } = useAuthContext()
  const queryClient = useQueryClient()
  
  return useMutation(logout, {
    onSuccess: () => {
      queryClient.clear()
      toast.success('Logged out successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Logout failed')
    },
  })
}

// User data queries
export const useUserProfile = () => {
  const { user } = useAuthContext()
  
  return useQuery(
    ['user', 'profile'],
    () => authAPI.getMe().then(res => res.data.user),
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useDashboard = () => {
  return useQuery(
    ['user', 'dashboard'],
    () => userAPI.getDashboard().then(res => res.data),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { updateUser } = useAuthContext()
  
  return useMutation(
    (profile) => userAPI.updateProfile(profile).then(res => res.data),
    {
      onSuccess: (data) => {
        updateUser(data.user)
        queryClient.invalidateQueries(['user', 'profile'])
        toast.success('Profile updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to update profile')
      },
    }
  )
}

