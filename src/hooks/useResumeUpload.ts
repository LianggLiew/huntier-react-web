import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseResumeUploadOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  maxSize?: number; // in bytes, default 5MB
  allowedTypes?: string[];
  showToasts?: boolean; // default true
}

interface UseResumeUploadReturn {
  uploadResume: (file: File) => Promise<boolean>;
  triggerFileSelect: () => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  validateFile: (file: File) => { isValid: boolean; error?: string };
}

export const useResumeUpload = (options: UseResumeUploadOptions = {}): UseResumeUploadReturn => {
  const {
    onSuccess,
    onError,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    showToasts = true
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a PDF or DOCX file.'
      };
    }

    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        isValid: false,
        error: `File size should be less than ${sizeMB}MB.`
      };
    }

    return { isValid: true };
  };

  const uploadResume = async (file: File): Promise<boolean> => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      if (showToasts) {
        toast({
          title: 'Invalid File',
          description: validation.error!,
          variant: 'destructive'
        });
      }
      onError?.(validation.error!);
      return false;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (showToasts) {
          toast({
            title: 'Resume Uploaded',
            description: 'Your resume has been uploaded successfully.'
          });
        }
        onSuccess?.(result);
        return true;
      } else {
        throw new Error(result.error || 'Failed to upload resume');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to upload your resume. Please try again later.';
      
      if (showToasts) {
        toast({
          title: 'Upload Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      onError?.(errorMessage);
      return false;
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await uploadResume(file);
  };

  return {
    uploadResume,
    triggerFileSelect,
    handleFileSelect,
    isUploading,
    fileInputRef,
    validateFile
  };
};