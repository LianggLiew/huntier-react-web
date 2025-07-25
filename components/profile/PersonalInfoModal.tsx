'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Briefcase, MapPin, Save, X } from 'lucide-react';

interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  availability: string;
}

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInfo: PersonalInfo;
  onSave: (info: PersonalInfo) => void;
}

const availabilityOptions = [
  'Open to Remote',
  'Open to Hybrid',
  'Office Only',
  'Fully Remote',
  'Open to Work',
  'Not Available',
  'Available Immediately',
  'Available in 2 weeks',
  'Available in 1 month'
];

export function PersonalInfoModal({ isOpen, onClose, initialInfo, onSave }: PersonalInfoModalProps) {
  const [info, setInfo] = useState<PersonalInfo>(initialInfo);
  const [errors, setErrors] = useState<Partial<PersonalInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalInfo> = {};
    
    if (!info.name.trim()) newErrors.name = 'Name is required';
    if (!info.title.trim()) newErrors.title = 'Job title is required';
    if (!info.location.trim()) newErrors.location = 'Location is required';
    if (!info.availability) newErrors.availability = 'Availability status is required';
    
    if (info.name.length > 50) newErrors.name = 'Name must be less than 50 characters';
    if (info.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    if (info.location.length > 100) newErrors.location = 'Location must be less than 100 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(info);
      onClose();
      setErrors({});
    }
  };

  const handleCancel = () => {
    setInfo(initialInfo);
    setErrors({});
    onClose();
  };

  const updateField = (field: keyof PersonalInfo, value: string) => {
    setInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Reset form when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setInfo(initialInfo);
      setErrors({});
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Edit Personal Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={14} className="text-emerald-500" />
              Full Name
            </label>
            <Input
              value={info.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter your full name"
              className={`bg-gray-800 border-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
          </div>

          {/* Job Title Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Briefcase size={14} className="text-emerald-500" />
              Job Title
            </label>
            <Input
              value={info.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className={`bg-gray-800 border-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MapPin size={14} className="text-emerald-500" />
              Location
            </label>
            <Input
              value={info.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className={`bg-gray-800 border-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                errors.location ? 'border-red-500' : ''
              }`}
            />
            {errors.location && <p className="text-red-400 text-xs">{errors.location}</p>}
          </div>

          {/* Availability Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Availability Status
            </label>
            <Select value={info.availability} onValueChange={(value) => updateField('availability', value)}>
              <SelectTrigger className={`bg-gray-800 border-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                errors.availability ? 'border-red-500' : ''
              }`}>
                <SelectValue placeholder="Select availability status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-gray-300 focus:bg-gray-700">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.availability && <p className="text-red-400 text-xs">{errors.availability}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}