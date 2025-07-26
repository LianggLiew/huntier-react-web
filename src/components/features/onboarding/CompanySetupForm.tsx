// Copilot: This component handles company information setup for recruiters
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ImageIcon } from "lucide-react";
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

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string().min(1, {
    message: "Please select an industry.",
  }),
});

interface CompanySetupFormProps {
  companyData: {
    name: string;
    industry: string;
    logo: File | null;
  };
  onDataChange: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Common industries list
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Media",
  "Transportation",
  "Construction",
  "Energy",
  "Agriculture",
  "Hospitality",
  "Other",
];

export default function CompanySetupForm({
  companyData,
  onDataChange,
  onContinue,
  onBack,
}: CompanySetupFormProps) {
  const [logo, setLogo] = useState<File | null>(companyData.logo);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: companyData.name || "",
      industry: companyData.industry || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onDataChange({
      companyName: values.companyName,
      industry: values.industry,
      logo: logo,
    });
    onContinue();
  }

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
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLogoUpload = (file: File) => {
    // Handle image validation
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      form.setError("root", {
        message: "Please upload a valid image file (JPEG, PNG, or SVG)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      form.setError("root", {
        message: "File size should be less than 5MB",
      });
      return;
    }

    setLogo(file);
    onDataChange({ logo: file });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    onDataChange({ logo: null });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Tell us about your company
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Let's set up your company profile to attract the best candidates
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
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
          >
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label>Company Logo</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging
                  ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-500/50"
                  : logoPreview
                  ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-500/50"
                  : "bg-gray-50 border-gray-300 dark:bg-slate-800/50 dark:border-slate-700"
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="flex flex-col items-center">
                {logoPreview ? (
                  <div className="mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative inline-block"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
                        <img
                          src={logoPreview}
                          alt="Company logo"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {logoPreview ? (
                    <>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {logo?.name}
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById("logo-upload")
                              ?.click()
                          }
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeLogo}
                        >
                          Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Drop your logo here or{" "}
                        <span
                          className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById("logo-upload")
                              ?.click()
                          }
                        >
                          browse
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or SVG (max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {form.formState.errors.root.message}
              </p>
            )}
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
    </div>
  );
}
