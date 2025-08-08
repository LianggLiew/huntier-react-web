'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, ArrowRight, ArrowLeft, User, Check } from 'lucide-react'
import PersonalInfoForm, { type PersonalInfo } from '@/components/features/onboarding/PersonalInfoForm'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { useNavigation } from '@/hooks/useNavigation'
import { type LocalizedPageProps } from '@/lib/navigation'
import { getPageDictionary } from '@/translations'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function OnboardingPageContent({ params }: LocalizedPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [lang, setLang] = useState('en')
  const [dictionary, setDictionary] = useState<any>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    phone: '',
    email: '',
    education: '',
    major: ''
  })
  
  const { user, updateProfile, updateUser } = useAuth()
  const { toast } = useToast()
  const { goToJobs, push, isReady } = useNavigation(params)

  // Initialize language and load page-specific translations
  React.useEffect(() => {
    const initPageTranslations = async () => {
      const resolvedParams = await params
      const pageDict = await getPageDictionary('onboarding', resolvedParams.lang)
      setLang(resolvedParams.lang)
      setDictionary(pageDict)
    }
    initPageTranslations()
  }, [params])

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }

  // Check if personal info form is complete (for button state)
  const isPersonalInfoComplete = (): boolean => {
    const requiredFields: (keyof PersonalInfo)[] = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality', 'education', 'major'
    ]
    
    // Check if email or phone is provided (one is required)
    const hasContact = Boolean((user?.email || personalInfo.email) || (user?.phone || personalInfo.phone))
    
    const missingFields = requiredFields.filter(field => !personalInfo[field])
    
    return missingFields.length === 0 && hasContact
  }

  const validatePersonalInfo = (): boolean => {
    const requiredFields: (keyof PersonalInfo)[] = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality', 'education', 'major'
    ]
    
    // Check if email or phone is provided (one is required)
    const hasContact = Boolean((user?.email || personalInfo.email) || (user?.phone || personalInfo.phone))
    
    const missingFields = requiredFields.filter(field => !personalInfo[field])
    
    if (missingFields.length > 0 || !hasContact) {
      toast({
        title: "Please complete all required fields",
        description: missingFields.length > 0 
          ? `Missing: ${missingFields.join(', ')}` 
          : "Email or phone number is required",
        variant: "destructive"
      })
      return false
    }
    
    return true
  }

  const handlePersonalInfoSubmit = async () => {
    if (!validatePersonalInfo()) return

    setIsLoading(true)
    try {
      // Prepare additional contact info for user table updates
      const additionalContactInfo: any = {}
      
      // Only include phone/email if user doesn't already have them verified
      if (!user?.phone && personalInfo.phone) {
        additionalContactInfo.phone = personalInfo.phone
      }
      if (!user?.email && personalInfo.email) {
        additionalContactInfo.email = personalInfo.email
      }

      // Save personal info to profile
      await updateProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        dateOfBirth: personalInfo.dateOfBirth,
        nationality: personalInfo.nationality,
        major: personalInfo.major,
        highestDegree: personalInfo.education,
        ...(Object.keys(additionalContactInfo).length > 0 && { additionalContactInfo })
      })

      toast({
        title: "Personal information saved",
        description: "Your profile has been updated successfully"
      })

      // Move to step 2
      setCurrentStep(2)
    } catch (error) {
      console.error('Failed to save personal info:', error)
      toast({
        title: "Error saving information",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF and DOC/DOCX files are allowed",
        variant: "destructive"
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      })
      return
    }

    setUploadedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleResumeUpload = async () => {
    if (!uploadedFile) {
      // Skip resume upload
      await completeOnboarding()
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Resume uploaded successfully",
          description: "Your resume has been saved to your profile"
        })
      } else {
        throw new Error(result.error)
      }

      await completeOnboarding()
    } catch (error) {
      console.error('Failed to upload resume:', error)
      toast({
        title: "Error uploading resume",
        description: "Please try again or skip this step",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const completeOnboarding = async () => {
    try {
      // Mark onboarding as completed
      await updateProfile({
        onboardingCompleted: true
      })

      // Update user state
      updateUser({
        needsOnboarding: false
      })

      toast({
        title: "Welcome to Huntier!",
        description: "Your profile is ready. Let's find you some great opportunities!"
      })

      // Check for stored redirect from before auth flow
      if (typeof window !== 'undefined') {
        const storedRedirect = localStorage.getItem('huntier_redirect_after_auth');
        if (storedRedirect) {
          // Clean up the stored redirect
          localStorage.removeItem('huntier_redirect_after_auth');
          // Use stored redirect, removing language prefix if present
          // Handle URLs like "/en/jobs/123" -> "jobs/123"
          const cleanStoredRedirect = storedRedirect.replace(/^\/[a-z]{2}\//, '') || 'jobs';
          const cleanDestination = cleanStoredRedirect.startsWith('/') ? cleanStoredRedirect.slice(1) : cleanStoredRedirect;
          push(cleanDestination);
          return;
        }

        // Check if user came from profile button (Flow 1)
        const profileFlow = localStorage.getItem('huntier_profile_flow');
        if (profileFlow === 'true') {
          // Clean up the profile flow flag
          localStorage.removeItem('huntier_profile_flow');
          // Redirect to profile page
          push('profile');
          return;
        }
      }

      // Navigate to jobs page by default (Flow 2 without stored redirect)
      if (isReady) {
        goToJobs()
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      toast({
        title: "Error completing onboarding",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  const stepTitles = {
    1: dictionary.onboarding?.steps?.personalInfo || "Personal Information",
    2: dictionary.onboarding?.steps?.uploadResume || "Upload Resume"
  }

  const stepDescriptions = {
    1: dictionary.onboarding?.stepDescriptions?.personalInfo || "Tell us about yourself to create your profile",
    2: dictionary.onboarding?.stepDescriptions?.uploadResume || "Upload your resume to enhance your profile (optional)"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
              <h1 className="relative text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">
                {dictionary.onboarding?.title || "Welcome to Huntier"}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              {dictionary.onboarding?.subtitle || "Complete your profile to get started with personalized job matching"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </div>
                  {step < 2 && (
                    <div className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                      currentStep > step ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {stepTitles[currentStep as keyof typeof stepTitles]}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {stepDescriptions[currentStep as keyof typeof stepDescriptions]}
              </p>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <PersonalInfoForm 
                personalInfo={personalInfo}
                onUpdate={updatePersonalInfo}
                user={user ? { email: user.email, phone: user.phone } : undefined}
                lang={lang}
              />
              
              <div className="flex justify-end">
                <Button
                  onClick={handlePersonalInfoSubmit}
                  disabled={isLoading || !isPersonalInfoComplete()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                    isPersonalInfoComplete() && !isLoading
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 hover:shadow-xl'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? "Saving..." : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-800/50 shadow-xl">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-3 bg-emerald-500/10 rounded-full blur-lg"></div>
                    <Upload className="relative h-12 w-12 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add your resume to enhance your profile and improve job matching
                  </p>
                </div>

                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 ${
                      isDragOver 
                        ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX (max 5MB)
                    </p>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-emerald-600" />
                        <div>
                          <p className="font-medium text-emerald-700 dark:text-emerald-300">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-emerald-600">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                <div className="space-x-3">
                  {!uploadedFile && (
                    <Button
                      variant="ghost"
                      onClick={() => handleResumeUpload()}
                      disabled={isLoading}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Skip this step
                    </Button>
                  )}
                  <Button
                    onClick={handleResumeUpload}
                    disabled={isLoading}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                      uploadedFile
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 hover:shadow-xl'
                        : 'bg-gray-500 hover:bg-gray-600 text-white hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? "Processing..." : uploadedFile ? "Upload & Complete" : "Complete Setup"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage({ params }: LocalizedPageProps) {
  return (
    <ProtectedRoute>
      <OnboardingPageContent params={params} />
    </ProtectedRoute>
  )
}