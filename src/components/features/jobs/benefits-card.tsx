import { Heart, Banknote, Clock, GraduationCap, Home, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BenefitsCardProps {
  benefits: string[]
}

export function BenefitsCard({ benefits }: BenefitsCardProps) {
  // Categorize benefits with icons
  const getBenefitIcon = (benefit: string) => {
    const lowerBenefit = benefit.toLowerCase()
    
    if (lowerBenefit.includes('health') || lowerBenefit.includes('medical') || lowerBenefit.includes('dental')) {
      return <Heart className="w-4 h-4 text-red-500" />
    }
    if (lowerBenefit.includes('401k') || lowerBenefit.includes('retirement') || lowerBenefit.includes('stock') || lowerBenefit.includes('bonus')) {
      return <Banknote className="w-4 h-4 text-green-500" />
    }
    if (lowerBenefit.includes('remote') || lowerBenefit.includes('work from home') || lowerBenefit.includes('hybrid')) {
      return <Home className="w-4 h-4 text-blue-500" />
    }
    if (lowerBenefit.includes('flexible') || lowerBenefit.includes('pto') || lowerBenefit.includes('vacation') || lowerBenefit.includes('time off')) {
      return <Clock className="w-4 h-4 text-purple-500" />
    }
    if (lowerBenefit.includes('learning') || lowerBenefit.includes('education') || lowerBenefit.includes('training') || lowerBenefit.includes('conference')) {
      return <GraduationCap className="w-4 h-4 text-orange-500" />
    }
    if (lowerBenefit.includes('insurance') || lowerBenefit.includes('coverage')) {
      return <Shield className="w-4 h-4 text-indigo-500" />
    }
    
    return <Heart className="w-4 h-4 text-gray-400" />
  }

  const getBenefitCategory = (benefit: string) => {
    const lowerBenefit = benefit.toLowerCase()
    
    if (lowerBenefit.includes('health') || lowerBenefit.includes('medical') || lowerBenefit.includes('dental') || lowerBenefit.includes('insurance')) {
      return 'Health & Wellness'
    }
    if (lowerBenefit.includes('401k') || lowerBenefit.includes('retirement') || lowerBenefit.includes('stock') || lowerBenefit.includes('bonus')) {
      return 'Financial'
    }
    if (lowerBenefit.includes('remote') || lowerBenefit.includes('work from home') || lowerBenefit.includes('hybrid')) {
      return 'Work-Life Balance'
    }
    if (lowerBenefit.includes('flexible') || lowerBenefit.includes('pto') || lowerBenefit.includes('vacation') || lowerBenefit.includes('time off')) {
      return 'Time Off'
    }
    if (lowerBenefit.includes('learning') || lowerBenefit.includes('education') || lowerBenefit.includes('training') || lowerBenefit.includes('conference')) {
      return 'Professional Development'
    }
    
    return 'Other Benefits'
  }

  // Group benefits by category
  const groupedBenefits = benefits.reduce((acc, benefit) => {
    const category = getBenefitCategory(benefit)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(benefit)
    return acc
  }, {} as Record<string, string[]>)

  if (!benefits || benefits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Benefits & Perks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No benefits information available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Benefits & Perks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedBenefits).map(([category, categoryBenefits]) => (
          <div key={category}>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
              {category}
            </h4>
            <div className="space-y-2">
              {categoryBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  {getBenefitIcon(benefit)}
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}