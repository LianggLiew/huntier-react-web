'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSidebar } from './ProfileSidebar';
import { getFullName } from '@/utils/profileUtils';

interface ApplicationsTabProps {
  currentUserData: any;
  profile: any;
  profileImage: string;
  dictionary: any;
  onPersonalInfoEdit: () => void;
  onProfileImageSave: (imageData: string) => void;
  onDownloadCV: () => void;
  onUploadCV: () => void;
}

export function ApplicationsTab({
  currentUserData,
  profile,
  profileImage,
  dictionary,
  onPersonalInfoEdit,
  onProfileImageSave,
  onDownloadCV,
  onUploadCV,
}: ApplicationsTabProps) {
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

      {/* Main Content - Job Applications */}
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

        <h2 className="text-2xl font-bold text-white mb-6">{dictionary.profile.jobApplications}</h2>
        <div className="space-y-4">
          {currentUserData.applications.map((app: any, index: number) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{app.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{app.company}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>📍 {app.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${app.statusColor} text-white mb-2`}>{app.status}</Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>📅 Applied on {app.appliedDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                  {dictionary.profile.buttons.viewApplication}
                </Button>
                {app.status !== 'Rejected' && (
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    {dictionary.profile.buttons.withdraw}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}