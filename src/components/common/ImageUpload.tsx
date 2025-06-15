
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
  className?: string;
  children?: React.ReactNode;
}

const ImageUpload = ({
  bucket,
  folder,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onUploadComplete,
  onUploadError,
  currentImage,
  className = '',
  children,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { uploadImage, deleteImage, isUploading, uploadProgress } = useImageUpload({
    bucket,
    folder,
    maxSizeBytes,
    allowedTypes,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    const url = await uploadImage(file);
    if (url) {
      onUploadComplete?.(url);
    } else {
      onUploadError?.('Upload failed');
      setPreview(currentImage || null);
    }
  };

  const handleRemove = async () => {
    if (currentImage) {
      const success = await deleteImage(currentImage);
      if (success) {
        setPreview(null);
        onUploadComplete?.('');
      }
    } else {
      setPreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full max-w-sm h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {children || (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload an image</p>
              <p className="text-sm text-gray-500">
                Max size: {Math.round(maxSizeBytes / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {preview ? 'Change Image' : 'Upload Image'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
