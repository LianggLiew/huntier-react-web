'use client'

import { useState, use, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, GraduationCap, Users, Award, Sparkles, Upload, FileText, Lightbulb, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

interface FormData {
  firstName: string
  lastName: string
  university: string
  faculty: string
  studentId: string
  graduationYear: string
  resumeFile: File | null
}

interface FormErrors {
  [key: string]: string
}

export default function CampusAmbassadorPage({ params }: { params: Promise<{ lang: string }> }) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    university: '',
    faculty: '',
    studentId: '',
    graduationYear: '',
    resumeFile: null
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { lang } = use(params)

  // Simplified translations for single card form
  const translations = {
    en: {
      title: "Become a Campus Ambassador",
      subtitle: "Join Huntier's Campus Ambassador Program",
      description: "Help us connect students with amazing career opportunities while building your leadership skills and professional network.",
      backToHome: "Back to Home",
      form: {
        title: "Application Form",
        description: "Please fill out the information below to apply for our Campus Ambassador program.",
        firstName: "First Name",
        lastName: "Last Name",
        university: "University Name",
        faculty: "Faculty/School",
        studentId: "Student ID",
        graduationYear: "Expected Graduation Year",
        resume: "Resume (Optional)",
        firstNamePlaceholder: "Enter your first name",
        lastNamePlaceholder: "Enter your last name",
        universityPlaceholder: "e.g., Harvard University",
        facultyPlaceholder: "e.g., Computer Science, Business",
        studentIdPlaceholder: "Your student ID number",
        graduationYearPlaceholder: "e.g., 2025",
        uploadText: "Click to upload or drag and drop",
        supportedFormats: "PDF, DOC, DOCX (max 5MB)",
        fileName: "Selected file:",
        submitButton: "Submit Application",
        submitting: "Submitting..."
      },
      benefits: {
        title: "Program Benefits",
        items: [
          "Early access to new features",
          "Exclusive networking events",
          "Leadership development training",
          "Portfolio building opportunities",
          "Letter of recommendation",
          "Potential internship opportunities"
        ]
      },
      requirements: {
        title: "Requirements",
        items: [
          "Currently enrolled full-time student",
          "Strong communication skills",
          "Passionate about career development",
          "Good academic standing"
        ]
      },
      errors: {
        required: "This field is required",
        fileSize: "File size must be less than 5MB",
        fileType: "Only PDF, DOC, and DOCX files are allowed"
      }
    },
    zh: {
      title: "成为校园大使",
      subtitle: "加入瀚拓校园大使计划",
      description: "帮助我们连接学生与优质职业机会，同时培养您的领导技能和专业网络。",
      backToHome: "返回首页",
      // Chinese translations would follow the same structure
      form: {
        title: "申请表",
        description: "请填写以下信息申请我们的校园大使项目。",
        firstName: "名",
        lastName: "姓",
        university: "大学名称",
        faculty: "院系",
        studentId: "学号",
        graduationYear: "预期毕业年份",
        resume: "简历（可选）",
        firstNamePlaceholder: "输入您的名字",
        lastNamePlaceholder: "输入您的姓氏",
        universityPlaceholder: "例如：清华大学",
        facultyPlaceholder: "例如：计算机科学，商学院",
        studentIdPlaceholder: "您的学号",
        graduationYearPlaceholder: "例如：2025",
        uploadText: "点击上传或拖放文件",
        supportedFormats: "PDF, DOC, DOCX (最大 5MB)",
        fileName: "已选择文件：",
        submitButton: "提交申请",
        submitting: "提交中..."
      },
      benefits: {
        title: "项目福利",
        items: [
          "新功能抢先体验",
          "独家网络活动",
          "领导力发展培训",
          "作品集建设机会",
          "推荐信",
          "潜在实习机会"
        ]
      },
      requirements: {
        title: "要求",
        items: [
          "目前为全日制在校学生",
          "良好的沟通技巧",
          "对职业发展充满热情",
          "良好的学业表现"
        ]
      },
      errors: {
        required: "此字段为必填项",
        fileSize: "文件大小必须小于 5MB",
        fileType: "仅支持 PDF、DOC 和 DOCX 文件"
      }
    }
  }

  const t = translations[lang as 'en' | 'zh'] || translations.en

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName) newErrors.firstName = t.errors.required
    if (!formData.lastName) newErrors.lastName = t.errors.required
    if (!formData.university) newErrors.university = t.errors.required
    if (!formData.faculty) newErrors.faculty = t.errors.required
    if (!formData.studentId) newErrors.studentId = t.errors.required
    if (!formData.graduationYear) newErrors.graduationYear = t.errors.required
    // Resume is optional, so no validation needed

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ resumeFile: t.errors.fileSize })
      toast({
        title: "File Too Large ⚠️",
        description: t.errors.fileSize,
        variant: "destructive",
      })
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setErrors({ resumeFile: t.errors.fileType })
      toast({
        title: "Invalid File Type ⚠️",
        description: t.errors.fileType,
        variant: "destructive",
      })
      return
    }

    setFormData(prev => ({ ...prev, resumeFile: file }))
    setErrors(prev => ({ ...prev, resumeFile: '' }))
    toast({
      title: "File Uploaded Successfully! ✅",
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      variant: "default",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('firstName', formData.firstName)
      submitData.append('lastName', formData.lastName)
      submitData.append('university', formData.university)
      submitData.append('faculty', formData.faculty)
      submitData.append('studentId', formData.studentId)
      submitData.append('graduationYear', formData.graduationYear)
      if (formData.resumeFile) {
        submitData.append('resume', formData.resumeFile)
      }

      // Submit to API
      const response = await fetch('/api/campus-ambassador', {
        method: 'POST',
        body: submitData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }
      
      toast({
        title: "Application Submitted Successfully! 🎉",
        description: `Application ID: ${result.applicationId}. We'll be in touch soon.`,
        variant: "default",
      })
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', university: '', faculty: '',
        studentId: '', graduationYear: '', resumeFile: null
      })
    } catch (error: any) {
      console.error('Application submission error:', error)
      const errorMessage = error.message || 'Failed to submit application. Please try again.'
      toast({
        title: "Submission Failed ❌",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${lang}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
                <GraduationCap className="h-16 w-16 text-emerald-600 dark:text-emerald-400 relative" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t.subtitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar with Benefits & Requirements */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    {t.benefits.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.benefits.items.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-teal-600" />
                    {t.requirements.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.requirements.items.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t.form.title}</CardTitle>
                  <p className="text-muted-foreground">{t.form.description}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t.form.firstName}</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          placeholder={t.form.firstNamePlaceholder}
                          className={`mt-2 ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t.form.lastName}</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          placeholder={t.form.lastNamePlaceholder}
                          className={`mt-2 ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="university">{t.form.university}</Label>
                        <Input
                          id="university"
                          value={formData.university}
                          onChange={(e) => updateFormData('university', e.target.value)}
                          placeholder={t.form.universityPlaceholder}
                          className={`mt-2 ${errors.university ? 'border-red-500' : ''}`}
                        />
                        {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="faculty">{t.form.faculty}</Label>
                          <Input
                            id="faculty"
                            value={formData.faculty}
                            onChange={(e) => updateFormData('faculty', e.target.value)}
                            placeholder={t.form.facultyPlaceholder}
                            className={`mt-2 ${errors.faculty ? 'border-red-500' : ''}`}
                          />
                          {errors.faculty && <p className="text-red-500 text-sm mt-1">{errors.faculty}</p>}
                        </div>
                        <div>
                          <Label htmlFor="graduationYear">{t.form.graduationYear}</Label>
                          <Input
                            id="graduationYear"
                            value={formData.graduationYear}
                            onChange={(e) => updateFormData('graduationYear', e.target.value)}
                            placeholder={t.form.graduationYearPlaceholder}
                            className={`mt-2 ${errors.graduationYear ? 'border-red-500' : ''}`}
                          />
                          {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="studentId">{t.form.studentId}</Label>
                        <Input
                          id="studentId"
                          value={formData.studentId}
                          onChange={(e) => updateFormData('studentId', e.target.value)}
                          placeholder={t.form.studentIdPlaceholder}
                          className={`mt-2 ${errors.studentId ? 'border-red-500' : ''}`}
                        />
                        {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-4">
                      <Label>{t.form.resume}</Label>
                      <div 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {t.form.uploadText}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t.form.supportedFormats}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      {formData.resumeFile && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {t.form.fileName} {formData.resumeFile.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, resumeFile: null }))
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}

                      {errors.resumeFile && (
                        <p className="text-red-500 text-sm">{errors.resumeFile}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-medium py-3"
                      >
                        {isSubmitting ? t.form.submitting : t.form.submitButton}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}