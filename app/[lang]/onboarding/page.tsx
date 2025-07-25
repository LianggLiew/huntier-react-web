'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, ArrowRight, ArrowLeft, User } from 'lucide-react'
import PersonalInfoForm, { type PersonalInfo } from '@/components/onboarding/PersonalInfoForm'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [hasResume, setHasResume] = useState(true)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    phone: '',
    email: '',
    education: ''
  })
  const router = useRouter()

  const jobFields = [
    'Software Development',
    'Data Science',
    'Product Management',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Human Resources',
    'Customer Success',
    'Business Development',
    'Engineering'
  ]

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/jobs')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipResume = () => {
    setHasResume(false)
  }

  const backToResume = () => {
    setHasResume(true)
  }

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isPersonalInfoValid = () => {
    return personalInfo.firstName && 
           personalInfo.lastName && 
           personalInfo.dateOfBirth && 
           personalInfo.nationality && 
           personalInfo.phone && 
           personalInfo.email && 
           personalInfo.education
  }

  return (
    <div className="h-screen bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 py-8 lg:py-12 overflow-hidden relative flex flex-col">
      {/* Background elements matching homepage style */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Main gradient blob */}
        <div className="absolute top-0 left-0 right-0 w-[95%] h-96 bg-gradient-to-br from-emerald-300/25 via-teal-200/20 to-transparent dark:from-emerald-700/20 dark:via-teal-800/15 dark:to-transparent blur-[120px] transform -translate-y-1/4 rounded-full mx-auto"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-xl animate-float-slow"></div>
        <div className="absolute top-[35%] right-[5%] w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-400/10 blur-xl animate-float-medium"></div>
        <div className="absolute bottom-[20%] left-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-teal-400/15 to-emerald-300/10 blur-lg animate-float-fast"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Get Started
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 animate-gradient-x">
            {currentStep === 1 
              ? (hasResume 
                  ? <>Apply to unlock opportunities at <br className="hidden sm:block" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">top companies</span></>
                  : <>Tell us <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">about yourself</span></>
                )
              : <>What kind of <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">jobs</span> are you looking for?</>
            }
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-[650px] mx-auto leading-relaxed">
            {currentStep === 1 
              ? (hasResume 
                  ? "Huntier helps you get considered by hundreds of companies with one application."
                  : "Please provide your basic information to create your profile."
                )
              : "Select the fields that interest you most to get personalized job recommendations."
            }
          </p>
        </div>

        {currentStep === 1 && (
          <div className="transition-all duration-300 ease-in-out">
            {hasResume ? (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-2xl blur-2xl opacity-8 dark:opacity-12 animate-pulse"></div>
                <Card className="relative p-6 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-800/50 shadow-xl">
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 scale-[1.02]' 
                        : uploadedFile 
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                          : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="resume-upload"
                  />
                  
                  <div className="flex flex-col items-center space-y-4">
                    {uploadedFile ? (
                      <>
                        <div className="relative">
                          <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-md animate-pulse"></div>
                          <FileText className="relative h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            File uploaded successfully
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-lg"></div>
                          <Upload className="relative h-12 w-12 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-4">
                          <label 
                            htmlFor="resume-upload"
                            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-base"
                          >
                            <Upload className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                            Upload resume
                            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                          </label>
                          <p className="text-muted-foreground text-center">
                            or drag and drop your file here
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    onClick={skipResume}
                    className="group inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105"
                  >
                    <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    I don't have a resume
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                </Card>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-2xl blur-2xl opacity-8 dark:opacity-12 animate-pulse"></div>
                <div className="relative">
                  <PersonalInfoForm 
                    personalInfo={personalInfo}
                    onUpdate={updatePersonalInfo}
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={backToResume}
                      className="group inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105"
                    >
                      <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      I want to upload a resume instead
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="transition-all duration-300 ease-in-out">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-2xl blur-2xl opacity-8 dark:opacity-12 animate-pulse"></div>
              <Card className="relative p-6 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-800/50 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {jobFields.map((field) => (
                    <button
                      key={field}
                      onClick={() => toggleField(field)}
                      className={`group p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        selectedFields.includes(field)
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/50 dark:to-emerald-800/30 text-emerald-700 dark:text-emerald-300 shadow-md'
                          : 'border-emerald-100 dark:border-emerald-800/50 bg-white/50 dark:bg-gray-800/30 text-foreground hover:border-emerald-200 dark:hover:border-emerald-700/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      <div className="font-semibold text-sm md:text-base group-hover:scale-105 transition-transform duration-200">{field}</div>
                      {selectedFields.includes(field) && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="group px-6 py-3 rounded-full border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
            )}
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-300"></div>
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 && (hasResume ? !uploadedFile : !isPersonalInfoValid())}
              className="relative bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base group-hover:scale-105"
            >
              {currentStep === 2 ? 'Get Started' : 'Next step'}
              <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Progress bar at bottom like demo */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="relative w-full">
            {/* Progress bar background */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              {/* Active progress fill */}
              <div 
                className={`h-1 bg-blue-500 rounded-full transition-all duration-500 ease-in-out ${
                  currentStep === 1 ? 'w-1/2' : 'w-full'
                }`}
              ></div>
            </div>
            
            {/* Step labels */}
            <div className="flex justify-between mt-4">
              <span className={`text-sm transition-all duration-300 ${
                currentStep === 1 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {hasResume ? 'Upload resume' : 'Personal info'}
              </span>
              <span className={`text-sm transition-all duration-300 ${
                currentStep === 2 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                Explore opportunities
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}