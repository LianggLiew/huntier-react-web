'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditableAbout } from './EditableAbout';
import { EditableExperience } from './EditableExperience';
import { EditableEducation } from './EditableEducation';
import { EditableSkills } from './EditableSkills';
import { EditableCertifications } from './EditableCertifications';
import { EditableProjects } from './EditableProjects';
import { ProfileSidebar } from './ProfileSidebar';
import { getFullName } from '@/utils/profileUtils';

interface ProfileTabProps {
  currentUserData: any;
  profile: any;
  profileImage: string;
  dictionary: any;
  onPersonalInfoEdit: () => void;
  onProfileImageSave: (imageData: string) => void;
  onDownloadCV: () => void;
  onUploadCV: () => void;
  onAboutSave: (about: string) => void;
  onExperienceSave: (experience: any[]) => void;
  onEducationSave: (education: any[]) => void;
  onSkillsSave: (skills: any[]) => void;
  onCertificationsSave: (certifications: any[]) => void;
  onProjectsSave: (projects: any[]) => void;
}

export function ProfileTab({
  currentUserData,
  profile,
  profileImage,
  dictionary,
  onPersonalInfoEdit,
  onProfileImageSave,
  onDownloadCV,
  onUploadCV,
  onAboutSave,
  onExperienceSave,
  onEducationSave,
  onSkillsSave,
  onCertificationsSave,
  onProjectsSave,
}: ProfileTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Profile Sidebar */}
      <ProfileSidebar
        name={getFullName(currentUserData.firstName, currentUserData.lastName)}
        title={currentUserData.title}
        location={currentUserData.location}
        nationality={profile?.nationality}
        dateOfBirth={profile?.dateOfBirth}
        education={profile?.highestDegree}
        major={profile?.major}
        profileImage={profile?.avatarUrl || (profile?.avatarUrl === null ? '' : profileImage)}
        profileCompletion={currentUserData.profileCompletion}
        completionItems={currentUserData.completionItems}
        jobPreferences={currentUserData.jobPreferences}
        onEditClick={onPersonalInfoEdit}
        onProfileImageSave={onProfileImageSave}
        onDownloadCV={onDownloadCV}
        onUploadCV={onUploadCV}
        hasResume={!!profile?.resumeFileUrl}
        dictionary={dictionary}
      />

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Tab Bar positioned here */}
        <div className="flex justify-start">
          <TabsList className="bg-gray-900 p-1 border border-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              {dictionary.profile.tabs.profile}
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              {dictionary.profile.tabs.applications}
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              {dictionary.profile.tabs.savedJobs}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* About Section */}
        <EditableAbout 
          initialAbout={currentUserData.about} 
          onSave={onAboutSave}
          dictionary={dictionary}
        />

        {/* Experience Section */}
        <EditableExperience 
          key={`experience-${profile?.experience?.length || 0}`}
          initialExperience={currentUserData.experience} 
          onSave={onExperienceSave}
          dictionary={dictionary}
        />

        {/* Education Section */}
        <EditableEducation 
          key={`education-${profile?.education?.length || 0}`}
          initialEducation={currentUserData.education} 
          onSave={onEducationSave}
          dictionary={dictionary}
        />

        {/* Skills Section */}
        <EditableSkills 
          key={`skills-${profile?.skills?.length || 0}`}
          initialSkills={currentUserData.skills} 
          onSave={onSkillsSave}
          dictionary={dictionary}
        />

        {/* Certifications Section */}
        <EditableCertifications 
          key={`certifications-${profile?.certifications?.length || 0}`}
          initialCertifications={currentUserData.certifications} 
          onSave={onCertificationsSave}
          dictionary={dictionary}
        />

        {/* Projects Section */}
        <EditableProjects 
          key={`projects-${profile?.projects?.length || 0}`}
          initialProjects={currentUserData.projects} 
          onSave={onProjectsSave}
          dictionary={dictionary}
        />
      </div>
    </div>
  );
}