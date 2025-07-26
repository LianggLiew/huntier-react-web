// Copilot: This component shows AI-generated job matches with percentage fit
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Building, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingAI from "./LoadingAI";

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  skills: string[];
  salary?: string;
}

interface JobMatchPreviewProps {
  roles: string[];
  skills: string[];
  onContinue: () => void;
  onBack: () => void;
}

export default function JobMatchPreview({
  roles,
  skills,
  onContinue,
  onBack,
}: JobMatchPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);

  // Mock data - in a real app, this would come from an API call
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Generate mock job matches based on selected roles and skills
      const mockMatches = [
        {
          id: "job1",
          title: roles[0] || "Senior Software Developer",
          company: "TechFusion Inc.",
          location: "San Francisco, CA (Remote)",
          matchPercentage: 93,
          skills: skills.length > 0 ? skills.slice(0, 3) : ["React", "TypeScript", "Node.js"],
          salary: "$120K - $150K",
        },
        {
          id: "job2",
          title: roles[0] || "Lead Frontend Developer",
          company: "InnovateTech",
          location: "New York, NY (Hybrid)",
          matchPercentage: 87,
          skills: skills.length > 0 ? [...skills.slice(0, 2), "UI/UX"] : ["React", "JavaScript", "UI/UX"],
        },
        {
          id: "job3",
          title: roles[0] || "Full Stack Engineer",
          company: "GlobalConnect Software",
          location: "Austin, TX (Remote)",
          matchPercentage: 82,
          skills: skills.length > 0 ? [...skills.slice(1, 3), "AWS"] : ["Node.js", "React", "AWS"],
          salary: "$110K - $140K",
        },
      ];

      setJobMatches(mockMatches);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [roles, skills]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          We found great matches for you!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Based on your profile, here are some job recommendations
        </p>
      </motion.div>

      <div className="space-y-6">
        {loading ? (
          <LoadingAI text="Finding your perfect job matches..." />
        ) : (
          jobMatches.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 + 0.2 }
              }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Match percentage sidebar */}
                  <div 
                    className={cn(
                      "p-4 text-white text-center flex flex-row md:flex-col justify-between items-center md:w-28",
                      job.matchPercentage > 90 
                        ? "bg-emerald-500 dark:bg-emerald-600" 
                        : job.matchPercentage > 80 
                        ? "bg-teal-500 dark:bg-teal-600" 
                        : "bg-emerald-400 dark:bg-emerald-500"
                    )}
                  >
                    <div className="mb-0 md:mb-2">
                      <BarChart className="h-5 w-5 mx-auto" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold">{job.matchPercentage}%</span>
                      <p className="text-xs opacity-90">Match</p>
                    </div>
                  </div>
                  
                  {/* Job details */}
                  <div className="p-5 w-full">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{job.company}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      
                      {job.salary && (
                        <div className="mt-2 md:mt-0">
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-medium py-1.5">
                            {job.salary}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>Skills Match:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary"
                            className="py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5 text-right">
                      <Button 
                        variant="outline"
                        className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-4"
      >
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onContinue}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8"
        >
          View Profile
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
