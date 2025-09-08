import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    const errorId = crypto.randomUUID()
    this.setState({
      error,
      errorInfo,
      errorId
    })

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, {
      //   extra: errorInfo,
      //   tags: { errorId }
      // })
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state
      const isDevelopment = import.meta.env.DEV

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-danger-600" />
              </div>
              <CardTitle className="text-2xl text-ink-900">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-ink-600">
                We're sorry, but something unexpected happened. Our team has been notified.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error ID for support */}
              {errorId && (
                <div className="bg-info-50 border border-info-200 rounded-lg p-3">
                  <p className="text-sm text-info-800">
                    <strong>Error ID:</strong> {errorId}
                  </p>
                  <p className="text-xs text-info-600 mt-1">
                    Please include this ID when contacting support.
                  </p>
                </div>
              )}

              {/* Development error details */}
              {isDevelopment && error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <h4 className="font-medium text-danger-800 mb-2">Error Details (Development Only)</h4>
                  <div className="text-sm text-danger-700 space-y-2">
                    <p><strong>Error:</strong> {error.toString()}</p>
                    {errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Stack Trace</summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                          {errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center text-sm text-ink-600">
                <p>
                  If this problem persists, please contact our support team with the Error ID above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }