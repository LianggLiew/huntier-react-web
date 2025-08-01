'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, X } from 'lucide-react';
import PersonalInfoForm, { type PersonalInfo as OnboardingPersonalInfo } from '@/components/features/onboarding/PersonalInfoForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}


export function PersonalInfoModal({ isOpen, onClose, onSave }: PersonalInfoModalProps) {
  const { user, profile, updateProfile} = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<OnboardingPersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    phone: '',
    email: '',
    education: '',
    major: ''
  });

  // Update form when user/profile data changes
  useEffect(() => {
    if (isOpen && (profile || user)) {
      setPersonalInfo({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        dateOfBirth: profile?.dateOfBirth || '',
        nationality: profile?.nationality || '',
        phone: user?.phone || '',
        email: user?.email || '',
        education: profile?.highestDegree || '',
        major: profile?.major || ''
      });
    }
  }, [isOpen, profile, user]);

  const updatePersonalInfo = (field: keyof OnboardingPersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  // Check if personal info form is complete (for button state)
  const isPersonalInfoComplete = (): boolean => {
    const requiredFields: (keyof OnboardingPersonalInfo)[] = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality', 'education', 'major'
    ];
    
    // Check if email or phone is provided (one is required)
    const hasContact = Boolean((user?.email || personalInfo.email) || (user?.phone || personalInfo.phone));
    
    const missingFields = requiredFields.filter(field => !personalInfo[field]);
    
    return missingFields.length === 0 && hasContact;
  };

  const handleSave = async () => {
    if (!isPersonalInfoComplete()) {
      toast({
        title: "Please complete all required fields",
        description: "All fields are required to save your personal information",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save personal info to profile
      await updateProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        dateOfBirth: personalInfo.dateOfBirth,
        nationality: personalInfo.nationality,
        major: personalInfo.major,
        highestDegree: personalInfo.education
      });

      toast({
        title: "Personal information updated",
        description: "Your profile has been updated successfully"
      });

      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save personal info:', error);
      toast({
        title: "Error saving information",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Reset form when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-800/50 shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Edit Personal Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <PersonalInfoForm 
            personalInfo={personalInfo}
            onUpdate={updatePersonalInfo}
            user={user ? { email: user.email, phone: user.phone } : undefined}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              disabled={isLoading}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className={`flex-1 font-medium transition-all duration-300 shadow-lg ${
                isPersonalInfoComplete() && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              disabled={isLoading || !isPersonalInfoComplete()}
            >
              <Save size={16} className="mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}