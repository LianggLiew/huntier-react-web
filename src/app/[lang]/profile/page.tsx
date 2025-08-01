'use client';

import { useState, useEffect, useRef } from 'react';  
import { getDictionaryAsync } from '@/lib/dictionary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoModal } from '@/components/features/profile/PersonalInfoModal';
import { ProfileTab } from '@/components/features/profile/ProfileTab';
import { ApplicationsTab } from '@/components/features/profile/ApplicationsTab';
import { SavedJobsTab } from '@/components/features/profile/SavedJobsTab';
import { NavigationSidebar } from '@/components/ui/navigation-sidebar';
import { ToastProvider, useToast } from '@/components/ui/toast-provider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useResumeUpload } from '@/hooks/useResumeUpload';
import { useProfileAPI } from '@/hooks/useProfileAPI';
import { getFullName, transformProfileForUI } from '@/utils/profileUtils';
import { emptyStateTemplates } from '@/utils/profileConfig';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


function ProfilePageContent({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const { user, profile, loading: authLoading, refreshUser } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [dictionary, setDictionary] = useState<any>({});
  const [dictionaryLoading, setDictionaryLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [profileImage, setProfileImage] = useLocalStorage('userProfileImage', '');
  const { showToast } = useToast();
  const { saveProfile, isLoading: apiLoading } = useProfileAPI();
  
  // Resume upload hook
  const { triggerFileSelect, handleFileSelect, isUploading, fileInputRef } = useResumeUpload({
    onSuccess: async () => {
      await refreshUser(); // Refresh profile data after successful upload
    }
  });

  // Handle initialization
  useEffect(() => {
    const initializeComponent = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
      
      // Load dictionary
      setDictionaryLoading(true);
      try {
        const dict = await getDictionaryAsync(resolvedParams.lang);
        setDictionary(dict);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        setDictionary({});
      } finally {
        setDictionaryLoading(false);
      }
      
      setIsHydrated(true);
    };
    
    initializeComponent();
  }, [params]);

  // Refresh profile data when needed
  const refreshProfileData = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      setProfileError('Failed to load profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  // Dictionary is now loaded in useEffect

  const handleAboutSave = async (about: string) => {
    await saveProfile({ section: 'about', data: about, dictionary });
  };

  const handleExperienceSave = async (experience: any[]) => {
    await saveProfile({ section: 'experience', data: experience, dictionary });
  };

  const handleEducationSave = async (education: any[]) => {
    await saveProfile({ section: 'education', data: education, dictionary });
  };

  const handleSkillsSave = async (skills: any[]) => {
    await saveProfile({ section: 'skills', data: skills, dictionary });
  };

  const handleCertificationsSave = async (certifications: any[]) => {
    await saveProfile({ section: 'certifications', data: certifications, dictionary });
  };

  const handleProjectsSave = async (projects: any[]) => {
    await saveProfile({ section: 'projects', data: projects, dictionary });
  };

  const handlePersonalInfoSave = async (personalInfo: { firstName: string; lastName: string; title: string; location: string }) => {
    await saveProfile({ section: 'personalInfo', data: personalInfo, dictionary });
  };

  const handleProfileImageSave = (imageData: string) => {
    setProfileImage(imageData);
    showToast({
      type: 'success',
      title: dictionary.profile.toast.profilePictureUpdated,
      description: dictionary.profile.toast.profilePictureDescription
    });
  };

  const handleUploadCV = () => {
    triggerFileSelect();
  };

  const handleDownloadCV = async () => {
    // Check if user has resume before making API call
    if (!profile?.resumeFileUrl) {
      showToast({
        type: 'info',
        title: 'No Resume Found',
        description: 'You haven\'t uploaded a resume yet. Please upload one first.'
      });
      return;
    }

    try {
      setProfileLoading(true);
      
      const response = await fetch('/api/resume/download', {
        method: 'GET',
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = result.data.fileUrl;
        link.download = result.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast({
          type: 'success',
          title: 'CV Downloaded',
          description: `${result.data.fileName} has been downloaded successfully.`
        });
      } else if (response.status === 404) {
        showToast({
          type: 'info',
          title: 'No Resume Found',
          description: 'You haven\'t uploaded a resume yet. Please upload one first.'
        });
      } else {
        throw new Error(result.error || 'Failed to download resume');
      }
    } catch (error) {
      console.error('Failed to download CV:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        description: 'Unable to download your resume. Please try again later.'
      });
    } finally {
      setProfileLoading(false);
    }
  };
  // Show loading state during hydration, dictionary loading, or auth loading
  if (!isHydrated || authLoading || dictionaryLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Please log in to view your profile.</div>
      </div>
    );
  }

  // Transform profile data for UI consumption using utility function
  const currentUserData = transformProfileForUI(profile, emptyStateTemplates);

  return (
    <NavigationSidebar>
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto py-4 px-4 max-w-6xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsContent value="profile" className="space-y-0">
            <ProfileTab
              currentUserData={currentUserData}
              profile={profile}
              profileImage={profileImage}
              dictionary={dictionary}
              onPersonalInfoEdit={() => setIsPersonalInfoModalOpen(true)}
              onProfileImageSave={handleProfileImageSave}
              onDownloadCV={handleDownloadCV}
              onUploadCV={handleUploadCV}
              onAboutSave={handleAboutSave}
              onExperienceSave={handleExperienceSave}
              onEducationSave={handleEducationSave}
              onSkillsSave={handleSkillsSave}
              onCertificationsSave={handleCertificationsSave}
              onProjectsSave={handleProjectsSave}
            />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsTab
              currentUserData={currentUserData}
              profile={profile}
              profileImage={profileImage}
              dictionary={dictionary}
              onPersonalInfoEdit={() => setIsPersonalInfoModalOpen(true)}
              onProfileImageSave={handleProfileImageSave}
              onDownloadCV={handleDownloadCV}
              onUploadCV={handleUploadCV}
            />
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedJobsTab
              currentUserData={currentUserData}
              profile={profile}
              profileImage={profileImage}
              dictionary={dictionary}
              onPersonalInfoEdit={() => setIsPersonalInfoModalOpen(true)}
              onProfileImageSave={handleProfileImageSave}
              onDownloadCV={handleDownloadCV}
              onUploadCV={handleUploadCV}
            />
          </TabsContent>
        </Tabs>
        
        {/* Personal Info Modal */}
        <PersonalInfoModal
          isOpen={isPersonalInfoModalOpen}
          onClose={() => setIsPersonalInfoModalOpen(false)}
          onSave={() => {
            // Refresh the profile data after save
            refreshUser();
          }}
        />
        
        {/* Hidden file input for resume upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        </div>
      </div>
    </NavigationSidebar>
  );
}

export default function ProfilePage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <ToastProvider>
        <ProfilePageContent params={params} />
      </ToastProvider>
    </ProtectedRoute>
  );
}