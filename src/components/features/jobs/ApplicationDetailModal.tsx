'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileText, 
  Download, 
  Edit3, 
  Save, 
  X,
  Eye,
  Trash2,
  User,
  Phone,
  Globe,
  MessageSquare
} from 'lucide-react'
import { JobApplication, ApplicationStatus } from '@/types/job-application'
import { getStatusColor, getStatusIcon } from './ApplicationButton'
import { cn, getRelativeTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/api'

interface ApplicationDetailModalProps {
  applicationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplicationUpdated?: () => void
  onApplicationWithdrawn?: () => void
}

export function ApplicationDetailModal({
  applicationId,
  open,
  onOpenChange,
  onApplicationUpdated,
  onApplicationWithdrawn
}: ApplicationDetailModalProps) {
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedCoverLetter, setEditedCoverLetter] = useState('')
  const [saving, setSaving] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const { toast } = useToast()

  // Fetch application details when modal opens
  useEffect(() => {
    if (open && applicationId) {
      fetchApplicationDetails()
    }
  }, [open, applicationId])

  const fetchApplicationDetails = async () => {
    if (!applicationId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<JobApplication> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch application details')
      }

      setApplication(result.data!)
      setEditedCoverLetter(result.data!.coverLetter)
    } catch (error) {
      console.error('Error fetching application:', error)
      toast({
        title: 'Error',
        description: 'Failed to load application details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!application || !editing) return

    setSaving(true)
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          coverLetter: editedCoverLetter
        })
      })

      const result: ApiResponse<JobApplication> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update application')
      }

      setApplication(result.data!)
      setEditing(false)
      onApplicationUpdated?.()
      
      toast({
        title: 'Application Updated',
        description: 'Your application has been successfully updated.'
      })
    } catch (error) {
      console.error('Error updating application:', error)
      toast({
        title: 'Update Failed',
        description: 'Failed to update application. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleWithdraw = async () => {
    if (!application) return

    const confirmed = confirm(
      `Are you sure you want to withdraw your application for "${application.job?.title}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setWithdrawing(true)
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to withdraw application')
      }

      onApplicationWithdrawn?.()
      onOpenChange(false)
      
      toast({
        title: 'Application Withdrawn',
        description: 'Your application has been successfully withdrawn.'
      })
    } catch (error) {
      console.error('Error withdrawing application:', error)
      toast({
        title: 'Withdrawal Failed',
        description: 'Failed to withdraw application. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setWithdrawing(false)
    }
  }

  const canEdit = application?.status === 'pending'
  const canWithdraw = application?.status === 'pending' || application?.status === 'reviewing'

  const getStatusBadge = (status: ApplicationStatus) => {
    const icon = getStatusIcon(status)
    const colorClass = getStatusColor(status)
    
    return (
      <Badge className={cn("flex items-center gap-1", colorClass)}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleDownloadResume = () => {
    if (application?.customResumeUrl) {
      window.open(application.customResumeUrl, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Application Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : application ? (
          <div className="space-y-6">
            {/* Job Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {application.job?.title || 'Job Title Not Available'}
                    </h3>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{application.job?.company.name || 'Unknown Company'}</span>
                      </div>
                      {application.job?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{application.job.location}</span>
                        </div>
                      )}
                      {application.job?.employmentType && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{application.job.employmentType.replace('-', ' ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <label className="text-sm text-gray-400">Applied Date</label>
                    <p className="font-medium">{getRelativeTime(application.appliedAt)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Updated</label>
                    <p className="font-medium">{getRelativeTime(application.updatedAt)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <p className="font-medium">
                      {application.applicantFirstName} {application.applicantLastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Phone Number</label>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {application.applicantPhone}
                    </p>
                  </div>
                  {application.nationality && (
                    <div>
                      <label className="text-sm text-gray-400">Nationality</label>
                      <p className="font-medium flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {application.nationality}
                      </p>
                    </div>
                  )}
                  {application.applicantWechatId && (
                    <div>
                      <label className="text-sm text-gray-400">WeChat ID</label>
                      <p className="font-medium flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {application.applicantWechatId}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Cover Letter
                  </div>
                  {canEdit && !editing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedCoverLetter}
                      onChange={(e) => setEditedCoverLetter(e.target.value)}
                      placeholder="Write your cover letter..."
                      className="min-h-[200px] bg-gray-700 border-gray-600 text-white"
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {editedCoverLetter.length}/2000 characters
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditing(false)
                            setEditedCoverLetter(application.coverLetter)
                          }}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveChanges}
                          disabled={saving || editedCoverLetter.length < 50}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume */}
            {application.customResumeUrl && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Custom Resume</p>
                        <p className="text-sm text-gray-400">PDF Document</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadResume}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Application not found</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Close
          </Button>
          
          {application && canWithdraw && (
            <Button
              variant="outline"
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="border-red-700 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}