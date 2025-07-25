'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';

interface EditableAboutProps {
  initialAbout: string;
  onSave: (about: string) => void;
  dictionary?: any;
}

export function EditableAbout({ initialAbout, onSave, dictionary }: EditableAboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(initialAbout);

  const handleSave = () => {
    // Validate that the about field is not empty
    if (!about.trim()) {
      return; // Don't save if the field is empty
    }
    
    onSave(about);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAbout(initialAbout);
    setIsEditing(false);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {dictionary?.profile?.sections?.about || 'About'}
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
        
        {!isEditing ? (
          <p className="text-gray-300 text-sm leading-relaxed">{about}</p>
        ) : (
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself..."
              className={`min-h-[120px] bg-transparent text-gray-300 resize-none focus:ring-0 focus:outline-none ${
                !about.trim() ? 'border-red-500 border-2 rounded' : 'border-none'
              }`}
              maxLength={500}
            />
          </div>
        )}
        
        {isEditing && (
          <div className="mt-3 flex justify-between items-center text-xs">
            <div className="text-gray-500">Maximum 500 characters</div>
            <div className={`font-medium ${
              about.length > 450 ? 'text-yellow-400' : 
              about.length > 480 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {about.length}/500
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}