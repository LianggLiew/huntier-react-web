'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSidebar } from './ProfileSidebar';
import { getFullName } from '@/utils/profileUtils';

interface SavedJobsTabProps {
  currentUserData: any;
  profile: any;
  profileImage: string;
  dictionary: any;
  onPersonalInfoEdit: () => void;
  onProfileImageSave: (imageData: string) => void;
  onDownloadCV: () => void;
  onUploadCV: () => void;
}

export function SavedJobsTab({
  currentUserData,
  profile,
  profileImage,
  dictionary,
  onPersonalInfoEdit,
  onProfileImageSave,
  onDownloadCV,
  onUploadCV,
}: SavedJobsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Same as Profile */}
      <ProfileSidebar
        name={getFullName(currentUserData.firstName, currentUserData.lastName)}
        title={currentUserData.title}
        location={currentUserData.location}
        nationality={profile?.nationality}
        dateOfBirth={profile?.dateOfBirth}
        education={profile?.highestDegree}
        major={profile?.major}
        profileImage={profile?.avatarUrl || profileImage}
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

      {/* Main Content - Saved Jobs */}
      <div className="lg:col-span-3">
        {/* Tab Bar positioned here */}
        <div className="flex justify-start mb-6">
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

        <h2 className="text-2xl font-bold text-white mb-6">{dictionary.profile.savedJobs}</h2>
        <div className="space-y-4">
          {currentUserData.savedJobs.map((job: any, index: number) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{job.company}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>📍 {job.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-600 text-white mb-2">
                    ⭐ {job.match}% Match
                  </Badge>
                  <div className="text-gray-500 text-sm">
                    Posted {job.postedDate}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                  {dictionary.profile.buttons.viewJob}
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {dictionary.profile.buttons.applyNow}
                </Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:text-red-300 hover:border-red-400 ml-auto">
                  {dictionary.profile.buttons.remove}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}