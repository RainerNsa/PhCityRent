
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Upload, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (url: string) => void;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUpload = ({
  currentAvatar,
  onAvatarChange,
  fallbackText = 'U',
  size = 'md',
}: AvatarUploadProps) => {
  const { uploadImage, isUploading } = useImageUpload({
    bucket: 'user-avatars',
    folder: 'avatars',
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      onAvatarChange(url);
    }
    
    // Clear the input
    event.target.value = '';
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentAvatar} alt="Profile picture" />
        <AvatarFallback>
          <User className="w-1/2 h-1/2" />
        </AvatarFallback>
      </Avatar>

      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          asChild
        >
          <span>
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Change Avatar'}
          </span>
        </Button>
      </label>
    </div>
  );
};

export default AvatarUpload;
