'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName: string;
  onImageSave: (imageData: string) => void;
}

export function ProfilePictureUpload({ currentImage, userName, onImageSave }: ProfilePictureUploadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleSave = () => {
    if (selectedImage) {
      onImageSave(selectedImage);
      // Save to localStorage
      localStorage.setItem('userProfileImage', selectedImage);
      setIsEditing(false);
      setSelectedImage(null);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="relative group">
        <Avatar className="h-20 w-20 border-2 border-emerald-500 cursor-pointer" onClick={() => setIsEditing(true)}>
          {currentImage ? (
            <img src={currentImage} alt={userName} className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(userName)}
            </div>
          )}
        </Avatar>
        
        {/* Camera overlay on hover */}
        <div 
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <Camera size={20} className="text-white" />
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              Update Profile Picture
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current/Preview Image */}
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-2 border-emerald-500">
                {selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-full" />
                ) : currentImage ? (
                  <img src={currentImage} alt={userName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(userName)}
                  </div>
                )}
              </Avatar>
            </div>

            {/* Upload Area */}
            <Card 
              className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
                dragOver 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-emerald-500/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={triggerFileInput}
            >
              <div className="p-6 text-center">
                <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-emerald-500' : 'text-gray-400'}`} />
                <p className="text-gray-300 mb-2">
                  {dragOver ? 'Drop your image here' : 'Drag & drop your image here'}
                </p>
                <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  Choose File
                </Button>
              </div>
            </Card>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-xs text-gray-500 text-center">
              Supported formats: JPG, PNG, GIF (max 5MB)
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!selectedImage}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} className="mr-2" />
                Save Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}