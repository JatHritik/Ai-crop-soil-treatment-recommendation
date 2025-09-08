import { useQuery, useMutation, useQueryClient } from 'react-query'
import { adminAPI } from '../lib/api'
import toast from 'react-hot-toast'

// Admin queries
export const useAdminDashboard = () => {
  return useQuery(
    ['admin', 'dashboard'],
    () => adminAPI.getDashboard().then(res => res.data),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )
}

export const useUsers = (params = {}) => {
  return useQuery(
    ['admin', 'users', params],
    () => adminAPI.getUsers(params).then(res => res.data),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  )
}

// Admin mutations
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, role }) => adminAPI.updateUserRole(id, role).then(res => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['admin', 'users'])
        queryClient.invalidateQueries(['admin', 'dashboard'])
        toast.success(data.message || 'User role updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to update user role')
      },
    }
  )
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id) => adminAPI.deleteUser(id).then(res => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['admin', 'users'])
        queryClient.invalidateQueries(['admin', 'dashboard'])
        toast.success(data.message || 'User deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to delete user')
      },
    }
  )
}

