import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  UserPlus,
  Activity
} from 'lucide-react'
import { useAdminDashboard } from '../../hooks/useAdmin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDate, getStatusColor, getStatusText } from '../../lib/utils'

const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className="container-nature section-padding">
        <div className="space-y-6">
          <div className="h-8 w-64 loading-skeleton rounded mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-nature section-padding">
        <EmptyState
          icon={AlertCircle}
          title="Failed to load admin dashboard"
          description="There was an error loading the admin dashboard data. Please try again."
          action={
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          }
        />
      </div>
    )
  }

  const { stats, recentUsers, recentReports } = data || {}

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Reports',
      value: stats?.totalReports || 0,
      icon: FileText,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Completed Reports',
      value: stats?.completedReports || 0,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      change: '+15%',
      changeType: 'positive',
    },
    {
      title: 'Failed Reports',
      value: stats?.failedReports || 0,
      icon: AlertCircle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100',
      change: '-3%',
      changeType: 'negative',
    },
  ]

  return (
    <div className="container-nature section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Admin Dashboard</h1>
          <p className="mt-2 text-ink-600">
            Overview of system activity and user management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
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
                        <div className="flex items-center mt-1">
                          <span className={`text-xs font-medium ${
                            stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-xs text-ink-500 ml-1">vs last month</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Users
              </CardTitle>
              <CardDescription>
                Latest user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers?.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-nature rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{user.username}</p>
                          <p className="text-sm text-ink-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <span className="text-xs text-ink-500">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-ink-300 mx-auto mb-4" />
                  <p className="text-ink-500">No recent users</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Latest soil analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentReports?.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.slice(0, 5).map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-nature rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">
                            {report.district}, {report.state}
                          </p>
                          <p className="text-sm text-ink-600">
                            by {report.user?.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(report.status)}>
                          {getStatusText(report.status)}
                        </Badge>
                        <span className="text-xs text-ink-500">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-ink-300 mx-auto mb-4" />
                  <p className="text-ink-500">No recent reports</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-6 flex flex-col items-center space-y-2">
                <a href="/admin/users">
                  <Users className="w-8 h-8" />
                  <span>Manage Users</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2">
                <a href="/admin/reports">
                  <FileText className="w-8 h-8" />
                  <span>View All Reports</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2">
                <a href="/admin/analytics">
                  <BarChart3 className="w-8 h-8" />
                  <span>View Analytics</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
