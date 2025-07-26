'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface EditableCertificationsProps {
  initialCertifications: Certification[];
  onSave: (certifications: Certification[]) => void;
  dictionary?: any;
}

export function EditableCertifications({ initialCertifications, onSave, dictionary }: EditableCertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);

  const handleSave = () => {
    onSave(certifications);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCertifications(initialCertifications);
    setIsEditing(false);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', year: '' }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = certifications.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    );
    setCertifications(updated);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {dictionary?.profile?.sections?.certifications || 'Certifications'}
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

        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={index}>
              {!isEditing ? (
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white text-sm">{cert.name}</h3>
                    <p className="text-xs text-gray-400">{cert.issuer}</p>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap">{cert.year}</span>
                </div>
              ) : (
                <div className="p-4 bg-gray-800/30 rounded-lg space-y-3 border border-gray-700/50">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder={dictionary?.profile?.forms?.certificationName || 'Certification name'}
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder={dictionary?.profile?.forms?.issuer || 'Issuing organization'}
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-300"
                    />
                    <Input
                      placeholder={dictionary?.profile?.forms?.year || 'Year (e.g., 2023)'}
                      value={cert.year}
                      onChange={(e) => updateCertification(index, 'year', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-300"
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
            onClick={addCertification}
          >
            <Plus size={12} className="mr-1" />
            {dictionary?.profile?.forms?.addCertification || 'Add Certification'}
          </Button>
        )}
      </div>
    </Card>
  );
}