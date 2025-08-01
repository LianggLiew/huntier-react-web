// Profile configuration constants and empty state templates

export const emptyStateTemplates = {
  experience: [
    {
      title: 'Add your first work experience',
      company: 'Click edit to get started',
      period: '',
      description: 'Share your professional experience and accomplishments by clicking the edit button.',
      isEmpty: true,
    },
  ],
  education: [
    {
      degree: 'Add your education',
      institution: 'Click edit to get started',
      period: '',
      isEmpty: true,
    },
  ],
  skills: [
    { name: 'Add your skills by clicking edit', proficiency: 0, isEmpty: true },
  ],
  certifications: [
    {
      name: 'Add your certifications',
      issuer: 'Click edit to get started',
      year: '',
      isEmpty: true,
    },
  ],
  projects: [
    {
      name: 'Add your first project',
      description: 'Showcase your projects and accomplishments by clicking the edit button.',
      technologies: [],
      isEmpty: true,
    },
  ],
  applications: [
    {
      title: 'No applications yet',
      company: 'Start applying to jobs',
      location: 'Various locations',
      status: 'Get Started',
      statusColor: 'bg-gray-500',
      appliedDate: 'Today',
    },
  ],
  savedJobs: [
    {
      title: 'No saved jobs yet',
      company: 'Browse jobs to save them',
      location: 'Various locations',
      match: 0,
      postedDate: 'Today',
    },
  ],
};