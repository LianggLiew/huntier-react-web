// Copilot: This component handles candidate preferences for recruiters
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface CandidatePreferencesProps {
  preferences: {
    experience: string;
    languages: string[];
    timezone: string;
    skills: string[];
  };
  onDataChange: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Sample candidate matches
const CANDIDATE_MATCHES = [
  {
    id: "c1",
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    matchPercentage: 95,
    skills: ["React", "TypeScript", "CSS"],
    experience: "6 years",
  },
  {
    id: "c2",
    name: "Michael Chen",
    title: "Full Stack Engineer",
    matchPercentage: 88,
    skills: ["Node.js", "React", "MongoDB"],
    experience: "4 years",
  },
];

// Common timezones
const TIMEZONES = [
  "GMT (UTC+0)",
  "EST (UTC-5)",
  "PST (UTC-8)",
  "CET (UTC+1)",
  "JST (UTC+9)",
  "AEST (UTC+10)",
  "IST (UTC+5:30)",
];

// Common languages
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Russian",
];

export default function CandidatePreferences({
  preferences,
  onDataChange,
  onContinue,
  onBack,
}: CandidatePreferencesProps) {
  const [experience, setExperience] = useState<number>(
    preferences.experience ? parseInt(preferences.experience) : 3
  );
  const [languages, setLanguages] = useState<string[]>(
    preferences.languages || []
  );
  const [timezone, setTimezone] = useState<string>(
    preferences.timezone || ""
  );
  const [skills, setSkills] = useState<string[]>(
    preferences.skills || []
  );
  const [newSkill, setNewSkill] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [showMatches, setShowMatches] = useState<boolean>(false);

  const handleExperienceChange = (value: number[]) => {
    setExperience(value[0]);
    onDataChange({ preferredExperience: value[0].toString() });
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    onDataChange({ preferredTimezone: value });
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      onDataChange({ preferredSkills: updatedSkills });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    onDataChange({ preferredSkills: updatedSkills });
  };

  const handleAddLanguage = (language: string) => {
    if (language && !languages.includes(language)) {
      const updatedLanguages = [...languages, language];
      setLanguages(updatedLanguages);
      onDataChange({ preferredLanguages: updatedLanguages });
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    onDataChange({ preferredLanguages: updatedLanguages });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "skill") handleAddSkill();
    }
  };

  const handlePreviewMatches = () => {
    setShowMatches(true);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Candidate Preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Tell us what you're looking for in an ideal candidate
        </p>
      </motion.div>

      {!showMatches ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <div className="space-y-4">
                <Slider
                  defaultValue={[experience]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={handleExperienceChange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Entry Level</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {experience} Year{experience !== 1 ? "s" : ""}
                  </span>
                  <span>Senior Level</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a required skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "skill")}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Preferred Timezone</Label>
                <Select
                  value={timezone}
                  onValueChange={handleTimezoneChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Languages</Label>
                <Select
                  value={newLanguage}
                  onValueChange={(value) => {
                    handleAddLanguage(value);
                    setNewLanguage("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.filter(
                      (lang) => !languages.includes(lang)
                    ).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2 min-h-12 py-2">
                  {languages.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic w-full text-center py-1">
                      No languages added yet
                    </p>
                  ) : (
                    languages.map((language, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-2 py-1 flex items-center gap-1"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(index)}
                          className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              type="button"
              variant="outline"
              className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/40"
              onClick={handlePreviewMatches}
              disabled={skills.length === 0}
            >
              <Users className="mr-2 h-4 w-4" />
              Preview Top Matches
            </Button>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              onClick={onContinue}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Complete Setup
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Top Candidate Matches
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMatches(false)}
            >
              Back to Preferences
            </Button>
          </div>

          <div className="space-y-4">
            {CANDIDATE_MATCHES.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: index * 0.1 } 
                }}
              >
                <Card className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div 
                      className={cn(
                        "p-4 text-white text-center flex flex-row sm:flex-col justify-between items-center sm:w-24",
                        candidate.matchPercentage >= 90 
                          ? "bg-emerald-500 dark:bg-emerald-600" 
                          : "bg-teal-500 dark:bg-teal-600"
                      )}
                    >
                      <span className="text-xs uppercase font-medium mb-0 sm:mb-1">Match</span>
                      <span className="text-2xl font-bold">{candidate.matchPercentage}%</span>
                    </div>
                    
                    <div className="p-4 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                        <div>
                          <h4 className="font-medium text-lg text-gray-900 dark:text-white">
                            {candidate.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {candidate.title}
                          </p>
                        </div>
                        <Badge className="mt-1 sm:mt-0">
                          {candidate.experience} exp
                        </Badge>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              onClick={onContinue}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Complete Setup
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
