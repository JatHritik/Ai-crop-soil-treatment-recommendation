import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Leaf,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react'
import { useReport, useReportStatus, useDeleteReport } from '../../hooks/useReports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { CenteredLoader } from '../../components/ui/CenteredLoader'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { AgriculturalDataDisplay } from '../../components/AgriculturalDataDisplay'
import { ObjectDataDisplay } from '../../components/ObjectDataDisplay'
import CropDetailModal from '../../components/CropDetailModal'
import DetailedRecommendationsButton from '../../components/DetailedRecommendationsButton'
import { formatDate, getStatusColor, getStatusText, getSeasonText, safeRender } from '../../lib/utils'

const ReportDetails = () => {
  const { id } = useParams()
  const { data: report, isLoading, error } = useReport(id)
  const { data: statusData } = useReportStatus(id)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const deleteReportMutation = useDeleteReport()

  const handleCropClick = (crop) => {
    setSelectedCrop(crop)
    setIsCropModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCropModalOpen(false)
    setSelectedCrop(null)
  }

  if (isLoading) {
    console.log('ReportDetails: Loading...', { id, isLoading, error })
    return <CenteredLoader message="Loading report details..." />
  }

  if (error || !report) {
    console.log('ReportDetails Error:', error)
    console.log('ReportDetails Report:', report)
    return (
      <div className="container-nature section-padding">
        <EmptyState
          icon={AlertCircle}
          title="Report not found"
          description="The report you're looking for doesn't exist or you don't have permission to view it."
          action={
            <Button asChild>
              <Link to="/reports">Back to Reports</Link>
            </Button>
          }
        />
      </div>
    )
  }

  // Debug logging
  console.log('ReportDetails Report Data:', report)
  console.log('ReportDetails AI Analysis:', report.aiAnalysis)
  console.log('AI Analysis Keys:', report.aiAnalysis ? Object.keys(report.aiAnalysis) : 'No AI Analysis')
  console.log('AI Analysis Values:', report.aiAnalysis ? Object.values(report.aiAnalysis) : 'No AI Analysis')

  const currentStatus = statusData?.status || report.status
  const isAnalyzing = currentStatus === 'ANALYZING'
  const isCompleted = currentStatus === 'COMPLETED'
  const isFailed = currentStatus === 'FAILED'
  const hasValidationError = report.aiAnalysis?.validationError

  return (
    <div className="container-nature section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/reports">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Report Details</h1>
            <p className="text-ink-600">
              {report.district}, {report.state} • {getSeasonText(report.season)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Report Information
                    </CardTitle>
                    <CardDescription>
                      Basic details about this soil analysis report
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(currentStatus)}>
                    {getStatusText(currentStatus)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-ink-600">District</label>
                    <p className="text-ink-900">{report.district}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-600">State</label>
                    <p className="text-ink-900">{report.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-600">Area</label>
                    <p className="text-ink-900">{report.area}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-600">Season</label>
                    <p className="text-ink-900">{getSeasonText(report.season)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-ink-600">Uploaded</label>
                      <p className="text-ink-900">{formatDate(report.createdAt)}</p>
                    </div>
                    {report.analyzedAt && (
                      <div>
                        <label className="text-sm font-medium text-ink-600">Analyzed</label>
                        <p className="text-ink-900">{formatDate(report.analyzedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

              {/* Extracted Text - Hidden as per user request */}
              {/* {report.extractedText && (
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Text</CardTitle>
                    <CardDescription>
                      Text extracted from the uploaded document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-surface-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-ink-700 whitespace-pre-wrap">
                        {report.extractedText}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )} */}

            {/* AI Analysis */}
            {isCompleted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-accent-600" />
                    AI Analysis Results
                  </CardTitle>
                  <CardDescription>
                    AI-powered soil analysis and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.aiAnalysis ? (
                    report.aiAnalysis.validationError ? (
                      <div className="space-y-4">
                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-warning-600 mr-3 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-warning-800 mb-2">Invalid Report Content</h4>
                              <div className="text-xs text-warning-600 mb-3">
                                <p><strong>Validation Score:</strong> {report.aiAnalysis.validationScore}/3 (minimum 3 required)</p>
                                {report.aiAnalysis.foundKeywords && report.aiAnalysis.foundKeywords.length > 0 && (
                                  <p><strong>Keywords Found:</strong> {report.aiAnalysis.foundKeywords.join(', ')}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Show recommendations even for validation errors */}
                        {report.aiAnalysis.recommendations && (
                          <div>
                            <h4 className="font-medium text-ink-900 mb-2 flex items-center">
                              <Leaf className="w-5 h-5 mr-2 text-warning-600" />
                              Top 5 Crop Recommendations
                            </h4>
                            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                              {Array.isArray(report.aiAnalysis.recommendations) ? (
                                <div className="space-y-3">
                                  {report.aiAnalysis.recommendations.map((rec, index) => (
                                    <div 
                                      key={index} 
                                      className="bg-white border border-warning-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-warning-300"
                                      onClick={() => handleCropClick(rec)}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="flex-shrink-0 w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                                            <span className="text-warning-800 font-bold text-sm">#{index + 1}</span>
                                          </div>
                                          <div>
                                            <h5 className="font-semibold text-ink-900 text-lg hover:text-warning-700 transition-colors">{rec.crop}</h5>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div 
                                                  className="bg-warning-500 h-2 rounded-full transition-all duration-300" 
                                                  style={{ width: `${rec.suitability || 0}%` }}
                                                ></div>
                                              </div>
                                              <span className="text-sm text-ink-600">{rec.suitability || 0}% suitable</span>
                                            </div>
                                          </div>
                                        </div>
                                        {rec.suitability && (
                                          <Badge 
                                            variant="secondary" 
                                            className={`${
                                              rec.suitability >= 90 ? 'bg-success-100 text-success-800' :
                                              rec.suitability >= 80 ? 'bg-success-100 text-success-700' :
                                              rec.suitability >= 70 ? 'bg-warning-100 text-warning-800' :
                                              'bg-danger-100 text-danger-800'
                                            }`}
                                          >
                                            {rec.suitability >= 90 ? 'Excellent' :
                                             rec.suitability >= 80 ? 'Very Good' :
                                             rec.suitability >= 70 ? 'Good' : 'Fair'}
                                          </Badge>
                                        )}
                                      </div>
                                      {rec.reason && (
                                        <p className="text-ink-700 text-sm leading-relaxed">{rec.reason}</p>
                                      )}
                                      <div className="mt-2 text-xs text-ink-500 italic">
                                        Click for detailed information about pesticides, herbicides, and fertilizers
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-warning-700">
                                  {safeRender(report.aiAnalysis.recommendations)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {report.aiAnalysis.additionalTips && (
                          <div>
                            <h4 className="font-medium text-ink-900 mb-2">What to do next:</h4>
                            <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                              <ul className="space-y-1">
                                {report.aiAnalysis.additionalTips.map((tip, index) => (
                                  <li key={index} className="text-info-800 text-sm">• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                    <div className="space-y-4">
                      {report.aiAnalysis.recommendations && (
                        <div>
                          <h4 className="font-medium text-ink-900 mb-2 flex items-center">
                            <Leaf className="w-5 h-5 mr-2 text-success-600" />
                            Top 5 Crop Recommendations
                          </h4>
                          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                            {Array.isArray(report.aiAnalysis.recommendations) ? (
                              <div className="space-y-3">
                                {report.aiAnalysis.recommendations.map((rec, index) => (
                                  <div 
                                    key={index} 
                                    className="bg-white border border-success-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-success-300"
                                    onClick={() => handleCropClick(rec)}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                                          <span className="text-success-800 font-bold text-sm">#{index + 1}</span>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-ink-900 text-lg hover:text-success-700 transition-colors">{rec.crop}</h5>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                              <div 
                                                className="bg-success-500 h-2 rounded-full transition-all duration-300" 
                                                style={{ width: `${rec.suitability || 0}%` }}
                                              ></div>
                                            </div>
                                            <span className="text-sm text-ink-600">{rec.suitability || 0}% suitable</span>
                                          </div>
                                        </div>
                                      </div>
                                      {rec.suitability && (
                                        <Badge 
                                          variant="secondary" 
                                          className={`${
                                            rec.suitability >= 90 ? 'bg-success-100 text-success-800' :
                                            rec.suitability >= 80 ? 'bg-success-100 text-success-700' :
                                            rec.suitability >= 70 ? 'bg-warning-100 text-warning-800' :
                                            'bg-danger-100 text-danger-800'
                                          }`}
                                        >
                                          {rec.suitability >= 90 ? 'Excellent' :
                                           rec.suitability >= 80 ? 'Very Good' :
                                           rec.suitability >= 70 ? 'Good' : 'Fair'}
                                        </Badge>
                                      )}
                                    </div>
                                    {rec.reason && (
                                      <p className="text-ink-700 text-sm leading-relaxed">{rec.reason}</p>
                                    )}
                                    <div className="mt-2 text-xs text-ink-500 italic">
                                      Click for detailed information about pesticides, herbicides, and fertilizers
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-success-800">
                                {safeRender(report.aiAnalysis.recommendations)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {report.aiAnalysis.soilHealth && (
                        <div>
                          <h4 className="font-medium text-ink-900 mb-2">Soil Health Assessment</h4>
                          <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                            <p className="text-accent-800">
                              {safeRender(report.aiAnalysis.soilHealth)}
                            </p>
                          </div>
                        </div>
                      )}

                      {report.aiAnalysis.cropSuitability && (
                        <div>
                          <h4 className="font-medium text-ink-900 mb-2">Crop Suitability</h4>
                          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <p className="text-primary-800">
                              {safeRender(report.aiAnalysis.cropSuitability)}
                            </p>
                          </div>
                        </div>
                      )}

                      {report.aiAnalysis.nutrients && (
                        <div>
                          <h4 className="font-medium text-ink-900 mb-2">Nutrient Analysis</h4>
                          <div className="space-y-2">
                            {Object.entries(report.aiAnalysis.nutrients).map(([nutrient, value]) => (
                              <div key={nutrient} className="flex justify-between items-center py-2 border-b border-surface-200 last:border-b-0">
                                <span className="text-ink-700 capitalize">{nutrient.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="font-medium text-ink-900">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* Agricultural Recommendations */}
                      {report.aiAnalysis && (
                        <div className="space-y-4">
                          <AgriculturalDataDisplay data={report.aiAnalysis} />
                          
                          {/* Detailed AI Recommendations Button */}
                          <DetailedRecommendationsButton 
                            reportData={report.aiAnalysis}
                            location={{
                              district: report.district,
                              state: report.state,
                              area: report.area
                            }}
                            season={report.season}
                          />
                        </div>
                      )}

                      {/* Display any object data in AI analysis */}
                      {report.aiAnalysis && (() => {
                        const objectData = Object.fromEntries(
                          Object.entries(report.aiAnalysis).filter(([key, value]) => 
                            typeof value === 'object' && value !== null && 
                            !['recommendations', 'soilHealth', 'cropSuitability', 'nutrients', 'additionalTips', 'rawAnalysis', 'validationError', 'validationScore', 'foundKeywords', 'error', 'timestamp'].includes(key)
                          )
                        )
                        
                        return Object.keys(objectData).length > 0 ? (
                          <div>
                            <h4 className="font-medium text-ink-900 mb-2">Additional Analysis Data</h4>
                            <div className="space-y-4">
                              {Object.entries(objectData).map(([key, value]) => (
                                <ObjectDataDisplay 
                                  key={key} 
                                  data={value} 
                                  title={key.replace(/([A-Z])/g, ' $1').trim()} 
                                />
                              ))}
                            </div>
                          </div>
                        ) : null
                      })()}

                       {/* Raw Analysis - Hidden as per user request */}
                       {/* {report.aiAnalysis.rawAnalysis && (
                          <div>
                            <h4 className="font-medium text-ink-900 mb-2">Raw Analysis</h4>
                            <div className="bg-surface-50 border border-surface-200 rounded-lg p-4">
                              <pre className="text-sm text-ink-700 whitespace-pre-wrap">
                                {safeRender(report.aiAnalysis.rawAnalysis)}
                              </pre>
                            </div>
                          </div>
                        )} */}
                    </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
                      <p className="text-ink-600">AI analysis data is not available for this report.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {isFailed && report.aiAnalysis?.error && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-danger-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Analysis Failed
                  </CardTitle>
                  <CardDescription>
                    There was an error processing your report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                    <p className="text-danger-800">
                      {safeRender(report.aiAnalysis.error)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {isAnalyzing ? (
                      <RefreshCw className="w-5 h-5 text-accent-600 animate-spin" />
                    ) : isCompleted ? (
                      hasValidationError ? (
                        <AlertCircle className="w-5 h-5 text-warning-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      )
                    ) : isFailed ? (
                      <AlertCircle className="w-5 h-5 text-danger-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning-600" />
                    )}
                    <div>
                      <p className="font-medium text-ink-900">
                        {hasValidationError ? 'Invalid Content' : getStatusText(currentStatus)}
                      </p>
                      <p className="text-sm text-ink-600">
                        {isAnalyzing 
                          ? 'AI is analyzing your report...' 
                          : isCompleted 
                          ? hasValidationError
                            ? 'Report content is not soil-related'
                            : 'Analysis completed successfully'
                          : isFailed
                          ? 'Analysis failed'
                          : 'Waiting for analysis to begin'
                        }
                      </p>
                    </div>
                  </div>

                  {isAnalyzing && (
                    <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                      <p className="text-sm text-accent-800">
                        This may take a few minutes. The page will update automatically when complete.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/reports/upload">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload New Report
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/reports">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Reports
                  </Link>
                </Button>

                {isCompleted && (
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  className="w-full text-danger-600 border-danger-200 hover:bg-danger-50 hover:border-danger-300"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
                      deleteReportMutation.mutate(id, {
                        onSuccess: () => {
                          window.location.href = '/reports'
                        }
                      })
                    }
                  }}
                  disabled={deleteReportMutation.isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteReportMutation.isLoading ? 'Deleting...' : 'Delete Report'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Crop Detail Modal */}
      <CropDetailModal
        crop={selectedCrop}
        isOpen={isCropModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default ReportDetails
