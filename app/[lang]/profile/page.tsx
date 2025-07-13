import { getDictionary } from '@/lib/dictionary';
// import { useParams } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Edit, Download, ExternalLink } from 'lucide-react';

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

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {


  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 bg-gray-800 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600">Profile</TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600">Applications</TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-emerald-600">Saved Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-emerald-500">
                    <img src="/placeholder-user.jpg" alt={userData.name} className="object-cover" />
                  </Avatar>
                  <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                  <p className="text-emerald-400 mb-2">{userData.title}</p>
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <span>{userData.location}</span>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400">{userData.availability}</Badge>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                      <Edit size={16} />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-700 gap-1">
                      <Download size={16} />
                      Download CV
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Profile Completion */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex justify-between">
                    <span>Profile Completion</span>
                    <span className="text-emerald-400">{userData.profileCompletion}%</span>
                  </h2>
                  <Progress value={userData.profileCompletion} className="h-2 mb-4 bg-gray-800" />
                  <div className="space-y-2">
                    {userData.completionItems.map((item, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className={`mr-2 h-4 w-4 rounded-full flex items-center justify-center ${item.completed ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                          {item.completed && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>}
                        </div>
                        <span className={item.completed ? 'text-gray-300' : 'text-gray-500'}>{item.name}</span>
                        {item.note && <span className="ml-2 text-gray-500">{item.note}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Job Preferences */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Job Preferences</h2>
                    <Button size="sm" className="h-8 px-2 text-xs bg-emerald-600 hover:bg-emerald-700">
                      <Edit size={14} className="mr-1" />
                      Edit Preferences
                    </Button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="text-gray-500 mb-1">Job Types</h3>
                      <p className="text-gray-300">{userData.jobPreferences.jobTypes}</p>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div>
                      <h3 className="text-gray-500 mb-1">Locations</h3>
                      <p className="text-gray-300">{userData.jobPreferences.locations}</p>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div>
                      <h3 className="text-gray-500 mb-1">Desired Salary</h3>
                      <p className="text-gray-300">{userData.jobPreferences.desiredSalary}</p>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div>
                      <h3 className="text-gray-500 mb-1">Industries</h3>
                      <p className="text-gray-300">{userData.jobPreferences.industries}</p>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div>
                      <h3 className="text-gray-500 mb-1">Remote Options</h3>
                      <p className="text-gray-300">{userData.jobPreferences.remoteOptions}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-gray-300 leading-relaxed">{userData.about}</p>
                </div>
              </Card>

              {/* Experience Section */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Experience</h2>
                    <Button size="sm" className="h-8 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-8">
                    {userData.experience.map((exp, index) => (
                      <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-1 before:bottom-0 before:w-0.5 before:bg-gray-800">
                        <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-emerald-500"></div>
                        <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                        <p className="text-emerald-400 mb-2">{exp.company}</p>
                        <p className="text-gray-500 text-sm mb-3">{exp.period}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Education Section */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Education</h2>
                    <Button size="sm" className="h-8 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-8">
                    {userData.education.map((edu, index) => (
                      <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-1 before:bottom-0 before:w-0.5 before:bg-gray-800">
                        <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-emerald-500"></div>
                        <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                        <p className="text-emerald-400 mb-2">{edu.institution}</p>
                        <p className="text-gray-500 text-sm">{edu.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Skills Section */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Skills</h2>
                    <Button size="sm" className="h-8 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{skill.name}</span>
                          <span className="text-emerald-400">{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-2 bg-gray-800" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Certifications Section */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Certifications</h2>
                    <Button size="sm" className="h-8 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-4 mb-6">
                    {userData.certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium text-white">{cert.name}</h3>
                          <p className="text-sm text-gray-400">{cert.issuer}</p>
                        </div>
                        <span className="text-gray-400 whitespace-nowrap">{cert.year}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 gap-2">
                    <span>+</span>
                    Add Certification
                  </Button>
                </div>
              </Card>

              {/* Projects Section */}
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Projects</h2>
                    <Button size="sm" className="h-8 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {userData.projects.map((project, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-white">{project.name}</h3>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-emerald-400 hover:text-emerald-300 hover:bg-transparent">
                            View Project <ExternalLink size={14} className="ml-1" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-300 mb-3 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600">{tech}</Badge>
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

        <TabsContent value="applications" className="space-y-6">
            <h2 className="text-2xl font-bold">Job Applications</h2>
            <div className="space-y-4">
                {userData.applications.map((app, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 overflow-hidden">
                    <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-xl font-semibold text-white">{app.title}</h3>
                        <p className="text-gray-400 mb-1">{app.company}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>📍 {app.location}</span>
                            <span className="mx-2">•</span>
                            <span>📅 Applied on {app.appliedDate}</span>
                        </div>
                        </div>
                        <Badge className={`${app.statusColor} text-white`}>{app.status}</Badge>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-gray-800 hover:bg-gray-700">View Application</Button>
                        {app.status !== 'Rejected' && (
                        <Button variant="outline" className="border-gray-700 text-gray-300">Withdraw</Button>
                        )}
                    </div>
                    </div>
                </Card>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
            <h2 className="text-2xl font-bold">Saved Jobs</h2>
            <div className="space-y-4">
                {userData.savedJobs.map((job, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 overflow-hidden">
                    <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        <p className="text-gray-400 mb-1">{job.company}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>📍 {job.location}</span>
                            <span className="mx-2">•</span>
                            <span>📅 Posted {job.postedDate}</span>
                        </div>
                        </div>
                        <Badge className="bg-green-500 text-white">{job.match}% Match</Badge>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-gray-800 hover:bg-gray-700">View Job</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Now</Button>
                        <Button variant="outline" className="border-red-500 text-red-400 hover:text-red-300 hover:border-red-400 ml-auto">Remove</Button>
                    </div>
                    </div>
                </Card>
                ))}
            </div>
        </TabsContent>  
      </Tabs>
    </div>
  );
}