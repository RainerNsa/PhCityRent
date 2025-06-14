
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async (
    file: File,
    documentType: 'id_document' | 'selfie_with_id' | 'cac_document',
    applicationId: string
  ): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${applicationId}_${documentType}_${Date.now()}.${fileExt}`;
      
      // Determine bucket based on document type
      let bucketName = '';
      switch (documentType) {
        case 'id_document':
          bucketName = 'agent-id-photos';
          break;
        case 'selfie_with_id':
          bucketName = 'agent-selfies';
          break;
        case 'cac_document':
          bucketName = 'agent-cac-docs';
          break;
      }

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record to database
      const { error: dbError } = await supabase
        .from('verification_documents')
        .insert({
          application_id: applicationId,
          document_type: documentType,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      return { success: true, filePath: uploadData.path };
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  return { uploadDocument, uploading };
};
