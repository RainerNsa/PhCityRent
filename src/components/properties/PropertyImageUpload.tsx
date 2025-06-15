
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyImageUploadProps {
  propertyId?: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const PropertyImageUpload = ({
  propertyId,
  images,
  onImagesChange,
  maxImages = 10,
  className = '',
}: PropertyImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { uploadImage, deleteImage } = useImageUpload({
    bucket: 'property-images',
    folder: propertyId ? `properties/${propertyId}` : 'properties/temp',
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of files) {
      const url = await uploadImage(file);
      if (url) {
        newImages.push(url);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }

    setIsUploading(false);
    // Clear the input
    event.target.value = '';
  };

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    const success = await deleteImage(imageUrl);
    if (success) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Property Images</h3>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Property image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(image, index)}
            >
              <X className="w-3 h-3" />
            </Button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Main
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {canUploadMore && (
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              {isUploading ? (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1 animate-pulse" />
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-500">
            Upload up to {maxImages} images to showcase your property
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            multiple
            className="hidden"
            disabled={isUploading || !canUploadMore}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || !canUploadMore}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </span>
          </Button>
        </label>
      </div>

      <div className="text-xs text-gray-500">
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• First image will be used as the main property image</p>
      </div>
    </div>
  );
};

export default PropertyImageUpload;
