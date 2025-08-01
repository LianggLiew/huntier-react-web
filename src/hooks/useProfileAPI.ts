import { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface SaveProfileOptions {
  section: 'about' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'personalInfo';
  data: any;
  dictionary?: any;
}

export const useProfileAPI = () => {
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const transformExperience = (experience: any[]) => {
    return experience.map((exp, index) => ({
      id: `exp_${Date.now()}_${index}`,
      title: exp.title || '',
      company: exp.company || '',
      startDate: exp.period ? exp.period.split(' - ')[0] || '' : '',
      endDate: exp.period && exp.period.includes(' - ') ? exp.period.split(' - ')[1] || null : null,
      description: exp.description || '',
      location: null,
      employmentType: null
    }));
  };

  const transformEducation = (education: any[]) => {
    return education.map((edu, index) => ({
      id: `edu_${Date.now()}_${index}`,
      degree: edu.degree || '',
      institution: edu.institution || '',
      startDate: edu.period ? edu.period.split(' - ')[0] || '' : '',
      endDate: edu.period ? edu.period.split(' - ')[1] || '' : '',
      description: null,
      location: null,
      gpa: null
    }));
  };

  const transformSkills = (skills: any[]) => {
    return skills.map((skill, index) => ({
      id: `skill_${Date.now()}_${index}`,
      name: skill.name || '',
      category: null,
      proficiency: skill.proficiency || 50,
      yearsOfExperience: null
    }));
  };

  const transformCertifications = (certifications: any[]) => {
    return certifications.map((cert, index) => ({
      id: `cert_${Date.now()}_${index}`,
      name: cert.name || '',
      issuer: cert.issuer || '',
      issueDate: cert.year ? `${cert.year}-01-01` : '',
      expiryDate: null,
      credentialId: null,
      credentialUrl: null,
      description: null
    }));
  };

  const transformProjects = (projects: any[]) => {
    return projects.map((proj, index) => ({
      id: `proj_${Date.now()}_${index}`,
      name: proj.name || '',
      description: proj.description || '',
      technologies: proj.technologies || [],
      startDate: '2023-01-01',
      endDate: null,
      url: null,
      githubUrl: null,
      role: null,
      teamSize: null
    }));
  };

  const getSuccessMessages = (section: string, dictionary?: any) => {
    const messages = {
      about: {
        title: dictionary?.profile?.toast?.aboutUpdated || 'About Updated',
        description: dictionary?.profile?.toast?.aboutDescription || 'Your about section has been updated successfully.'
      },
      experience: {
        title: 'Experience Updated',
        description: 'Your work experience has been updated successfully.'
      },
      education: {
        title: 'Education Updated',
        description: 'Your education information has been updated successfully.'
      },
      skills: {
        title: 'Skills Updated',
        description: 'Your skills have been updated successfully.'
      },
      certifications: {
        title: 'Certifications Updated',
        description: 'Your certifications have been updated successfully.'
      },
      projects: {
        title: 'Projects Updated',
        description: 'Your projects have been updated successfully.'
      },
      personalInfo: {
        title: dictionary?.profile?.toast?.personalInfoUpdated || 'Personal Info Updated',
        description: dictionary?.profile?.toast?.personalInfoDescription || 'Your personal information has been updated successfully.'
      }
    };
    return messages[section as keyof typeof messages] || messages.about;
  };

  const transformData = (section: string, data: any) => {
    switch (section) {
      case 'about':
        return { bio: data };
      case 'experience':
        return { experience: transformExperience(data) };
      case 'education':
        return { education: transformEducation(data) };
      case 'skills':
        return { skills: transformSkills(data) };
      case 'certifications':
        return { certifications: transformCertifications(data) };
      case 'projects':
        return { projects: transformProjects(data) };
      case 'personalInfo':
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          title: data.title,
          location: data.location,
        };
      default:
        return data;
    }
  };

  const saveProfile = async ({ section, data, dictionary }: SaveProfileOptions) => {
    setIsLoading(true);
    try {
      const transformedData = transformData(section, data);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await refreshUser();
        const messages = getSuccessMessages(section, dictionary);
        toast({
          title: messages.title,
          description: messages.description
        });
        return { success: true };
      } else {
        throw new Error(result.error || `Failed to update ${section}`);
      }
    } catch (error) {
      console.error(`Failed to save ${section}:`, error);
      
      // Show specific error message for database migration issues
      if (section !== 'about' && section !== 'personalInfo') {
        toast({
          title: 'Database Migration Required',
          description: 'Please run the database migration script first. Check the console for details.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to update ${section}. Please try again.`,
          variant: 'destructive'
        });
      }
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveProfile,
    isLoading
  };
};