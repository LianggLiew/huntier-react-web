// Copilot: This component shows extracted resume data and allows editing
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface ResumeSummaryProps {
  userData: {
    name: string;
    experience: Experience[];
    skills: string[];
  };
  onDataChange: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ResumeSummary({
  userData,
  onDataChange,
  onContinue,
  onBack,
}: ResumeSummaryProps) {
  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name || "");
  const [skills, setSkills] = useState<string[]>(userData.skills || []);
  const [experience, setExperience] = useState<Experience[]>(
    userData.experience || []
  );

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      onDataChange({ skills: updatedSkills });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    onDataChange({ skills: updatedSkills });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onDataChange({ name: e.target.value });
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setExperience(updatedExperience);
    onDataChange({ experience: updatedExperience });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Review your information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We've extracted your details. Please verify and edit if needed.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEditMode}
          className="flex items-center gap-1"
        >
          {isEditing ? "Done" : "Edit"}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Personal Information */}
        <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              
              {isEditing ? (
                <Input
                  id="name"
                  className="w-full"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-semibold">
                  {name || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            Experience
          </h3>
          
          <div className="space-y-6">
            {experience.length > 0 ? (
              experience.map((exp, index) => (
                <div
                  key={index}
                  className={cn(
                    "space-y-2 pb-4",
                    index !== experience.length - 1 &&
                      "border-b border-gray-200 dark:border-gray-700"
                  )}
                >
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Role
                        </label>
                        <Input
                          value={exp.role}
                          onChange={(e) =>
                            handleExperienceChange(index, "role", e.target.value)
                          }
                          placeholder="Job title"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company
                          </label>
                          <Input
                            value={exp.company}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="Company name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration
                          </label>
                          <Input
                            value={exp.duration}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="e.g. 2020-2022"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Brief description of your responsibilities"
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {exp.role || "Role not specified"}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {exp.duration || "Duration not specified"}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {exp.company || "Company not specified"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.description || "No description available"}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No experience information available
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            Skills
          </h3>
          
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSkill) {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
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
          )}
          
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "px-3 py-1.5 text-sm",
                    isEditing && "pr-1.5 flex items-center gap-1"
                  )}
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No skills information available
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between pt-4"
      >
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onContinue}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {isEditing ? "Save & Continue" : "Continue"}
        </Button>
      </motion.div>
    </div>
  );
}
