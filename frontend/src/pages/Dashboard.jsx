import React, { memo, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Leaf,
  MapPin,
  Calendar
} from 'lucide-react'
import { useDashboard } from '../hooks/useAuth'
import { useReports } from '../hooks/useReports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { CenteredLoader } from '../components/ui/CenteredLoader'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { formatDate, getStatusColor, getStatusText, getSeasonText } from '../lib/utils'

// Memoized components for better performance
const StatCard = memo(({ stat, index }) => {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-600">{stat.title}</p>
              <p className="text-2xl font-bold text-ink-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

const ReportItem = memo(({ report }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-between p-4 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors duration-200"
  >
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-gradient-nature rounded-lg flex items-center justify-center">
        <Leaf className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-medium text-ink-900">
          {report.district}, {report.state}
        </h4>
        <div className="flex items-center space-x-2 text-sm text-ink-600">
          <MapPin className="w-3 h-3" />
          <span>{report.area}</span>
          <span>•</span>
          <span>{getSeasonText(report.season)}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Badge variant={getStatusColor(report.status)}>
        {getStatusText(report.status)}
      </Badge>
      <div className="text-xs text-ink-500">
        {formatDate(report.createdAt)}
      </div>
    </div>
  </motion.div>
))

const Dashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboard()
  const { data: reportsData, isLoading: reportsLoading } = useReports({ limit: 5 })

  // Memoized callbacks
  const handleRefresh = useCallback(() => {
    window.location.reload()
  }, [])

  // Memoized computed values
  const { stats } = useMemo(() => dashboardData || {}, [dashboardData])

  const statCards = useMemo(() => [
    {
      title: 'Total Reports',
      value: stats?.totalReports || 0,
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Completed',
      value: stats?.completedReports || 0,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'In Progress',
      value: (stats?.pendingReports || 0) + (stats?.analyzingReports || 0),
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      title: 'Failed',
      value: stats?.failedReports || 0,
      icon: AlertCircle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100',
    },
  ], [stats])

  const skeletonCards = useMemo(() => 
    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />), 
    []
  )

  const reportSkeletons = useMemo(() => 
    Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="w-10 h-10 loading-skeleton rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 loading-skeleton rounded" />
          <div className="h-3 w-1/2 loading-skeleton rounded" />
        </div>
      </div>
    )), 
    []
  )

  if (dashboardLoading) {
    return <CenteredLoader message="Loading dashboard..." />
  }

  if (dashboardError) {
    return (
      <div className="container-nature section-padding">
        <EmptyState
          icon={AlertCircle}
          title="Failed to load dashboard"
          description="There was an error loading your dashboard data. Please try again."
          action={
            <Button onClick={handleRefresh}>
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
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Dashboard</h1>
            <p className="mt-2 text-ink-600">
              Welcome back! Here's an overview of your soil analysis reports.
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard key={stat.title} stat={stat} index={index} />
          ))}
        </div>

        {/* Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Your latest soil analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="space-y-4">
                  {reportSkeletons}
                </div>
              ) : reportsData?.reports?.length > 0 ? (
                <div className="space-y-4">
                  {reportsData.reports.map((report) => (
                    <ReportItem key={report.id} report={report} />
                  ))}
                  <div className="pt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/reports">View All Reports</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No reports yet"
                  description="Upload your first soil report to get started with AI-powered analysis."
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
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link to="/reports/upload">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload New Report
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Reports
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/profile">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

export default memo(Dashboard)
