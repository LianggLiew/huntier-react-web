// Common types used across the application

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  skills: string[];
  salary?: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  matchPercentage: number;
  skills: string[];
  experience: string;
}

export interface Company {
  name: string;
  industry: string;
  logo: File | null;
}

export interface JobPost {
  title: string;
  description: string;
  location: string;
  skills: string[];
}

export interface CandidatePreference {
  experience: string;
  languages: string[];
  timezone: string;
  skills: string[];
}
