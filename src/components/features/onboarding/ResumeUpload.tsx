// Copilot: This component renders a drag-and-drop upload for resumes (.pdf/.docx)
// TODO: This component can be refactored to use the useResumeUpload hook for consistency
// Example usage:
// const { uploadResume, isUploading, validateFile } = useResumeUpload({
//   onSuccess: (result) => onFileUpload(result.file),
//   showToasts: false // handle errors locally
// });

"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Linkedin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  onFileUpload: (file: File) => void;
  onLinkedInChange: (url: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ResumeUpload({
  onFileUpload,
  onLinkedInChange,
  onContinue,
  onBack,
}: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [hasLinkedin, setHasLinkedin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileType = file.type;
    
    if (!allowedTypes.includes(fileType)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size should be less than 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileUpload(file);
    setHasLinkedin(false); // Reset LinkedIn option if file is uploaded
  };

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLinkedinUrl(url);
    onLinkedInChange(url);
  };

  const toggleLinkedInOption = () => {
    setHasLinkedin(!hasLinkedin);
    if (!hasLinkedin) {
      setSelectedFile(null);
    }
  };

  const canContinue = (selectedFile !== null) || (hasLinkedin && linkedinUrl.includes('linkedin.com/'));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Upload your resume
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We'll extract your information to find the best job matches
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {!hasLinkedin && (
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 ease-in-out relative",
              isDragging
                ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-500/50"
                : selectedFile
                ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-500/50"
                : "bg-gray-50 border-gray-300 dark:bg-slate-800/50 dark:border-slate-700"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />

            <div className="flex flex-col items-center">
              {selectedFile ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-emerald-500 dark:text-emerald-400 mb-4"
                >
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3">
                    <FileText size={32} />
                  </div>
                </motion.div>
              ) : (
                <div className="text-emerald-500 dark:text-emerald-400 mb-4">
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3">
                    <Upload size={32} />
                  </div>
                </div>
              )}

              <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
                {selectedFile ? selectedFile.name : "Drag & drop your resume here"}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "PDF or DOCX files (max 5MB)"}
              </p>

              {!selectedFile && (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Browse Files
                </Button>
              )}

              {selectedFile && (
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  variant="outline"
                  size="sm"
                >
                  Remove File
                </Button>
              )}
            </div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </motion.div>
        )}

        <div className="mt-6">
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
            <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
          </div>

          <Button
            onClick={toggleLinkedInOption}
            variant={hasLinkedin ? "secondary" : "outline"}
            className={cn(
              "w-full flex items-center justify-center",
              hasLinkedin && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            )}
          >
            <Linkedin className="h-5 w-5 mr-2" />
            Use LinkedIn Profile
          </Button>

          {hasLinkedin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <Input
                className="w-full"
                placeholder="Paste your LinkedIn profile URL"
                value={linkedinUrl}
                onChange={handleLinkedInChange}
              />
              {linkedinUrl && !linkedinUrl.includes('linkedin.com/') && (
                <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Please enter a valid LinkedIn URL
                </p>
              )}
            </motion.div>
          )}
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
          disabled={!canContinue}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
