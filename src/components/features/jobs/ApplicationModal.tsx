'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useJobApplication } from '@/hooks/useJobApplication'
import { useResumeUpload } from '@/hooks/useResumeUpload'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  Upload, 
  FileText, 
  User, 
  Phone, 
  Globe,
  MessageSquare,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react'
import { ApplicationSubmissionData } from '@/types/job-application'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: number
  jobTitle: string
  companyName: string
  location?: string
  onSuccess?: () => void
}

interface FormData {
  coverLetter: string
  firstName: string
  lastName: string
  phoneNumber: string
  nationality: string
  wechatId: string
  customResumeUrl?: string
}

interface FormErrors {
  [key: string]: string
}

export function ApplicationModal({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle, 
  companyName, 
  location,
  onSuccess 
}: ApplicationModalProps) {
  const { user, profile } = useAuth()
  const { submitApplication, isSubmitting, validateForm } = useJobApplication({
    onSuccess: () => {
      onSuccess?.()
      onClose()
    }
  })
  
  const { uploadResume, isUploading, triggerFileSelect, fileInputRef } = useResumeUpload({
    showToasts: false,
    onSuccess: (result) => {
      if (result.data?.fileUrl) {
        setFormData(prev => ({ ...prev, customResumeUrl: result.data.fileUrl }))
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 3000)
      }
    }
  })

  const [formData, setFormData] = useState<FormData>({
    coverLetter: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    nationality: '',
    wechatId: '',
    customResumeUrl: undefined
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [characterCount, setCharacterCount] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Auto-fill form data when profile/user loads (following PersonalInfoModal pattern)
  useEffect(() => {
    if (isOpen && (profile || user)) {
      setFormData(prev => ({
        ...prev,
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phoneNumber: user?.phone || '', // Map user.phone to phoneNumber
        nationality: profile?.nationality || '',
        wechatId: profile?.wechatId || ''
      }))
    }
  }, [isOpen, profile, user])

  // Update character count
  useEffect(() => {
    setCharacterCount(formData.coverLetter.length)
  }, [formData.coverLetter])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateFormData = (): boolean => {
    const submissionData: ApplicationSubmissionData = {
      jobId,
      coverLetter: formData.coverLetter,
      applicantInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        nationality: formData.nationality || undefined,
        wechatId: formData.wechatId || undefined
      },
      customResumeUrl: formData.customResumeUrl
    }

    const validation = validateForm(submissionData)
    
    if (!validation.isValid && validation.errors) {
      const newErrors: FormErrors = {}
      
      // Map validation errors to form fields
      if (validation.errors.fieldErrors?.coverLetter) {
        newErrors.coverLetter = validation.errors.fieldErrors.coverLetter[0]
      }
      if (validation.errors.fieldErrors?.applicantInfo?.firstName) {
        newErrors.firstName = validation.errors.fieldErrors.applicantInfo.firstName[0]
      }
      if (validation.errors.fieldErrors?.applicantInfo?.lastName) {
        newErrors.lastName = validation.errors.fieldErrors.applicantInfo.lastName[0]
      }
      if (validation.errors.fieldErrors?.applicantInfo?.phoneNumber) {
        newErrors.phoneNumber = validation.errors.fieldErrors.applicantInfo.phoneNumber[0]
      }
      
      setErrors(newErrors)
      return false
    }
    
    setErrors({})
    return true
  }

  const handleSubmit = async () => {
    if (!validateFormData()) {
      return
    }

    const submissionData: ApplicationSubmissionData = {
      jobId,
      coverLetter: formData.coverLetter,
      applicantInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        nationality: formData.nationality || undefined,
        wechatId: formData.wechatId || undefined
      },
      customResumeUrl: formData.customResumeUrl
    }

    await submitApplication(submissionData)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadResume(file)
    }
  }

  const isFormValid = formData.coverLetter.length >= 50 && 
                     formData.firstName.trim() && 
                     formData.lastName.trim() && 
                     formData.phoneNumber.trim()

  const getCoverLetterStatus = () => {
    if (characterCount < 50) {
      return { color: 'text-red-500', message: `${50 - characterCount} more characters needed` }
    }
    if (characterCount > 2000) {
      return { color: 'text-red-500', message: `${characterCount - 2000} characters over limit` }
    }
    return { color: 'text-emerald-500', message: 'Good length' }
  }

  const status = getCoverLetterStatus()

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Apply for Position</DialogTitle>
          </DialogHeader>

          {/* Job Information */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {jobTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {companyName}
                  </p>
                  {location && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Nationality
                  </label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="Enter your nationality"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    WeChat ID
                  </label>
                  <Input
                    value={formData.wechatId}
                    onChange={(e) => handleInputChange('wechatId', e.target.value)}
                    placeholder="Enter your WeChat ID (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Resume
              </h4>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  {formData.customResumeUrl ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Custom resume uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload a custom resume for this application (optional)
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        PDF, DOCX up to 5MB. Your profile resume will be used if none uploaded.
                      </p>
                    </div>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileSelect}
                    disabled={isUploading}
                    className="relative"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.customResumeUrl ? 'Replace Resume' : 'Upload Resume'}
                      </>
                    )}
                  </Button>
                  
                  {uploadSuccess && (
                    <Badge className="ml-2 bg-emerald-100 text-emerald-800">
                      <Check className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-lg font-medium mb-4">
                Cover Letter *
              </label>
              <Textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                className={`min-h-[150px] ${errors.coverLetter ? 'border-red-500' : ''}`}
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs">
                  {errors.coverLetter && (
                    <p className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.coverLetter}
                    </p>
                  )}
                </div>
                <div className={`text-xs ${status.color}`}>
                  {characterCount}/2000 • {status.message}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />
    </>
  )
}