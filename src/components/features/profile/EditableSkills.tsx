'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface Skill {
  name: string;
  proficiency: number;
}

interface EditableSkillsProps {
  initialSkills: Skill[];
  onSave: (skills: Skill[]) => void;
  dictionary?: any;
}

export function EditableSkills({ initialSkills, onSave, dictionary }: EditableSkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const handleSave = () => {
    onSave(skills);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSkills(initialSkills);
    setIsEditing(false);
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', proficiency: 50 }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updated = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    setSkills(updated);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {dictionary?.profile?.sections?.skills || 'Skills'}
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

        <div className={`grid grid-cols-1 ${!isEditing ? 'md:grid-cols-2' : ''} gap-3`}>
          {skills.map((skill, index) => (
            <div key={index}>
              {!isEditing ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-emerald-400">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} className="h-1.5 bg-gray-800" />
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder={dictionary?.profile?.forms?.skillName || 'Skill name (e.g., React, TypeScript)'}
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => removeSkill(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{dictionary?.profile?.forms?.proficiency || 'Proficiency'}</span>
                      <span className="text-emerald-400">{skill.proficiency}%</span>
                    </div>
                    <Slider
                      value={[skill.proficiency]}
                      onValueChange={(value) => updateSkill(index, 'proficiency', value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
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
            onClick={addSkill}
          >
            <Plus size={12} className="mr-1" />
            {dictionary?.profile?.forms?.addSkill || 'Add Skill'}
          </Button>
        )}
      </div>
    </Card>
  );
}