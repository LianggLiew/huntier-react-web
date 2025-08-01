'use client';

import { useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Plus, Trash2, ExternalLink } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  technologiesString?: string;
  isEmpty?: boolean;
}

interface EditableProjectsProps {
  initialProjects: Project[];
  onSave: (projects: Project[]) => void;
  dictionary?: any;
}

export function EditableProjects({ initialProjects, onSave, dictionary }: EditableProjectsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Update local state when initialProjects prop changes
  React.useEffect(() => {
    if (!isEditing) {
      setProjects(initialProjects);
    }
  }, [initialProjects, isEditing]);

  const handleEditStart = () => {
    // If we have empty state templates, start with a clean empty entry
    if (initialProjects.length === 1 && initialProjects[0].isEmpty) {
      setProjects([{ name: '', description: '', technologies: [], technologiesString: '' }]);
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    // Check if all projects have required fields filled
    const hasEmptyFields = projects.some(project => 
      !project.name.trim() || !project.description.trim()
    );
    
    if (hasEmptyFields) {
      // Don't save if there are empty required fields
      return;
    }
    
    // Parse technologies strings and filter out empty projects before saving
    const processedProjects = projects
      .filter(project => project.name.trim() && project.description.trim()) // Filter out empty projects
      .map(project => ({
        ...project,
        technologies: project.technologiesString 
          ? parseTechnologies(project.technologiesString)
          : project.technologies,
        technologiesString: undefined // Remove temporary field
      }));
    onSave(processedProjects);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProjects(initialProjects);
    setIsEditing(false);
  };

  const addProject = () => {
    setProjects([...projects, { name: '', description: '', technologies: [], technologiesString: '' }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    setProjects(updated);
  };

  const updateTechnologiesString = (index: number, techString: string) => {
    // Store the raw string in a temporary field for editing
    updateProject(index, 'technologiesString' as keyof Project, techString);
  };

  const parseTechnologies = (techString: string): string[] => {
    return techString.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
  };

  const isFieldEmpty = (project: Project, field: keyof Project) => {
    const value = project[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  };

  const hasEmptyRequiredFields = () => {
    return projects.some(project => 
      isFieldEmpty(project, 'name') || isFieldEmpty(project, 'description')
    );
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {dictionary?.profile?.sections?.projects || 'Projects'}
          </h2>
          {!isEditing ? (
            <Button 
              size="sm" 
              className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              onClick={handleEditStart}
            >
              <Edit size={12} className="mr-1" />
              {dictionary?.profile?.buttons?.edit || 'Edit'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className={`h-7 px-2 text-xs ${
                  hasEmptyRequiredFields() 
                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                onClick={handleSave}
                disabled={hasEmptyRequiredFields()}
              >
                <Save size={12} className="mr-1" />
                {dictionary?.profile?.buttons?.save || 'Save'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleCancel}
              >
                <X size={12} className="mr-1" />
                {dictionary?.profile?.buttons?.cancel || 'Cancel'}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index}>
              {!isEditing ? (
                <div className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white text-sm">{project.name}</h3>
                    <Button variant="ghost" size="sm" className="h-6 px-1 text-emerald-400 hover:text-emerald-300 hover:bg-transparent">
                      <ExternalLink size={12} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs px-2 py-0.5">{tech}</Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-800/30 rounded-lg space-y-3 border border-gray-700/50">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder={dictionary?.profile?.forms?.projectName || 'Project name'}
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className={`flex-1 bg-gray-700 text-gray-300 ${
                        isFieldEmpty(project, 'name') ? 'border-red-500 focus:border-red-500' : 'border-gray-600'
                      }`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <Textarea
                    placeholder={dictionary?.profile?.forms?.projectDescription || 'Project description, key features, and impact...'}
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className={`min-h-[80px] bg-gray-700 text-gray-300 resize-none ${
                      isFieldEmpty(project, 'description') ? 'border-red-500 focus:border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <div className="space-y-2">
                    <Input
                      placeholder={dictionary?.profile?.forms?.technologies || 'Technologies (comma-separated, e.g., React, Node.js, PostgreSQL)'}
                      value={project.technologiesString ?? project.technologies.join(', ')}
                      onChange={(e) => updateTechnologiesString(index, e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-300"
                    />
                    {(project.technologiesString ? parseTechnologies(project.technologiesString) : project.technologies).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {(project.technologiesString ? parseTechnologies(project.technologiesString) : project.technologies).map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="bg-gray-600 text-gray-200 text-xs px-2 py-0.5">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <Button
            size="sm"
            variant="outline"
            className="mt-4 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
            onClick={addProject}
          >
            <Plus size={12} className="mr-1" />
            {dictionary?.profile?.forms?.addProject || 'Add Project'}
          </Button>
        )}
      </div>
    </Card>
  );
}