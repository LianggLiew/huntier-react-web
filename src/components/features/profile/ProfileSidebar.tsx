'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Download, Upload, ChevronDown } from 'lucide-react';
import { ProfilePictureUpload } from './ProfilePictureUpload';

interface CompletionItem {
  name: string;
  completed: boolean;
  note?: string;
}

interface JobPreferences {
  jobTypes: string;
  locations: string;
  desiredSalary?: string;
  industries?: string;
  remoteOptions?: string;
}

interface ProfileSidebarProps {
  // User data
  name: string;
  title?: string;
  location?: string;
  profileImage: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  education?: string;
  major?: string;
  
  // Progress data
  profileCompletion: number;
  completionItems: CompletionItem[];
  
  // Job preferences
  jobPreferences: JobPreferences;
  
  // Event handlers
  onEditClick: () => void;
  onProfileImageSave: (imageData: string) => void;
  onDownloadCV?: () => void;
  onUploadCV?: () => void;
  hasResume?: boolean;
  
  // Language support
  dictionary?: any;
}

export function ProfileSidebar({
  name,
  profileImage,
  nationality,
  education,
  major,
  profileCompletion,
  completionItems,
  onEditClick,
  onProfileImageSave,
  onDownloadCV,
  onUploadCV,
  hasResume,
  dictionary
}: ProfileSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Profile Card */}
      <Card className="bg-gray-900 border-gray-800">
        <div className="p-4 flex flex-col items-center text-center">
          <ProfilePictureUpload
            currentImage={profileImage}
            userName={name}
            onImageSave={onProfileImageSave}
          />
          <h1 className="text-xl font-bold text-white mb-1 pt-3">{name}</h1>
          
          {/* Personal Information */}
          {(nationality || education || major) && (
            <div className="w-full mb-3 text-left">
              {nationality && (
                <div className="mb-1">
                  <span className="text-xs text-gray-400">{dictionary?.profile?.sidebar?.nationality || 'Nationality:'}</span>
                  <span className="text-sm text-gray-300 ml-2">{nationality}</span>
                </div>
              )}
              {education && (
                <div className="mb-1">
                  <span className="text-xs text-gray-400">{dictionary?.profile?.sidebar?.education || 'Education:'}</span>
                  <span className="text-sm text-gray-300 ml-2">{education}</span>
                </div>
              )}
              {major && (
                <div className="mb-1">
                  <span className="text-xs text-gray-400">{dictionary?.profile?.sidebar?.major || 'Major:'}</span>
                  <span className="text-sm text-gray-300 ml-2">{major}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2 w-full">
            <Button 
              size="sm" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 text-xs px-1"
              onClick={onEditClick}
            >
              <Edit size={12} className="mr-1" />
              {dictionary?.profile?.buttons?.edit || 'Edit'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1"
                >
                  {dictionary?.profile?.sidebar?.resume || 'Resume'}
                  <ChevronDown size={12} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onUploadCV} className="cursor-pointer">
                  <Upload size={14} className="mr-2" />
                  {dictionary?.profile?.sidebar?.uploadResume || 'Upload Resume'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownloadCV} className="cursor-pointer">
                  <Download size={14} className="mr-2" />
                  {dictionary?.profile?.sidebar?.downloadResume || 'Download Resume'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Profile Completion */}
      <Card className="bg-gray-900 border-gray-800">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-white">{dictionary?.profile?.sidebar?.profileCompletion || 'Profile Completion'}</h2>
            <span className="text-emerald-400 text-sm font-semibold">{dictionary?.profile?.sidebar?.overall || 'Overall'}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-white">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2 mb-4 bg-gray-800" />
          <div className="space-y-2">
            {completionItems.map((item, index) => (
              <div key={index} className="flex items-center text-xs">
                <div className={`mr-2 h-3 w-3 rounded-full flex items-center justify-center ${item.completed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {item.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={item.completed ? 'text-gray-300' : 'text-gray-500'}>{item.name}</span>
                {item.note && <span className="ml-2 text-gray-500">{item.note}</span>}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Job Preferences */}
      {/* <Card className="bg-gray-900 border-gray-800">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-white mb-3">{dictionary?.profile?.sidebar?.jobPreferences || 'Job Preferences'}</h2>
          <div className="space-y-3 text-xs">
            <div>
              <h3 className="text-gray-400 mb-1">{dictionary?.profile?.sidebar?.jobTypes || 'Job Types'}</h3>
              <p className="text-gray-300">{jobPreferences.jobTypes}</p>
            </div>
            <div>
              <h3 className="text-gray-400 mb-1">{dictionary?.profile?.sidebar?.locations || 'Locations'}</h3>
              <p className="text-gray-300">{jobPreferences.locations}</p>
            </div>
            {jobPreferences.desiredSalary && (
              <div>
                <h3 className="text-gray-400 mb-1">{dictionary?.profile?.sidebar?.desiredSalary || 'Desired Salary'}</h3>
                <p className="text-gray-300">{jobPreferences.desiredSalary}</p>
              </div>
            )}
            {jobPreferences.industries && (
              <div>
                <h3 className="text-gray-400 mb-1">{dictionary?.profile?.sidebar?.industries || 'Industries'}</h3>
                <p className="text-gray-300">{jobPreferences.industries}</p>
              </div>
            )}
            {jobPreferences.remoteOptions && (
              <div>
                <h3 className="text-gray-400 mb-1">{dictionary?.profile?.sidebar?.remotePreference || 'Remote Preference'}</h3>
                <p className="text-gray-300">{jobPreferences.remoteOptions}</p>
              </div>
            )}
          </div>
        </div>
      </Card> */}
    </div>
  );
}