// Simple vector search implementation for job matching
// This is a mock implementation that would be replaced with a real vector database in production

import type { JobMatch } from '@/types/resume';

// Mock job database
const MOCK_JOBS: JobMatch[] = [
  {
    id: 'job1',
    title: 'Senior React Developer',
    company: 'TechFusion Inc.',
    location: 'San Francisco, CA (Remote)',
    matchPercentage: 96,
    skills: ['React', 'TypeScript', 'Redux', 'Next.js', 'GraphQL'],
    salary: '$130K - $160K',
  },
  {
    id: 'job2',
    title: 'Frontend Engineer',
    company: 'InnovateTech',
    location: 'New York, NY (Hybrid)',
    matchPercentage: 89,
    skills: ['React', 'JavaScript', 'CSS', 'UI/UX', 'Responsive Design'],
    salary: '$115K - $140K',
  },
  {
    id: 'job3',
    title: 'Full Stack Developer',
    company: 'GlobalConnect Software',
    location: 'Austin, TX (Remote)',
    matchPercentage: 85,
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'AWS'],
    salary: '$120K - $150K',
  },
  {
    id: 'job4',
    title: 'Software Engineer II',
    company: 'DataStream',
    location: 'Seattle, WA (On-site)',
    matchPercentage: 82,
    skills: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'Docker'],
    salary: '$125K - $155K',
  },
  {
    id: 'job5',
    title: 'Senior UX Designer',
    company: 'CreativeLabs',
    location: 'Los Angeles, CA (Hybrid)',
    matchPercentage: 94,
    skills: ['UI/UX', 'Figma', 'User Research', 'Design Systems', 'Prototyping'],
    salary: '$115K - $145K',
  },
  {
    id: 'job6',
    title: 'Data Scientist',
    company: 'AnalyticsAI',
    location: 'Boston, MA (Remote)',
    matchPercentage: 91,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization', 'TensorFlow'],
    salary: '$130K - $160K',
  },
  {
    id: 'job7',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Denver, CO (Remote)',
    matchPercentage: 88,
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'AWS', 'Terraform'],
    salary: '$125K - $155K',
  },
];

// Simple function to calculate similarity score between two sets of skills
function calculateSimilarity(userSkills: string[], jobSkills: string[]): number {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
  
  // Count matching skills
  const matchingSkills = userSkillsLower.filter(skill => 
    jobSkillsLower.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
  ).length;
  
  // Calculate similarity score
  const maxPossibleMatches = Math.max(userSkillsLower.length, jobSkillsLower.length);
  return maxPossibleMatches > 0 ? (matchingSkills / maxPossibleMatches) * 100 : 0;
}

// Function to find matching jobs based on user skills and roles
export async function findMatchingJobs(
  userSkills: string[],
  desiredRoles: string[],
  limit: number = 5
): Promise<JobMatch[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Filter jobs by desired roles (if any)
  let matchedJobs = [...MOCK_JOBS];
  if (desiredRoles.length > 0) {
    const desiredRolesLower = desiredRoles.map(r => r.toLowerCase());
    matchedJobs = matchedJobs.filter(job => 
      desiredRolesLower.some(role => 
        job.title.toLowerCase().includes(role) || 
        role.includes(job.title.toLowerCase())
      )
    );
  }
  
  // If no roles specified or no matches found, use all jobs
  if (matchedJobs.length === 0) {
    matchedJobs = [...MOCK_JOBS];
  }
  
  // Calculate similarity scores
  const jobsWithScores = matchedJobs.map(job => {
    // In a real implementation, this would use proper vector similarity
    const similarity = userSkills.length > 0 ? calculateSimilarity(userSkills, job.skills) : job.matchPercentage;
    
    return {
      ...job,
      matchPercentage: Math.round(similarity),
    };
  });
  
  // Sort by match percentage (descending)
  const sortedJobs = jobsWithScores.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
  // Return top N matches
  return sortedJobs.slice(0, limit);
}

// Function to find similar users based on skills profile
export async function findSimilarProfiles(
  userSkills: string[],
  limit: number = 3
): Promise<{
  name: string;
  title: string;
  skills: string[];
  similarityScore: number;
}[]> {
  // This would connect to a real database in production
  // For now, return mock data
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  return [
    {
      name: "Michael Brown",
      title: "Senior Frontend Developer",
      skills: ["React", "TypeScript", "CSS", "Redux", "Next.js"],
      similarityScore: 92,
    },
    {
      name: "Sarah Johnson",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
      similarityScore: 85,
    },
    {
      name: "David Chen",
      title: "UI/UX Developer",
      skills: ["React", "UI/UX", "Figma", "CSS", "Design Systems"],
      similarityScore: 78,
    },
  ];
}
