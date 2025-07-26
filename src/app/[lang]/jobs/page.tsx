import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { JobListing } from "@/components/features/jobs/job-listing"
import { getDictionary } from "@/lib/dictionary"
import { JobListingContainer } from "@/components/features/jobs/job-listing-container"

interface JobsPageProps {
  params: Promise<{ lang: string }> | { lang: string }
}

export default async function JobsPage({ params }: JobsPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const lang = resolvedParams.lang
  const dictionary = getDictionary(lang)

  return (
    <NavigationSidebar>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <JobListingContainer 
          lang={lang}
          title={dictionary?.jobs?.title || 'Job Opportunities'}
          subtitle={dictionary?.jobs?.subtitle || 'Discover your next career opportunity with AI-powered matching'}
        />
      </div>
    </NavigationSidebar>
  )
}