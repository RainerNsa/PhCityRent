
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

export const useImageUpload = (options: UploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size
    if (options.maxSizeBytes && file.size > options.maxSizeBytes) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(options.maxSizeBytes / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;
      const fullPath = `${user.id}/${filePath}`;

      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(data.path);

      setUploadProgress(100);
      toast({
        title: "Upload successful",
        description: "Image uploaded successfully",
      });

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${options.folder ? options.folder + '/' : ''}${fileName}`;

      const { error } = await supabase.storage
        .from(options.bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: "Delete failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Image deleted",
        description: "Image deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    uploadProgress,
  };
};
