'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock3, Eye, UserCheck, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useJobApplication } from '@/hooks/useJobApplication'
import { getDictionary } from '@/lib/dictionary'
import { cn } from '@/lib/utils'

export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected'

interface ApplicationButtonProps {
  jobId: number
  lang: string
  variant?: 'button' | 'badge'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  onApplicationClick?: () => void
  className?: string
}

export function ApplicationButton({ 
  jobId, 
  lang, 
  variant = 'button',
  size = 'md',
  onApplicationClick,
  className 
}: ApplicationButtonProps) {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null)
  const { isAuthenticated } = useAuth()
  const { checkApplicationStatus, isCheckingStatus } = useJobApplication()
  const dict = getDictionary(lang)

  useEffect(() => {
    if (isAuthenticated && jobId) {
      checkApplicationStatus(jobId).then(status => {
        setApplicationStatus(status)
      })
    }
  }, [jobId, isAuthenticated, checkApplicationStatus])

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.href = `/${lang}/verify-otp`
      return
    }
    
    if (applicationStatus === null && onApplicationClick) {
      onApplicationClick()
    }
  }

  const getApplicationButtonContent = () => {
    // Get translations with fallbacks
    const statusTexts = dict?.features?.profile?.applicationStatus || {}
    const buttons = dict?.features?.profile?.buttons || {}
    
    if (!isAuthenticated) {
      return {
        text: buttons.applyNow || 'Apply Now',
        icon: null,
        variant: 'default' as const,
        disabled: false,
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }
    }
    
    if (isCheckingStatus) {
      return {
        text: statusTexts.checking || 'Checking...',
        icon: <Clock3 className="w-4 h-4 mr-2" />,
        variant: 'outline' as const,
        disabled: true,
        className: 'border-gray-300 text-gray-500'
      }
    }
    
    switch (applicationStatus) {
      case 'pending':
        return {
          text: statusTexts.pending || 'Applied - Pending',
          icon: <Clock3 className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
        }
      case 'reviewing':
        return {
          text: statusTexts.reviewing || 'Under Review',
          icon: <Eye className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
        }
      case 'interviewed':
        return {
          text: statusTexts.interviewed || 'Interviewed',
          icon: <UserCheck className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20'
        }
      case 'accepted':
        return {
          text: statusTexts.accepted || 'Congratulations!',
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20'
        }
      case 'rejected':
        return {
          text: statusTexts.rejected || 'Not Selected',
          icon: <XCircle className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
        }
      default:
        return {
          text: buttons.applyNow || 'Apply Now',
          icon: null,
          variant: 'default' as const,
          disabled: false,
          className: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }
    }
  }

  const content = getApplicationButtonContent()

  // Badge variant for showing status indicators
  if (variant === 'badge') {
    if (!isAuthenticated || applicationStatus === null) {
      return null
    }
    
    const badgeColors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      interviewed: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    }

    return (
      <Badge className={cn(
        "text-xs",
        badgeColors[applicationStatus],
        className
      )}>
        <span className="flex items-center">
          {content.icon && (
            <span className="mr-1">
              {content.icon}
            </span>
          )}
          {content.text}
        </span>
      </Badge>
    )
  }

  // Button variant
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-9 w-9 p-0'
  }

  return (
    <Button
      variant={content.variant}
      size={size}
      className={cn(
        sizeClasses[size],
        content.className,
        className
      )}
      onClick={handleClick}
      disabled={content.disabled}
    >
      {size !== 'icon' && (
        <>
          {content.icon}
          {content.text}
        </>
      )}
      {size === 'icon' && content.icon}
    </Button>
  )
}

// Quick status check function for use in job cards
export function getApplicationStatusBadge(status: ApplicationStatus | null, lang: string = 'en') {
  if (!status) return null

  const dict = getDictionary(lang)
  const statusTexts = dict?.features?.profile?.applicationStatus || {}

  const statusConfig = {
    pending: {
      text: statusTexts.applied || 'Applied',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      icon: <Clock3 className="w-3 h-3" />
    },
    reviewing: {
      text: statusTexts.review || 'Review',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      icon: <Eye className="w-3 h-3" />
    },
    interviewed: {
      text: statusTexts.interview || 'Interview',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
      icon: <UserCheck className="w-3 h-3" />
    },
    accepted: {
      text: statusTexts.acceptedShort || 'Accepted',
      className: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      icon: <CheckCircle className="w-3 h-3" />
    },
    rejected: {
      text: statusTexts.rejectedShort || 'Rejected',
      className: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      icon: <XCircle className="w-3 h-3" />
    }
  }

  const config = statusConfig[status]
  return (
    <Badge className={cn("text-xs flex items-center gap-1", config.className)}>
      {config.icon}
      {config.text}
    </Badge>
  )
}