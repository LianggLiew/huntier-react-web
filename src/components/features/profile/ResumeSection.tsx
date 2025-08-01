'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ResumeSectionProps {
  resumeFileUrl?: string | null
  resumeFileName?: string | null
  resumeFileType?: string | null
  resumeFileSize?: number | null
  resumeParsedAt?: string | null
  onUpload: (file: File) => Promise<void>
  onDownload?: () => void
  onDelete?: () => Promise<void>
  isLoading?: boolean
  className?: string
}

export function ResumeSection({
  resumeFileUrl,
  resumeFileName,
  resumeFileType,
  resumeFileSize,
  resumeParsedAt,
  onUpload,
  onDownload,
  onDelete,
  isLoading = false,
  className
}: ResumeSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const hasResume = Boolean(resumeFileUrl && resumeFileName)

  // Supported file types
  const ACCEPTED_TYPES = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'image/jpeg': '.jpeg'
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file: File): string | null => {
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      return 'Please upload a PDF, DOCX, or JPEG file'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB'
    }
    return null
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatFileType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'pdf': 'PDF',
      'docx': 'Word Document',
      'jpeg': 'JPEG Image'
    }
    return typeMap[type] || type.toUpperCase()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast({
        title: 'Invalid File',
        description: error,
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    try {
      await onUpload(file)
      toast({
        title: 'Success',
        description: 'Resume uploaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your resume. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    try {
      await onDelete()
      toast({
        title: 'Success',
        description: 'Resume deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting your resume. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasResume ? (
          // Display current resume
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {resumeFileName}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {resumeFileType && (
                      <span>{formatFileType(resumeFileType)}</span>
                    )}
                    {resumeFileSize && (
                      <span>{formatFileSize(resumeFileSize)}</span>
                    )}
                    {resumeParsedAt && (
                      <span>Uploaded {formatDate(resumeParsedAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                      Ready for job applications
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Replace'}
              </Button>
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Upload area
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                    <Upload className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Upload your resume
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drop your resume here or click to browse
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>Supported formats: PDF, DOCX, JPEG</p>
                <p>Maximum file size: 5MB</p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.jpeg,.jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}