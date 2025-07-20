'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/dictionary';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Edit, Download, ExternalLink, Check, X } from 'lucide-react';

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

export default function ProfilePage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const [notifications, setNotifications] = useState<{[key: string]: boolean}>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    const id = `${type}-${Date.now()}`;
    setNotifications(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setNotifications(prev => ({ ...prev, [id]: false }));
    }, 3000);
  };

  const handleEditClick = (section: string) => {
    showNotification('success', `${section} editing mode activated!`);
  };

  const handleDownloadCV = () => {
    showNotification('success', 'CV download started!');
  };

  return (
    <div className="min-h-screen bg-gray-950 relative">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {Object.entries(notifications).map(([id, show]) => {
          const isSuccess = id.includes('success');
          return show ? (
            <div
              key={id}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-500 ${
                isSuccess ? 'bg-emerald-600' : 'bg-red-600'
              } text-white animate-in slide-in-from-top-2`}
            >
              {isSuccess ? <Check size={16} /> : <X size={16} />}
              <span className="text-sm font-medium">
                {id.split('-').slice(0, -1).join('-').replace('success', '').replace('error', '')}
              </span>
            </div>
          ) : null;
        })}
      </div>

      <div className="container mx-auto py-4 px-4 max-w-6xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsContent value="profile" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Profile Card */}
                <Card 
                  className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/30"
                  onMouseEnter={() => setHoveredCard('profile')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <Avatar className={`h-20 w-20 mb-3 border-2 border-emerald-500 transition-all duration-300 ${hoveredCard === 'profile' ? 'scale-110 shadow-lg shadow-emerald-500/50' : ''}`}>
                      <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        A
                      </div>
                    </Avatar>
                    <h1 className="text-xl font-bold text-white mb-1">{userData.name}</h1>
                    <p className="text-gray-400 text-sm mb-2">{userData.title}</p>
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <span>📍 {userData.location}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400 mb-4 animate-pulse">
                      {userData.availability}
                    </Badge>
                    <div className="flex gap-2 w-full">
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('Profile')}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleDownloadCV}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Download size={12} className="mr-1" />
                        CV
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Profile Completion */}
                <Card 
                  className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30"
                  onMouseEnter={() => setHoveredCard('completion')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-sm font-semibold text-white">Profile Completion</h2>
                      <span className="text-emerald-400 text-sm font-semibold">Overall</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-2xl font-bold text-white transition-all duration-300 ${hoveredCard === 'completion' ? 'scale-110' : ''}`}>
                        {userData.profileCompletion}%
                      </span>
                    </div>
                    <Progress 
                      value={userData.profileCompletion} 
                      className={`h-2 mb-4 bg-gray-800 transition-all duration-500 ${hoveredCard === 'completion' ? 'h-3' : ''}`} 
                    />
                    <div className="space-y-2">
                      {userData.completionItems.map((item, index) => (
                        <div key={index} className="flex items-center text-xs transition-all duration-300 hover:bg-gray-800 hover:px-2 hover:py-1 rounded">
                          <div className={`mr-2 h-3 w-3 rounded-full flex items-center justify-center transition-all duration-300 ${item.completed ? 'bg-emerald-500' : 'bg-red-500'} ${hoveredCard === 'completion' ? 'scale-110' : ''}`}>
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
                <Card 
                  className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30"
                  onMouseEnter={() => setHoveredCard('preferences')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="p-4">
                    <h2 className="text-sm font-semibold text-white mb-3">Job Preferences</h2>
                    <div className="space-y-3 text-xs">
                      <div className="transition-all duration-300 hover:bg-gray-800 hover:px-2 hover:py-1 rounded">
                        <h3 className="text-gray-400 mb-1">Job Types</h3>
                        <p className="text-gray-300">{userData.jobPreferences.jobTypes}</p>
                      </div>
                      <div className="transition-all duration-300 hover:bg-gray-800 hover:px-2 hover:py-1 rounded">
                        <h3 className="text-gray-400 mb-1">Locations</h3>
                        <p className="text-gray-300">{userData.jobPreferences.locations}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-4">
                {/* Tab Bar positioned here */}
                <div className="flex justify-start">
                  <TabsList className="bg-gray-900 p-1 border border-gray-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Profile</TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Applications</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Saved Jobs</TabsTrigger>
                  </TabsList>
                </div>

                {/* About Section */}
                <Card className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/30">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-bold text-white">About</h2>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('About')}
                        className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{userData.about}</p>
                  </div>
                </Card>

                {/* Experience Section */}
                <Card className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Experience</h2>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('Experience')}
                        className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {userData.experience.map((exp, index) => (
                        <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0 transition-all duration-300 hover:bg-gray-800/50 hover:px-4 hover:py-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-base font-semibold text-white">{exp.title}</h3>
                              <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-1">🏢</span>
                                <span>{exp.company}</span>
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{exp.period}</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Education Section */}
                <Card className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Education</h2>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('Education')}
                        className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {userData.education.map((edu, index) => (
                        <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0 transition-all duration-300 hover:bg-gray-800/50 hover:px-4 hover:py-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="text-base font-semibold text-white">{edu.degree}</h3>
                              <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-1">🎓</span>
                                <span>{edu.institution}</span>
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{edu.period}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Skills Section */}
                <Card className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 hover:border-yellow-500/30">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Skills</h2>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('Skills')}
                        className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {userData.skills.map((skill, index) => (
                        <div key={index} className="transition-all duration-300 hover:bg-gray-800/50 hover:px-3 hover:py-2 rounded-lg">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">{skill.name}</span>
                            <span className="text-emerald-400">{skill.proficiency}%</span>
                          </div>
                          <Progress value={skill.proficiency} className="h-1.5 bg-gray-800 transition-all duration-500 hover:h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Certifications Section */}
                <Card className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/30">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Certifications</h2>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('Certifications')}
                        className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {userData.certifications.map((cert, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-md">
                          <div>
                            <h3 className="font-medium text-white text-sm">{cert.name}</h3>
                            <p className="text-xs text-gray-400">{cert.issuer}</p>
                          </div>
                          <span className="text-gray-400 text-xs whitespace-nowrap">{cert.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Projects Section */}
                <Card className="bg-gray-900 border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:border-pink-500/30">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Projects</h2>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick('Projects')}
                        className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {userData.projects.map((project, index) => (
                        <div key={index} className="p-3 bg-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-md">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-white text-sm">{project.name}</h3>
                            <Button variant="ghost" size="sm" className="h-6 px-1 text-emerald-400 hover:text-emerald-300 hover:bg-transparent transition-all duration-300 hover:scale-110">
                              <ExternalLink size={12} />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-300 mb-3 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs px-2 py-0.5 transition-all duration-300 hover:scale-105">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Keep existing Applications and Saved Jobs tabs unchanged */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Same as Profile */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <div className="p-4 flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-3 border-2 border-emerald-500">
                      <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        A
                      </div>
                    </Avatar>
                    <h1 className="text-xl font-bold text-white mb-1">{userData.name}</h1>
                    <p className="text-gray-400 text-sm mb-2">{userData.title}</p>
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <span>📍 {userData.location}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400 mb-4">
                      {userData.availability}
                    </Badge>
                    <div className="flex gap-2 w-full">
                      <Button size="sm" className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1">
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1">
                        <Download size={12} className="mr-1" />
                        CV
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Content - Job Applications */}
              <div className="lg:col-span-3">
                {/* Tab Bar positioned here */}
                <div className="flex justify-start mb-6">
                  <TabsList className="bg-gray-900 p-1 border border-gray-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Profile</TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Applications</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Saved Jobs</TabsTrigger>
                  </TabsList>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Job Applications</h2>
                <div className="space-y-4">
                  {userData.applications.map((app, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 hover:scale-105">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{app.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{app.company}</p>
                          <div className="flex items-center text-gray-500 text-sm">
                            <span>📍 {app.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${app.statusColor} text-white mb-2 transition-all duration-300 hover:scale-110`}>{app.status}</Badge>
                          <div className="flex items-center text-gray-500 text-sm">
                            <span>📅 Applied on {app.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-300 hover:scale-105"
                          onClick={() => showNotification('success', 'Application details opened!')}
                        >
                          View Application
                        </Button>
                        {app.status !== 'Rejected' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                            onClick={() => showNotification('error', 'Application withdrawn!')}
                          >
                            Withdraw
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
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <div className="p-4 flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-3 border-2 border-emerald-500">
                      <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        A
                      </div>
                    </Avatar>
                    <h1 className="text-xl font-bold text-white mb-1">{userData.name}</h1>
                    <p className="text-gray-400 text-sm mb-2">{userData.title}</p>
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <span>📍 {userData.location}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400 mb-4">
                      {userData.availability}
                    </Badge>
                    <div className="flex gap-2 w-full">
                      <Button size="sm" className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1">
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs px-1">
                        <Download size={12} className="mr-1" />
                        CV
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Content - Saved Jobs */}
              <div className="lg:col-span-3">
                {/* Tab Bar positioned here */}
                <div className="flex justify-start mb-6">
                  <TabsList className="bg-gray-900 p-1 border border-gray-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Profile</TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Applications</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400 transition-all duration-300">Saved Jobs</TabsTrigger>
                  </TabsList>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Saved Jobs</h2>
                <div className="space-y-4">
                  {userData.savedJobs.map((job, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/30 hover:scale-105">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{job.company}</p>
                          <div className="flex items-center text-gray-500 text-sm">
                            <span>📍 {job.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-emerald-600 text-white mb-2 transition-all duration-300 hover:scale-110">
                            ⭐ {job.match}% Match
                          </Badge>
                          <div className="text-gray-500 text-sm">
                            Posted {job.postedDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-300 hover:scale-105"
                          onClick={() => showNotification('success', 'Job details opened!')}
                        >
                          View Job
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-105"
                          onClick={() => showNotification('success', 'Application submitted!')}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500 text-red-400 hover:text-red-300 hover:border-red-400 ml-auto transition-all duration-300 hover:scale-105"
                          onClick={() => showNotification('error', 'Job removed from saved!')}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}