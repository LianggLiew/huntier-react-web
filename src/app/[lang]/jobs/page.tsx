'use client'

import { useState, useEffect } from 'react'
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { JobListing } from "@/components/features/jobs/job-listing"
import { getDictionaryAsync } from "@/lib/dictionary"
import { JobListingContainer } from "@/components/features/jobs/job-listing-container"
import { Navbar } from "@/components/layout/navbar"

interface JobsPageProps {
  params: Promise<{ lang: string }> | { lang: string }
}

export default function JobsPage({ params }: JobsPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ lang: string } | null>(null)
  const [dictionary, setDictionary] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await Promise.resolve(params)
      setResolvedParams(resolved)
      
      const dict = await getDictionaryAsync(resolved.lang)
      setDictionary(dict)
    }
    resolveParams()
  }, [params])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  if (!resolvedParams || !dictionary) {
    return <div>Loading...</div>
  }

  return (
    <>
      <NavigationSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      >
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <JobListingContainer 
            lang={resolvedParams.lang}
            title={dictionary?.jobs?.title || 'Job Opportunities'}
            subtitle={dictionary?.jobs?.subtitle || 'Discover your next career opportunity with AI-powered matching'}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </NavigationSidebar>
    </>
  )
}