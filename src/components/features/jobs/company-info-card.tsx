import { Building2, ExternalLink, Send, MapPin, Tag} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Company } from "@/types/job"
import { Badge } from "@/components/ui/badge"

interface CompanyContactCardProps {
  company: Company
}

export function CompanyInfoCard({ company }: CompanyContactCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Header */}
        <div className="flex items-center gap-3">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-emerald-600 dark:text-emerald-300 text-lg font-semibold">
              {company.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          
          {/* Company Name */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {company.name}
            </h3>
            {company.niche && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {company.niche}
              </p>
            )}
          </div>
        </div>

        {/* Company Description */}
        {company.description && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
              About the Company
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {company.description}
            </p>
          </div>
        )}
        {/* Company Address */}
        {company.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Address</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{company.address}</p>
            </div>
          </div>
        )}
        {/* Industry Niche */}
        {company.niche && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Industry</h4>
              <Badge variant="secondary" className="mt-1">
                {company.niche}
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(company.website, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Company Website
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}