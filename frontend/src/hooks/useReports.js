import { useQuery, useMutation, useQueryClient } from 'react-query'
import { reportsAPI } from '../lib/api'
import toast from 'react-hot-toast'

// Reports queries
export const useReports = (params = {}) => {
  return useQuery(
    ['reports', params],
    () => reportsAPI.getMyReports(params).then(res => res.data),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  )
}

export const useReport = (id) => {
  return useQuery(
    ['report', id],
    () => {
      console.log('Fetching report with ID:', id)
      return reportsAPI.getReport(id).then(res => {
        console.log('Report API response:', res.data)
        return res.data.report
      }).catch(err => {
        console.error('Report API error:', err)
        throw err
      })
    },
    {
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )
}

export const useReportStatus = (id) => {
  return useQuery(
    ['report', id, 'status'],
    () => reportsAPI.getReportStatus(id).then(res => res.data),
    {
      enabled: !!id,
      refetchInterval: (data) => {
        // Stop polling if report is completed or failed
        if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
          return false
        }
        return 5000 // Poll every 5 seconds
      },
      staleTime: 0, // Always refetch
    }
  )
}

// Reports mutations
export const useUploadReport = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (formData) => reportsAPI.upload(formData).then(res => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['reports'])
        queryClient.invalidateQueries(['user', 'dashboard'])
        toast.success(data.message || 'Report uploaded successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to upload report')
      },
    }
  )
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id) => {
      console.log('Deleting report with ID:', id)
      console.log('API base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000')
      console.log('Full delete URL:', `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}`)
      return reportsAPI.deleteReport(id).then(res => {
        console.log('Delete response:', res.data)
        return res.data
      }).catch(err => {
        console.error('Delete API call failed:', err)
        throw err
      })
    },
    {
      onSuccess: (data) => {
        console.log('Delete success:', data)
        queryClient.invalidateQueries(['reports'])
        queryClient.invalidateQueries(['user', 'dashboard'])
        toast.success(data.message || 'Report deleted successfully!')
      },
      onError: (error) => {
        console.error('Delete error:', error)
        console.error('Error response:', error.response)
        console.error('Error status:', error.response?.status)
        console.error('Error data:', error.response?.data)
        toast.error(error.response?.data?.error || 'Failed to delete report')
      },
    }
  )
}

// Admin hooks
export const useAllReports = (params = {}) => {
  return useQuery(
    ['admin', 'reports', params],
    () => reportsAPI.getAllReports(params).then(res => res.data),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  )
}

