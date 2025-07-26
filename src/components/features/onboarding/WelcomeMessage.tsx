// Copilot: This component displays a welcome message and intro for the onboarding process
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  userType: "job-seeker" | "recruiter";
  onContinue: () => void;
}

export default function WelcomeMessage({ userType, onContinue }: WelcomeMessageProps) {
  const message =
    userType === "job-seeker"
      ? "👋 Welcome! I'm your AI career assistant. Let's build your future together."
      : "👋 Welcome! Let's find your next top hire — faster and smarter.";

  const description =
    userType === "job-seeker"
      ? "We'll help you find the perfect job match based on your skills and experience."
      : "We'll help you find the perfect candidate match based on your requirements.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6"
        variants={itemVariants}
      >
        <span className="text-4xl">👋</span>
      </motion.div>

      <motion.h1
        className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
        variants={itemVariants}
      >
        {message}
      </motion.h1>

      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      <motion.div variants={itemVariants}>
        <Button
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 rounded-full font-medium text-lg"
          onClick={onContinue}
        >
          Get Started
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Button>
      </motion.div>
    </motion.div>
  );
}
