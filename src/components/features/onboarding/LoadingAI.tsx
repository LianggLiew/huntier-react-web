// Copilot: This component provides loading animations for AI processes
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingAIProps {
  text?: string;
  className?: string;
}

export default function LoadingAI({ text, className }: LoadingAIProps) {
  // Create a pulsing animation for text
  const textVariants = {
    hidden: { opacity: 0.5 },
    visible: { opacity: 1 },
  };

  // Create a floating animation for the "brain"
  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Create a pulse animation for the rings around the brain
  const circleVariants = {
    pulse: (i: number) => ({
      scale: [1, 1.2, 1],
      opacity: [0.6, 0.3, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.2,
      },
    }),
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      <div className="relative">
        {/* Pulse circles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-emerald-300 dark:border-emerald-600"
            initial={{ scale: 1, opacity: 0.6 }}
            variants={circleVariants}
            animate="pulse"
            custom={i}
            style={{
              width: `${100 + i * 30}%`,
              height: `${100 + i * 30}%`,
              left: `${-(i * 15)}%`,
              top: `${-(i * 15)}%`,
            }}
          />
        ))}

        {/* Brain icon or AI symbol */}
        <motion.div
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white"
          variants={floatingVariants}
          animate="float"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"></path>
            <circle cx="12" cy="10" r="1"></circle>
            <path d="M12 13v3"></path>
            <path d="m9 15 1-1"></path>
            <path d="m14 15-1-1"></path>
          </svg>
        </motion.div>
      </div>

      {text && (
        <motion.p
          className="mt-6 text-gray-600 dark:text-gray-300 text-center font-medium"
          variants={textVariants}
          initial="hidden"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}

      <div className="mt-4 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
