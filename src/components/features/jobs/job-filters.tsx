'use client'

import { JobFilters } from "@/types/job"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { 
  Filter, 
  X 
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface JobFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  onClearFilters: () => void
  onClose?: () => void
}

export function JobFiltersPanel({ filters, onFiltersChange, onClearFilters, onClose }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<JobFilters>(filters)

  // Sync local filters when external filters change (e.g., when cleared)
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'intern', label: 'Intern' },
    { value: 'remote', label: 'Remote' }
  ] as const


  const categories = [
    'Enterprise Software',
    'Design & UX',
    'AI/ML',
    'Mobile Development',
    'Cloud Computing',
    'Data Analytics',
    'QA/Testing'
  ]

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleTypeChange = (type: 'full-time' | 'part-time' | 'intern' | 'remote', checked: boolean) => {
    const currentTypes = localFilters.type || []
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type)
    handleFilterChange('type', updatedTypes)
  }


  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategory = checked ? category : undefined
    handleFilterChange('category', updatedCategory)
  }

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <div className="w-full lg:w-80 lg:space-y-6 lg:fixed lg:top-44">
      <Card className="border-0 shadow-none max-h-none overflow-visible lg:border lg:shadow-sm lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto">
        <div className="hidden lg:block">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
                {onClose && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="space-y-4 lg:space-y-8 px-0 lg:px-6">
          {/* Clear all button for mobile */}
          <div className="lg:hidden">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={onClearFilters}
                className="w-full mb-4 lg:mb-8 h-10 lg:h-14 text-sm lg:text-lg font-medium"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                Clear All Filters
              </Button>
            )}
          </div>
          
          {/* Job Type */}
          <div className="space-y-3 lg:space-y-4">
            <Label className="text-sm lg:text-sm font-medium lg:font-medium">Job Type</Label>
            <div className="space-y-2 lg:space-y-3">
              {jobTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3 lg:space-x-3">
                  <Checkbox
                    id={type.value}
                    checked={localFilters.type?.includes(type.value) || false}
                    onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                    className="h-5 w-5 lg:h-4 lg:w-4"
                  />
                  <Label 
                    htmlFor={type.value} 
                    className="text-sm lg:text-sm cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Salary Range */}
          <div className="space-y-3 lg:space-y-4">
            <Label className="text-sm lg:text-sm font-medium lg:font-medium">Salary Range (USD)</Label>
            <div className="px-2 lg:px-2">
              <Slider
                value={[localFilters.salaryRange?.min || 0, localFilters.salaryRange?.max || 200000]}
                max={200000}
                min={0}
                step={5000}
                className="w-full"
                onValueChange={(value) => 
                  handleFilterChange('salaryRange', { min: value[0], max: value[1] })
                }
              />
              <div className="flex justify-between text-gray-500 mt-2 lg:mt-2 text-xs lg:text-xs">
                <span>${(localFilters.salaryRange?.min || 0).toLocaleString()}</span>
                <span>${(localFilters.salaryRange?.max || 200000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3 lg:space-y-4">
            <Label className="text-sm lg:text-sm font-medium lg:font-medium">Categories</Label>
            <div className="space-y-2 lg:space-y-3 overflow-y-auto max-h-40 lg:max-h-48">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3 lg:space-x-3">
                  <Checkbox
                    id={category}
                    checked={localFilters.category === category || false}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    className="h-5 w-5 lg:h-4 lg:w-4"
                  />
                  <Label 
                    htmlFor={category} 
                    className="cursor-pointer text-sm lg:text-sm"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Apply button for mobile */}
          <div className="lg:hidden pt-4 lg:pt-6">
            <Button 
              onClick={onClose}
              className="w-full h-10 lg:h-14 text-sm lg:text-lg font-semibold"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}