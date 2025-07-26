// Copilot: This component renders a progress stepper for the onboarding process
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[]; // Optional array of completed step indices
}

export default function ProgressStepper({ 
  steps, 
  currentStep,
  completedSteps = [] 
}: ProgressStepperProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          // Step is completed if it's before the current step or explicitly marked as completed
          const isCompleted = currentStep > index || completedSteps.includes(index);
          const isActive = currentStep === index;

          return (
            <div key={step} className="flex flex-col items-center relative w-full">
              <div className="flex items-center w-full">
                {/* Line before */}
                {index > 0 && (
                  <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {(isCompleted || index <= currentStep) && (
                      <motion.div
                        className="h-full bg-emerald-500 absolute top-0 left-0 right-0"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                )}

                {/* Circle */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full z-10 transition-all duration-300",
                    isActive
                      ? "bg-emerald-500 text-white scale-110"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Line after */}
                {index < steps.length - 1 && (
                  <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {(isCompleted) && (
                      <motion.div
                        className="h-full bg-emerald-500 absolute top-0 left-0 right-0"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Step Name */}
              <span
                className={cn(
                  "text-xs mt-2 uppercase font-medium transition-colors",
                  isActive
                    ? "text-emerald-500 dark:text-emerald-400"
                    : isCompleted
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
