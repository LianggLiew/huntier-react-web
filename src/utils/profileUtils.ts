// Profile utility functions for data transformation and calculations

export interface ProfileData {
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  resumeFileUrl?: string | null;
  resumeFileName?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  highestDegree?: string | null;
  major?: string | null;
  experience?: any[];
  education?: any[];
  skills?: any[];
  certifications?: any[];
  projects?: any[];
  jobPreferences?: {
    preferredEmploymentTypes?: string[];
    preferredLocations?: string[];
    preferredSalaryMin?: number;
    preferredSalaryMax?: number;
    preferredIndustries?: string[];
    remoteWorkPreference?: string;
  };
}

export interface CompletionItem {
  name: string;
  completed: boolean;
}

// Utility function to create full name from first and last name
export const getFullName = (firstName?: string | null, lastName?: string | null): string => {
  if (!firstName && !lastName) return '';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Default completion items structure
export const getDefaultCompletionItems = (profile: ProfileData): CompletionItem[] => [
  { 
    name: 'Personal Information', 
    completed: !!(profile?.firstName && profile?.lastName && profile?.dateOfBirth && profile?.nationality && profile?.highestDegree && profile?.major) 
  },
  {
    name: 'Resume',
    completed: !!(profile?.resumeFileUrl && profile?.resumeFileName),
  },
  { 
    name: 'About/Bio', 
    completed: !!(profile?.bio && profile.bio.trim()) 
  },
  { 
    name: 'Experience', 
    completed: !!(profile?.experience && profile.experience.length > 0) 
  },
  { 
    name: 'Education', 
    completed: !!(profile?.education && profile.education.length > 0) 
  },
  { 
    name: 'Skills', 
    completed: !!(profile?.skills && profile.skills.length >= 3)
  },
  { 
    name: 'Certifications', 
    completed: !!(profile?.certifications && profile.certifications.length > 0) 
  },
  { 
    name: 'Projects', 
    completed: !!(profile?.projects && profile.projects.length > 0) 
  },
];

// Calculate profile completion from real data (matches API calculation)
export const calculateProfileCompletion = (profile: ProfileData): number => {
  if (!profile) return 0;
  
  const basicFields = [
    profile.firstName,
    profile.lastName,
    profile.dateOfBirth,
    profile.nationality,
    profile.highestDegree,
    profile.major,
    profile.bio
  ];
  
  let filledFields = 0;
  
  // Count basic fields
  basicFields.forEach(field => {
    if (field && field.toString().trim()) {
      filledFields++;
    }
  });

  // Add points for resume
  if (profile.resumeFileUrl) filledFields++;

  // Add points for experience (1 or more entries)
  if (profile.experience && profile.experience.length > 0) filledFields++;

  // Add points for education (1 or more entries)
  if (profile.education && profile.education.length > 0) filledFields++;

  // Add points for skills (1 or more entries for full credit)
  if (profile.skills && profile.skills.length >= 1) filledFields++;

  // Add points for certifications (1 or more entries)
  if (profile.certifications && profile.certifications.length > 0) filledFields++;

  // Add points for projects (1 or more entries)
  if (profile.projects && profile.projects.length > 0) filledFields++;

  const totalFields = basicFields.length + 6; // +6 for resume, experience, education, skills, certifications, projects
  return Math.round((filledFields / totalFields) * 100);
};

// Transform profile data for UI consumption
export const transformProfileForUI = (profile: ProfileData, emptyStateTemplates: any) => {
  return {
    // Real data from profile/user
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    title: (profile as any)?.title || '',
    location: (profile as any)?.location || '',
    about: profile?.bio || '',
    profileCompletion: calculateProfileCompletion(profile),
    completionItems: getDefaultCompletionItems(profile),
    jobPreferences: profile?.jobPreferences ? {
      jobTypes: profile.jobPreferences.preferredEmploymentTypes?.join(', ') || 'Not specified',
      locations: profile.jobPreferences.preferredLocations?.join(', ') || 'Not specified',
      desiredSalary: profile.jobPreferences.preferredSalaryMin && profile.jobPreferences.preferredSalaryMax
        ? `$${profile.jobPreferences.preferredSalaryMin}K - $${profile.jobPreferences.preferredSalaryMax}K`
        : 'Not specified',
      industries: profile.jobPreferences.preferredIndustries?.join(', ') || 'Not specified',
      remoteOptions: profile.jobPreferences.remoteWorkPreference || 'Not specified',
    } : {
      jobTypes: 'Not specified',
      locations: 'Not specified',
      desiredSalary: 'Not specified',
      industries: 'Not specified',
      remoteOptions: 'Not specified',
    },
    // Transform profile sections with fallback to empty state templates
    experience: transformExperienceData(profile?.experience, emptyStateTemplates.experience),
    education: transformEducationData(profile?.education, emptyStateTemplates.education),
    skills: transformSkillsData(profile?.skills, emptyStateTemplates.skills),
    certifications: transformCertificationsData(profile?.certifications, emptyStateTemplates.certifications),
    projects: transformProjectsData(profile?.projects, emptyStateTemplates.projects),
    // Empty state templates for applications and saved jobs (not yet implemented)
    applications: emptyStateTemplates.applications,
    savedJobs: emptyStateTemplates.savedJobs,
  };
};

// Helper functions for transforming individual data sections
const transformExperienceData = (experience: any[] | undefined, emptyTemplate: any[]) => {
  if (!experience || experience.length === 0) {
    return emptyTemplate;
  }
  
  const realExperience = experience.filter(exp => 
    exp.title && 
    exp.title.trim() !== '' &&
    exp.company &&
    exp.company.trim() !== ''
  );
  
  if (realExperience.length > 0) {
    return realExperience.map(exp => ({
      title: exp.title,
      company: exp.company,
      period: exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Present`,
      description: exp.description,
    }));
  }
  return emptyTemplate;
};

const transformEducationData = (education: any[] | undefined, emptyTemplate: any[]) => {
  if (!education || education.length === 0) {
    return emptyTemplate;
  }
  
  const realEducation = education.filter(edu => 
    edu.degree && 
    edu.degree.trim() !== '' &&
    edu.institution &&
    edu.institution.trim() !== ''
  );
  
  if (realEducation.length > 0) {
    return realEducation.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      period: `${edu.startDate} - ${edu.endDate}`,
    }));
  }
  return emptyTemplate;
};

const transformSkillsData = (skills: any[] | undefined, emptyTemplate: any[]) => {
  if (!skills || skills.length === 0) {
    return emptyTemplate;
  }
  
  const realSkills = skills.filter(skill => 
    skill.name && 
    skill.name.trim() !== ''
  );
  
  if (realSkills.length > 0) {
    return realSkills.map(skill => ({
      name: skill.name,
      proficiency: skill.proficiency,
    }));
  }
  return emptyTemplate;
};

const transformCertificationsData = (certifications: any[] | undefined, emptyTemplate: any[]) => {
  if (!certifications || certifications.length === 0) {
    return emptyTemplate;
  }
  
  const realCertifications = certifications.filter(cert => 
    cert.name && 
    cert.name.trim() !== '' &&
    cert.issuer &&
    cert.issuer.trim() !== ''
  );
  
  if (realCertifications.length > 0) {
    return realCertifications.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      year: cert.issueDate ? cert.issueDate.split('-')[0] : new Date().getFullYear().toString(),
    }));
  }
  return emptyTemplate;
};

const transformProjectsData = (projects: any[] | undefined, emptyTemplate: any[]) => {
  if (!projects || projects.length === 0) {
    return emptyTemplate;
  }
  
  const realProjects = projects.filter(proj => 
    proj.name && 
    proj.name.trim() !== '' &&
    proj.description &&
    proj.description.trim() !== ''
  );
  
  if (realProjects.length > 0) {
    return realProjects.map(proj => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies || [],
    }));
  }
  return emptyTemplate;
};