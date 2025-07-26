'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface EditableExperienceProps {
  initialExperience: Experience[];
  onSave: (experience: Experience[]) => void;
  dictionary?: any;
}

export function EditableExperience({ initialExperience, onSave, dictionary }: EditableExperienceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);

  const handleSave = () => {
    // Validate that all required fields are filled
    const hasEmptyRequiredFields = experience.some(exp => 
      !exp.title.trim() || !exp.company.trim() || !exp.period.trim() || !exp.description.trim()
    );
    
    if (hasEmptyRequiredFields) {
      return; // Don't save if there are empty fields
    }
    
    onSave(experience);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setExperience(initialExperience);
    setIsEditing(false);
  };

  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', period: '', description: '' }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperience(updated);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {dictionary?.profile?.sections?.experience || 'Experience'}
          </h2>
          {!isEditing ? (
            <Button 
              size="sm" 
              className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              onClick={() => setIsEditing(true)}
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
          {experience.map((exp, index) => (
            <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
              {!isEditing ? (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-white">{exp.title}</h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <span className="mr-1">🏢</span>
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{exp.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ) : (
                <div className="space-y-3 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder={dictionary?.profile?.forms?.jobTitle || 'Job Title'}
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      className={`flex-1 bg-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                        !exp.title.trim() ? 'border-red-500 border-2' : 'border-gray-600'
                      }`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder={dictionary?.profile?.forms?.company || 'Company'}
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className={`bg-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                        !exp.company.trim() ? 'border-red-500 border-2' : 'border-gray-600'
                      }`}
                    />
                    <Input
                      placeholder={dictionary?.profile?.forms?.period || 'Period (e.g., Jan 2021 - Present)'}
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      className={`bg-gray-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                        !exp.period.trim() ? 'border-red-500 border-2' : 'border-gray-600'
                      }`}
                    />
                  </div>
                  <Textarea
                    placeholder={dictionary?.profile?.forms?.description || 'Job description and achievements...'}
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className={`min-h-[80px] bg-gray-700 text-gray-300 resize-none focus:border-emerald-500 focus:ring-emerald-500/20 ${
                      !exp.description.trim() ? 'border-red-500 border-2' : 'border-gray-600'
                    }`}
                  />
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
            onClick={addExperience}
          >
            <Plus size={12} className="mr-1" />
            {dictionary?.profile?.forms?.addExperience || 'Add Experience'}
          </Button>
        )}
      </div>
    </Card>
  );
}