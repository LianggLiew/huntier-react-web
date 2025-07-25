'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/dictionary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Edit, Download } from 'lucide-react';
import { EditableAbout } from '@/components/profile/EditableAbout';
import { EditableExperience } from '@/components/profile/EditableExperience';
import { EditableEducation } from '@/components/profile/EditableEducation';
import { EditableSkills } from '@/components/profile/EditableSkills';
import { EditableCertifications } from '@/components/profile/EditableCertifications';
import { EditableProjects } from '@/components/profile/EditableProjects';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';
import { PersonalInfoModal } from '@/components/profile/PersonalInfoModal';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { NavigationSidebar } from '@/components/ui/navigation-sidebar';
import { ToastProvider, useToast } from '@/components/ui/toast-provider';
import { useLocalStorage, loadProfileFromStorage } from '@/hooks/useLocalStorage';

// 模拟用户数据 
const userData = {
  name: 'Alex Johnson',
  title: 'Senior Frontend Developer',
  location: 'San Francisco, CA',
  availability: 'Open to Remote',
  about: 'Experienced frontend developer with a passion for creating user-friendly, accessible web applications. Skilled in React, TypeScript, and Next.js with focus on performance optimization and responsive design.',
  profileCompletion: 85,
  completionItems: [
    { name: 'Personal Information', completed: true },
    { name: 'Experience', completed: true },
    { name: 'Education', completed: true },
    { name: 'Skills', completed: true, note: '(1 more recommended)' },
    { name: 'Projects', completed: false, note: '(Missing)' },
    { name: 'References', completed: false, note: '(Missing)' },
  ],
  jobPreferences: {
    jobTypes: 'Full-time, Contract',
    locations: 'San Francisco, CA, Remote',
    desiredSalary: '$120K - $150K',
    industries: 'Technology, Finance, Healthcare',
    remoteOptions: 'Fully remote preferred',
  },
  experience: [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      period: 'Jan 2021 - Present',
      description: 'Lead the frontend development team in building modern web applications using React and TypeScript. Implemented performance optimizations that improved load times by 40%, and established coding standards for the team.',
    },
    {
      title: 'Frontend Developer',
      company: 'WebTech Solutions',
      period: 'Mar 2018 - Dec 2020',
      description: 'Developed responsive web applications for clients across various industries. Worked closely with designers and backend developers to implement features and ensure a seamless user experience.',
    },
    {
      title: 'Junior Web Developer',
      company: 'Digital Creations',
      period: 'Jun 2016 - Feb 2018',
      description: 'Started as an intern and grew into a full-time role. Assisted in building websites and web applications, focusing on HTML, CSS, and JavaScript implementation.',
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      period: '2014 - 2016',
    },
    {
      degree: 'Bachelor of Science in Web Development',
      institution: 'University of California, Berkeley',
      period: '2010 - 2014',
    },
  ],
  skills: [
    { name: 'React', proficiency: 95 },
    { name: 'TypeScript', proficiency: 90 },
    { name: 'Next.js', proficiency: 85 },
    { name: 'JavaScript', proficiency: 95 },
    { name: 'HTML/CSS', proficiency: 90 },
    { name: 'UI/UX Design', proficiency: 75 },
    { name: 'GraphQL', proficiency: 80 },
    { name: 'Node.js', proficiency: 70 },
    { name: 'Testing (Jest, Cypress)', proficiency: 80 },
    { name: 'Performance Optimization', proficiency: 85 },
  ],
  certifications: [
    {
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      year: '2022',
    },
    {
      name: 'Professional React Developer',
      issuer: 'React Training',
      year: '2021',
    },
    {
      name: 'Advanced JavaScript',
      issuer: 'Frontend Masters',
      year: '2020',
    },
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      description: 'Led the frontend development of a modern e-commerce platform with advanced filtering, real-time inventory updates, and optimized mobile experience. Resulted in a 30% increase in mobile conversions.',
      technologies: ['React', 'Next.js', 'Redux', 'Stripe'],
    },
    {
      name: 'Healthcare Dashboard',
      description: 'Designed and implemented an analytics dashboard for healthcare providers to track patient data and outcomes. Featured interactive charts and accessibility-first design.',
      technologies: ['TypeScript', 'React', 'D3.js', 'Firebase'],
    },
  ],
  applications: [
    {
      title: 'Frontend Tech Lead',
      company: 'InnovateX',
      location: 'Remote',
      status: 'In Review',
      statusColor: 'bg-green-500',
      appliedDate: 'May 1, 2023',
    },
    {
      title: 'Senior UI Developer',
      company: 'Creative Solutions',
      location: 'San Francisco, CA',
      status: 'Interview Scheduled',
      statusColor: 'bg-blue-500',
      appliedDate: 'Apr 25, 2023',
    },
    {
      title: 'JavaScript Engineer',
      company: 'WebApps Inc.',
      location: 'Austin, TX (Remote)',
      status: 'Rejected',
      statusColor: 'bg-red-500',
      appliedDate: 'Apr 20, 2023',
    },
  ],
  savedJobs: [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      match: 95,
      postedDate: '2 days ago',
    },
    {
      title: 'React Developer',
      company: 'AppBuilders Inc.',
      location: 'Remote',
      match: 92,
      postedDate: '1 week ago',
    },
    {
      title: 'UI Engineer',
      company: 'DesignWorks',
      location: 'New York, NY (Remote)',
      match: 89,
      postedDate: '3 days ago',
    },
  ],
};

function ProfilePageContent({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const [userState, setUserState] = useState(userData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [lang, setLang] = useState('en');
  
  const [profileImage, setProfileImage] = useLocalStorage('userProfileImage', '');
  const { showToast } = useToast();

  // Handle hydration and load from localStorage
  useEffect(() => {
    const initializeComponent = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
      
      if (typeof window !== 'undefined') {
        const stored = loadProfileFromStorage();
        if (stored) {
          setUserState(prev => ({
            ...prev,
            ...(stored?.profileData || {}),
            ...(stored?.personalInfo ? {
              name: stored.personalInfo.name,
              title: stored.personalInfo.title,
              location: stored.personalInfo.location,
              availability: stored.personalInfo.availability,
            } : {})
          }));
        }
        setIsHydrated(true);
      }
    };
    
    initializeComponent();
  }, [params]);

  const dictionary = getDictionary(lang);

  const handleAboutSave = (about: string) => {
    const newState = { ...userState, about };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.aboutUpdated,
      description: dictionary.profile.toast.aboutDescription
    });
  };

  const handleExperienceSave = (experience: typeof userData.experience) => {
    const newState = { ...userState, experience };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.experienceUpdated,
      description: dictionary.profile.toast.experienceDescription
    });
  };

  const handleEducationSave = (education: typeof userData.education) => {
    const newState = { ...userState, education };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.educationUpdated,
      description: dictionary.profile.toast.educationDescription
    });
  };

  const handleSkillsSave = (skills: typeof userData.skills) => {
    const newState = { ...userState, skills };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.skillsUpdated,
      description: dictionary.profile.toast.skillsDescription
    });
  };

  const handleCertificationsSave = (certifications: typeof userData.certifications) => {
    const newState = { ...userState, certifications };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.certificationsUpdated,
      description: dictionary.profile.toast.certificationsDescription
    });
  };

  const handleProjectsSave = (projects: typeof userData.projects) => {
    const newState = { ...userState, projects };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.projectsUpdated,
      description: dictionary.profile.toast.projectsDescription
    });
  };

  const handlePersonalInfoSave = (personalInfo: { name: string; title: string; location: string; availability: string }) => {
    const newState = { ...userState, ...personalInfo };
    setUserState(newState);
    // Save to localStorage
    try {
      localStorage.setItem('userProfileData', JSON.stringify(newState));
      localStorage.setItem('userPersonalInfo', JSON.stringify(personalInfo));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    showToast({
      type: 'success',
      title: dictionary.profile.toast.personalInfoUpdated,
      description: dictionary.profile.toast.personalInfoDescription
    });
  };

  const handleProfileImageSave = (imageData: string) => {
    setProfileImage(imageData);
    showToast({
      type: 'success',
      title: dictionary.profile.toast.profilePictureUpdated,
      description: dictionary.profile.toast.profilePictureDescription
    });
  };

  const handleDownloadCV = () => {
    showToast({
      type: 'info',
      title: 'CV Download',
      description: 'CV download feature coming soon!'
    });
  };
  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">{dictionary.profile.loading}</div>
      </div>
    );
  }

  return (
    <NavigationSidebar>
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto py-4 px-4 max-w-6xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsContent value="profile" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Sidebar */}
              <ProfileSidebar
                name={userState.name}
                title={userState.title}
                location={userState.location}
                availability={userState.availability}
                profileImage={profileImage}
                profileCompletion={userState.profileCompletion}
                completionItems={userState.completionItems}
                jobPreferences={userState.jobPreferences}
                onEditClick={() => setIsPersonalInfoModalOpen(true)}
                onProfileImageSave={handleProfileImageSave}
                onDownloadCV={handleDownloadCV}
                dictionary={dictionary}
              />

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Tab Bar positioned here */}
                <div className="flex justify-start">
                  <TabsList className="bg-gray-900 p-1 border border-gray-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.profile}</TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.applications}</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.savedJobs}</TabsTrigger>
                  </TabsList>
                </div>

                {/* About Section */}
                <EditableAbout 
                  initialAbout={userState.about} 
                  onSave={handleAboutSave}
                  dictionary={dictionary}
                />

                {/* Experience Section */}
                <EditableExperience 
                  initialExperience={userState.experience} 
                  onSave={handleExperienceSave}
                  dictionary={dictionary}
                />

                {/* Education Section */}
                <EditableEducation 
                  initialEducation={userState.education} 
                  onSave={handleEducationSave}
                  dictionary={dictionary}
                />

                {/* Skills Section */}
                <EditableSkills 
                  initialSkills={userState.skills} 
                  onSave={handleSkillsSave}
                  dictionary={dictionary}
                />

                {/* Certifications Section */}
                <EditableCertifications 
                  initialCertifications={userState.certifications} 
                  onSave={handleCertificationsSave}
                  dictionary={dictionary}
                />

                {/* Projects Section */}
                <EditableProjects 
                  initialProjects={userState.projects} 
                  onSave={handleProjectsSave}
                  dictionary={dictionary}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Same as Profile */}
              <ProfileSidebar
                name={userState.name}
                title={userState.title}
                location={userState.location}
                availability={userState.availability}
                profileImage={profileImage}
                profileCompletion={userState.profileCompletion}
                completionItems={userState.completionItems}
                jobPreferences={userState.jobPreferences}
                onEditClick={() => setIsPersonalInfoModalOpen(true)}
                onProfileImageSave={handleProfileImageSave}
                onDownloadCV={handleDownloadCV}
                dictionary={dictionary}
              />

              {/* Main Content - Job Applications */}
              <div className="lg:col-span-3">
                {/* Tab Bar positioned here */}
                <div className="flex justify-start mb-6">
                  <TabsList className="bg-gray-900 p-1 border border-gray-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.profile}</TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.applications}</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.savedJobs}</TabsTrigger>
                  </TabsList>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">{dictionary.profile.jobApplications}</h2>
                <div className="space-y-4">
                  {userState.applications.map((app, index) => (
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
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Same as Profile */}
              <ProfileSidebar
                name={userState.name}
                title={userState.title}
                location={userState.location}
                availability={userState.availability}
                profileImage={profileImage}
                profileCompletion={userState.profileCompletion}
                completionItems={userState.completionItems}
                jobPreferences={userState.jobPreferences}
                onEditClick={() => setIsPersonalInfoModalOpen(true)}
                onProfileImageSave={handleProfileImageSave}
                onDownloadCV={handleDownloadCV}
                dictionary={dictionary}
              />

              {/* Main Content - Saved Jobs */}
              <div className="lg:col-span-3">
                {/* Tab Bar positioned here */}
                <div className="flex justify-start mb-6">
                  <TabsList className="bg-gray-900 p-1 border border-gray-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.profile}</TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.applications}</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">{dictionary.profile.tabs.savedJobs}</TabsTrigger>
                  </TabsList>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">{dictionary.profile.savedJobs}</h2>
                <div className="space-y-4">
                  {userState.savedJobs.map((job, index) => (
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
          </TabsContent>
        </Tabs>
        
        {/* Personal Info Modal */}
        <PersonalInfoModal
          isOpen={isPersonalInfoModalOpen}
          onClose={() => setIsPersonalInfoModalOpen(false)}
          initialInfo={{
            name: userState.name,
            title: userState.title,
            location: userState.location,
            availability: userState.availability
          }}
          onSave={handlePersonalInfoSave}
        />
        </div>
      </div>
    </NavigationSidebar>
  );
}

export default function ProfilePage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  return (
    <ToastProvider>
      <ProfilePageContent params={params} />
    </ToastProvider>
  );
}