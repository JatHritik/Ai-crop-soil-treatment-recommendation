import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  MapPin, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { useUploadReport } from '../../hooks/useReports'
import { uploadReportSchema, fileValidation } from '../../lib/validations'
import { Button } from '../../components/ui/Button'
import { Input, Label, Select } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { formatFileSize } from '../../lib/utils'

const UploadReport = () => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const navigate = useNavigate()
  const uploadMutation = useUploadReport()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(uploadReportSchema),
  })

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file) => {
    const validation = fileValidation.validateFile(file)
    if (!validation.valid) {
      setFileError(validation.error)
      setSelectedFile(null)
      return
    }

    setFileError(null)
    setSelectedFile(file)
    setValue('reportFile', file)
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileError(null)
    setValue('reportFile', null)
  }

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setFileError('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('reportFile', selectedFile)
    formData.append('district', data.district)
    formData.append('state', data.state)
    formData.append('area', data.area)
    formData.append('season', data.season)

    const result = await uploadMutation.mutateAsync(formData)
    if (result.success) {
      navigate('/reports')
    }
  }

  return (
    <div className="container-nature section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink-900">Upload Soil Report</h1>
          <p className="mt-2 text-ink-600">
            Upload your soil analysis report for AI-powered recommendations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Report Details
            </CardTitle>
            <CardDescription>
              Provide the necessary information about your soil report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload */}
              <div>
                <Label>Report File</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
                    dragActive
                      ? 'border-accent-500 bg-accent-50'
                      : selectedFile
                      ? 'border-success-500 bg-success-50'
                      : 'border-surface-300 hover:border-accent-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-success-500 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-success-700">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-success-600">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-danger-600 hover:text-danger-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-ink-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-ink-700">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-ink-500">
                            PDF, DOC, DOCX, JPG, PNG, TXT (max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {fileError && (
                  <p className="form-error flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {fileError}
                  </p>
                )}
                {errors.reportFile && (
                  <p className="form-error">{errors.reportFile.message}</p>
                )}
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    placeholder="Enter district name"
                    {...register('district')}
                    className={errors.district ? 'border-danger-500' : ''}
                  />
                  {errors.district && (
                    <p className="form-error">{errors.district.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Enter state name"
                    {...register('state')}
                    className={errors.state ? 'border-danger-500' : ''}
                  />
                  {errors.state && (
                    <p className="form-error">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="area">Area/Location</Label>
                <Input
                  id="area"
                  placeholder="Enter specific area or location"
                  {...register('area')}
                  className={errors.area ? 'border-danger-500' : ''}
                />
                {errors.area && (
                  <p className="form-error">{errors.area.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="season">Season</Label>
                <Select
                  id="season"
                  {...register('season')}
                  className={errors.season ? 'border-danger-500' : ''}
                >
                  <option value="">Select season</option>
                  <option value="KHARIF">Kharif</option>
                  <option value="RABI">Rabi</option>
                  <option value="ZAID">Zaid</option>
                </Select>
                {errors.season && (
                  <p className="form-error">{errors.season.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/reports')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadMutation.isLoading || !selectedFile}
                >
                  {uploadMutation.isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Report
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default UploadReport
