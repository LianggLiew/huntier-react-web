'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from 'lucide-react'

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  phone: string
  email: string
  education: string
  major: string
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo
  onUpdate: (field: keyof PersonalInfo, value: string) => void
  user?: {
    email?: string | null
    phone?: string | null
  }
  lang?: string
}

export default function PersonalInfoForm({ personalInfo, onUpdate, user }: PersonalInfoFormProps) {
  return (
    <Card className="p-6 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-800/50 shadow-xl">
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="absolute -inset-3 bg-emerald-500/10 rounded-full blur-lg"></div>
          <User className="relative h-12 w-12 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">Personal Information</h2>
        <p className="text-sm text-muted-foreground">Please fill in your details to create your profile</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            placeholder="Enter your first name"
            className="border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            placeholder="Enter your last name"
            className="border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
            className="border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nationality *</Label>
          <Input
            id="nationality"
            value={personalInfo.nationality}
            onChange={(e) => onUpdate('nationality', e.target.value)}
            placeholder="Enter your nationality"
            className="border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number * {user?.phone && <span className="text-emerald-600 text-xs">(verified)</span>}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={user?.phone || personalInfo.phone}
            onChange={(e) => !user?.phone && onUpdate('phone', e.target.value)}
            placeholder={user?.phone ? "Verified during signup" : "Enter your phone number"}
            disabled={!!user?.phone}
            className={`border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10 ${
              user?.phone 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-emerald-50/30 dark:bg-emerald-900/10'
            }`}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email * {user?.email && <span className="text-emerald-600 text-xs">(verified)</span>}
          </Label>
          <Input
            id="email"
            type="email"
            value={user?.email || personalInfo.email}
            onChange={(e) => !user?.email && onUpdate('email', e.target.value)}
            placeholder={user?.email ? "Verified during signup" : "Enter your email"}
            disabled={!!user?.email}
            className={`border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10 ${
              user?.email 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-emerald-50/30 dark:bg-emerald-900/10'
            }`}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="education" className="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Education Degree *</Label>
          <Select value={personalInfo.education} onValueChange={(value) => onUpdate('education', value)}>
            <SelectTrigger className="border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10">
              <SelectValue placeholder="Select your highest education degree" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-emerald-100 dark:border-emerald-800/50 rounded-xl">
              <SelectItem value="High-school" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">High School</SelectItem>
              <SelectItem value="Associate" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Associate Degree</SelectItem>
              <SelectItem value="Bachelor" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Bachelor's Degree</SelectItem>
              <SelectItem value="Master" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Master's Degree</SelectItem>
              <SelectItem value="PhD" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">PhD</SelectItem>
              <SelectItem value="Other" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="major" className="text-sm font-medium text-gray-700 dark:text-gray-300">Major/Field of Study *</Label>
          <Input
            id="major"
            value={personalInfo.major}
            onChange={(e) => onUpdate('major', e.target.value)}
            placeholder="Enter your major or field of study"
            className="border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:shadow-emerald-500/10"
          />
        </div>
      </div>
    </Card>
  )
}