// Copilot: This component allows recruiters to create job postings with AI suggestions
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingAI from "./LoadingAI";

const formSchema = z.object({
  jobTitle: z.string().min(3, {
    message: "Job title must be at least 3 characters.",
  }),
  jobDescription: z.string().min(20, {
    message: "Job description must be at least 20 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
});

interface JobPostFormProps {
  jobData: {
    title: string;
    description: string;
    location: string;
    skills: string[];
  };
  onDataChange: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Sample job templates for AI suggestions
const JOB_TEMPLATES = {
  "Software Engineer": {
    title: "Senior Software Engineer",
    description: `We are looking for a Senior Software Engineer to join our growing team. The ideal candidate will have strong experience in full-stack development, cloud infrastructure, and a passion for building scalable, high-performance applications.

Responsibilities:
- Design, develop, and maintain backend services and frontend components
- Collaborate with product managers, designers, and other engineers
- Write clean, testable, and efficient code
- Participate in code reviews and mentor junior engineers
- Troubleshoot and debug applications

Requirements:
- 5+ years of experience in software development
- Strong proficiency in JavaScript/TypeScript, React, and Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
- Knowledge of database systems and data modeling
- Excellent problem-solving and communication skills`,
    location: "San Francisco, CA (Remote Optional)",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "CI/CD"],
  },
  "Product Manager": {
    title: "Senior Product Manager",
    description: `We're seeking an experienced Product Manager to help us define and build innovative products. You'll work across teams to gather requirements, prioritize features, and drive product strategy.

Responsibilities:
- Define product vision, strategy, and roadmap
- Gather and analyze customer feedback and market trends
- Work with engineering, design, and marketing teams
- Prioritize features and create detailed product specifications
- Monitor product performance and iterate based on metrics

Requirements:
- 4+ years of product management experience
- Proven track record of shipping successful products
- Strong analytical and problem-solving skills
- Excellent communication and presentation abilities
- Experience with agile development methodologies`,
    location: "New York, NY (Hybrid)",
    skills: ["Product Strategy", "User Research", "Agile", "Data Analysis", "Roadmapping"],
  },
  "UX Designer": {
    title: "Senior UX/UI Designer",
    description: `We are looking for a talented UX/UI Designer to create exceptional user experiences for our products. You will collaborate with product and engineering teams to design intuitive, engaging interfaces.

Responsibilities:
- Create wireframes, prototypes, and high-fidelity designs
- Conduct user research and usability testing
- Develop user flows, journey maps, and information architecture
- Collaborate with product managers and engineers
- Ensure consistent design patterns across products

Requirements:
- 3+ years of experience in UX/UI design
- Strong portfolio demonstrating your design process
- Proficiency with design tools (Figma, Sketch, Adobe XD)
- Understanding of design systems and accessibility standards
- Excellent visual design and problem-solving skills`,
    location: "Austin, TX (Remote Optional)",
    skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Visual Design"],
  },
};

export default function JobPostForm({
  jobData,
  onDataChange,
  onContinue,
  onBack,
}: JobPostFormProps) {
  const [skills, setSkills] = useState<string[]>(jobData.skills || []);
  const [newSkill, setNewSkill] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [suggestionType, setSuggestionType] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: jobData.title || "",
      jobDescription: jobData.description || "",
      location: jobData.location || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onDataChange({
      jobTitle: values.jobTitle,
      jobDescription: values.jobDescription,
      location: values.location,
      requiredSkills: skills,
    });
    onContinue();
  }

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      onDataChange({ requiredSkills: updatedSkills });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    onDataChange({ requiredSkills: updatedSkills });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const generateAiSuggestion = (type: string) => {
    setSuggestionType(type);
    setAiLoading(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const template = JOB_TEMPLATES[type as keyof typeof JOB_TEMPLATES];
      
      if (template) {
        form.setValue("jobTitle", template.title);
        form.setValue("jobDescription", template.description);
        form.setValue("location", template.location);
        setSkills(template.skills);
        onDataChange({ 
          jobTitle: template.title,
          jobDescription: template.description,
          location: template.location,
          requiredSkills: template.skills
        });
      }
      
      setAiLoading(false);
      setSuggestionType(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Create a job posting
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Let's create a compelling job posting to attract qualified candidates
        </p>
      </motion.div>

      {aiLoading ? (
        <LoadingAI text={`Generating ${suggestionType} job template...`} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
                  Basic Information
                </h3>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-emerald-500 border-emerald-200 hover:border-emerald-300 dark:border-emerald-800 dark:hover:border-emerald-700"
                    onClick={() => generateAiSuggestion("Software Engineer")}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Engineer</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-teal-500 border-teal-200 hover:border-teal-300 dark:border-teal-800 dark:hover:border-teal-700"
                    onClick={() => generateAiSuggestion("Product Manager")}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">PM</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-orange-500 border-orange-200 hover:border-orange-300 dark:border-orange-800 dark:hover:border-orange-700"
                    onClick={() => generateAiSuggestion("UX Designer")}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Designer</span>
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. San Francisco, CA (Remote)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role, responsibilities, requirements, etc."
                        className="min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <Label>Required Skills</Label>
                
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a required skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newSkill}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-16 py-2">
                  {skills.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic w-full text-center py-2">
                      No skills added yet
                    </p>
                  ) : (
                    skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between pt-4"
            >
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Continue
              </Button>
            </motion.div>
          </form>
        </Form>
      )}
    </div>
  );
}
