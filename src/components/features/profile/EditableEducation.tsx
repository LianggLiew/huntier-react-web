'use client';

import { useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface Education {
  degree: string;
  institution: string;
  period: string;
  isEmpty?: boolean;
}

interface EditableEducationProps {
  initialEducation: Education[];
  onSave: (education: Education[]) => void;
  dictionary?: any;
}

export function EditableEducation({ initialEducation, onSave, dictionary }: EditableEducationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [education, setEducation] = useState<Education[]>(initialEducation);

  // Update local state when initialEducation prop changes
  React.useEffect(() => {
    if (!isEditing) {
      setEducation(initialEducation);
    }
  }, [initialEducation, isEditing]);

  const handleEditStart = () => {
    // If we have empty state templates, start with a clean empty entry
    if (initialEducation.length === 1 && initialEducation[0].isEmpty) {
      setEducation([{ degree: '', institution: '', period: '' }]);
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    // Validate that all required fields are filled
    const hasEmptyRequiredFields = education.some(edu => 
      !edu.degree.trim() || !edu.institution.trim() || !edu.period.trim()
    );
    
    if (hasEmptyRequiredFields) {
      return; // Don't save if there are empty fields
    }
    
    onSave(education);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEducation(initialEducation);
    setIsEditing(false);
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', period: '' }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {dictionary?.profile?.sections?.education || 'Education'}
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
                className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSave}
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

        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
              {!isEditing ? (
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-white">{edu.degree}</h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <span className="mr-1">🎓</span>
                        <span>{edu.institution}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{edu.period}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder={dictionary?.profile?.forms?.degree || 'Degree (e.g., Bachelor of Science in Computer Science)'}
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className={`flex-1 bg-gray-800 text-gray-300 ${
                        !edu.degree.trim() ? 'border-red-500 border-2' : 'border-gray-700'
                      }`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder={dictionary?.profile?.forms?.institution || 'Institution'}
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      className={`bg-gray-800 text-gray-300 ${
                        !edu.institution.trim() ? 'border-red-500 border-2' : 'border-gray-700'
                      }`}
                    />
                    <Input
                      placeholder="Period (e.g., 2018 - 2022)"
                      value={edu.period}
                      onChange={(e) => updateEducation(index, 'period', e.target.value)}
                      className={`bg-gray-800 text-gray-300 ${
                        !edu.period.trim() ? 'border-red-500 border-2' : 'border-gray-700'
                      }`}
                    />
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
            onClick={addEducation}
          >
            <Plus size={12} className="mr-1" />
            {dictionary?.profile?.forms?.addEducation || 'Add Education'}
          </Button>
        )}
      </div>
    </Card>
  );
}