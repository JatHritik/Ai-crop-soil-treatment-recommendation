import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  MapPin, 
  Calendar,
  Eye,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react'
import { useReports, useDeleteReport } from '../../hooks/useReports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { CenteredLoader } from '../../components/ui/CenteredLoader'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDate, getStatusColor, getStatusText, getSeasonText } from '../../lib/utils'

const ReportsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deletingReportId, setDeletingReportId] = useState(null)
  const limit = 10

  const { data, isLoading, error } = useReports({
    page: currentPage,
    limit,
    status: statusFilter || undefined,
  })

  const deleteReportMutation = useDeleteReport()

  const reports = data?.reports || []
  const pagination = data?.pagination || {}

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      report.district.toLowerCase().includes(searchLower) ||
      report.state.toLowerCase().includes(searchLower) ||
      report.area.toLowerCase().includes(searchLower) ||
      getSeasonText(report.season).toLowerCase().includes(searchLower)
    )
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteClick = (reportId) => {
    console.log('Delete button clicked for report:', reportId)
    setDeleteConfirm(reportId)
  }

  const handleDeleteConfirm = () => {
    console.log('Confirming delete for report:', deleteConfirm)
    if (deleteConfirm) {
      setDeletingReportId(deleteConfirm)
      deleteReportMutation.mutate(deleteConfirm, {
        onSuccess: () => {
          console.log('Delete mutation successful')
          setDeleteConfirm(null)
          setDeletingReportId(null)
        },
        onError: () => {
          setDeletingReportId(null)
        }
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  if (isLoading) {
    return <CenteredLoader message="Loading reports..." />
  }

  if (error) {
    return (
      <div className="container-nature section-padding">
        <EmptyState
          icon={FileText}
          title="Failed to load reports"
          description="There was an error loading your reports. Please try again."
          action={
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-nature section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">My Reports</h1>
            <p className="mt-2 text-ink-600">
              View and manage your soil analysis reports
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link to="/reports/upload">
                <Plus className="w-4 h-4 mr-2" />
                Upload Report
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mt-56 dark:bg-surface-800 dark:border-surface-700">
          <CardContent className="p-6 h-32 flex items-center justify-center">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
              <div className="flex-1 max-w-2xl flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-surface-400 w-4 h-5" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48 flex items-center justify-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input w-full"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ANALYZING">Analyzing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-nature rounded-lg flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {report.district}, {report.state}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{report.area}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-ink-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Uploaded {formatDate(report.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-ink-600">
                        <FileText className="w-4 h-4 mr-2" />
                        <span>Season: {getSeasonText(report.season)}</span>
                      </div>

                      {report.analyzedAt && (
                        <div className="flex items-center text-sm text-ink-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Analyzed {formatDate(report.analyzedAt)}</span>
                        </div>
                      )}

                      <div className="pt-4 space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/reports/${report.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-danger-600 border-danger-200 hover:bg-danger-50 hover:border-danger-300"
                          onClick={() => handleDeleteClick(report.id)}
                          disabled={deletingReportId === report.id}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deletingReportId === report.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No reports found"
            description={
              searchTerm || statusFilter
                ? "No reports match your current filters. Try adjusting your search criteria."
                : "You haven't uploaded any soil reports yet. Get started by uploading your first report."
            }
            action={
              <Button asChild>
                <Link to="/reports/upload">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Report
                </Link>
              </Button>
            }
          />
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-ink-900 mb-4">
                Delete Report
              </h3>
              <p className="text-ink-600 mb-6">
                Are you sure you want to delete this report? This action cannot be undone and will permanently remove the report and its analysis.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleDeleteCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-danger-600 hover:bg-danger-700"
                  disabled={deletingReportId !== null}
                >
                  {deletingReportId ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ReportsList
