// Copilot: This component allows users to select their desired roles for job matching
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Common job roles for suggestions
const SUGGESTED_ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Project Manager",
  "Marketing Manager",
];

export default function RoleSelector({
  selectedRoles,
  onRolesChange,
  onContinue,
  onBack,
}: RoleSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTED_ROLES);

  const handleAddRole = (role: string) => {
    if (role && !selectedRoles.includes(role)) {
      const updatedRoles = [...selectedRoles, role];
      onRolesChange(updatedRoles);
      setInputValue("");
    }
  };

  const handleRemoveRole = (index: number) => {
    const updatedRoles = selectedRoles.filter((_, i) => i !== index);
    onRolesChange(updatedRoles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Filter suggestions based on input
    if (value) {
      const filtered = SUGGESTED_ROLES.filter((role) =>
        role.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(SUGGESTED_ROLES);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      handleAddRole(inputValue);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          What roles are you interested in?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Select or add job titles that match your career goals.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative space-y-4">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Add a role (e.g. Software Engineer)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              onClick={() => handleAddRole(inputValue)}
              disabled={!inputValue}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-16">
            {selectedRoles.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic w-full text-center py-4">
                No roles selected yet. Add some from the suggestions or type your own.
              </p>
            ) : (
              selectedRoles.map((role, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-2 text-sm flex gap-1 items-center group"
                >
                  {role}
                  <button
                    onClick={() => handleRemoveRole(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
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
        transition={{ delay: 0.2 }}
        className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4"
      >
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          Suggested Roles
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 8).map((role) => (
            <Badge
              key={role}
              variant="outline"
              className={cn(
                "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
                selectedRoles.includes(role) && "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-800"
              )}
              onClick={() => handleAddRole(role)}
            >
              {role}
            </Badge>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between pt-4"
      >
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={selectedRoles.length === 0}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
