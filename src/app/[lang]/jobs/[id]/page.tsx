import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { JobDetail } from "@/components/features/jobs/job-detail"
import { getDictionaryAsync } from "@/lib/dictionary"

interface JobDetailPageProps {
  params: Promise<{ lang: string; id: string }> | { lang: string; id: string }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const resolvedParams = await params
  const { lang, id } = resolvedParams
  const dictionary = await getDictionaryAsync(lang)

  return (
    <NavigationSidebar>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <JobDetail jobId={id} lang={lang} />
        </div>
      </div>
    </NavigationSidebar>
  )
}