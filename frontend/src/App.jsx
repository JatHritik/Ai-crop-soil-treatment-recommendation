import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/layout/Layout'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { CenteredLoader } from './components/ui/CenteredLoader'

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ReportsList = lazy(() => import('./pages/reports/ReportsList'))
const UploadReport = lazy(() => import('./pages/reports/UploadReport'))
const ReportDetails = lazy(() => import('./pages/reports/ReportDetails'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <CenteredLoader message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <CenteredLoader message="Loading..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Main App Component
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<CenteredLoader message="Loading login page..." />}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Suspense fallback={<CenteredLoader message="Loading registration page..." />}>
              <Register />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<CenteredLoader message="Loading dashboard..." />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<CenteredLoader message="Loading reports..." />}>
            <ReportsList />
          </Suspense>
        } />
        <Route path="reports/upload" element={
          <Suspense fallback={<CenteredLoader message="Loading upload page..." />}>
            <UploadReport />
          </Suspense>
        } />
        <Route path="reports/:id" element={
          <Suspense fallback={<CenteredLoader message="Loading report details..." />}>
            <ReportDetails />
          </Suspense>
        } />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={
          <Suspense fallback={<CenteredLoader message="Loading admin dashboard..." />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="dashboard" element={
          <Suspense fallback={<CenteredLoader message="Loading admin dashboard..." />}>
            <AdminDashboard />
          </Suspense>
        } />
        {/* Add more admin routes here */}
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App