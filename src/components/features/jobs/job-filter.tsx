"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type FilterOption = {
  id: string
  label: string
}

type FilterSection = {
  title: string
  options: FilterOption[]
}

const jobTypeFilters: FilterOption[] = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
]

const experienceFilters: FilterOption[] = [
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "executive", label: "Executive" },
]

const remoteFilters: FilterOption[] = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "On-site" },
]

export function JobFilter() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({})
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200])

  const handleFilterChange = (id: string, checked: boolean) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const handleSalaryChange = (value: number[]) => {
    setSalaryRange([value[0], value[1]])
  }

  const clearFilters = () => {
    setSelectedFilters({})
    setSalaryRange([0, 200])
  }

  const renderFilterSection = (section: FilterSection) => (
    <div>
      <h3 className="font-medium mb-2">{section.title}</h3>
      <div className="space-y-2">
        {section.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedFilters[option.id] || false}
              onCheckedChange={(checked) => handleFilterChange(option.id, checked as boolean)}
            />
            <Label htmlFor={option.id} className="text-sm cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button variant="ghost" size="sm" className="h-8 text-emerald-600" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {renderFilterSection({ title: "Job Type", options: jobTypeFilters })}
        {renderFilterSection({ title: "Experience Level", options: experienceFilters })}

        <div>
          <h3 className="font-medium mb-2">Salary Range (K)</h3>
          <div className="pt-4 px-2">
            <Slider
              defaultValue={[0, 200]}
              max={200}
              step={5}
              value={[salaryRange[0], salaryRange[1]]}
              onValueChange={handleSalaryChange}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${salaryRange[0]}K</span>
              <span>
                ${salaryRange[1]}K{salaryRange[1] === 200 ? "+" : ""}
              </span>
            </div>
          </div>
        </div>

        {renderFilterSection({ title: "Remote Options", options: remoteFilters })}
      </div>
    </div>
  )
}
