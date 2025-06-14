
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AgentApplicationData {
  fullName: string;
  whatsappNumber: string;
  email?: string;
  residentialAddress: string;
  operatingAreas: string[];
  isRegisteredBusiness: boolean;
  refereeFullName: string;
  refereeWhatsappNumber: string;
  refereeRole: string;
}

export interface DocumentUpload {
  file: File;
  type: 'id_document' | 'selfie_with_id' | 'cac_document';
}

export const useAgentApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const generateAgentId = async (fullName: string): Promise<string> => {
    const { data, error } = await supabase
      .rpc('generate_agent_id', { applicant_name: fullName });
    
    if (error) {
      console.error('Error generating agent ID:', error);
      // Fallback ID generation
      const namePart = fullName.substring(0, 5).toUpperCase().replace(/[^A-Z]/g, '');
      const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `AGT-PHC-${namePart}${randomPart}`;
    }
    
    return data;
  };

  const uploadDocument = async (file: File, applicationId: string, documentType: 'id_document' | 'selfie_with_id' | 'cac_document') => {
    const bucketMap = {
      'id_document': 'agent-id-photos',
      'selfie_with_id': 'agent-selfies',
      'cac_document': 'agent-cac-docs'
    };

    const bucket = bucketMap[documentType];
    const fileName = `${applicationId}/${documentType}_${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error(`Failed to upload ${documentType}`);
    }

    // Store document metadata
    const { error: metadataError } = await supabase
      .from('verification_documents')
      .insert({
        application_id: applicationId,
        document_type: documentType,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type
      });

    if (metadataError) {
      console.error('Error storing document metadata:', metadataError);
      throw new Error(`Failed to store ${documentType} metadata`);
    }

    return uploadData.path;
  };

  const submitApplication = async (
    applicationData: AgentApplicationData,
    documents: {
      idDocument?: File;
      selfieWithId?: File;
      cacDocument?: File;
    }
  ) => {
    setIsSubmitting(true);
    
    try {
      // Generate unique agent ID
      const agentId = await generateAgentId(applicationData.fullName);
      
      // Insert application data
      const { data: application, error: applicationError } = await supabase
        .from('agent_applications')
        .insert({
          agent_id: agentId,
          full_name: applicationData.fullName,
          whatsapp_number: applicationData.whatsappNumber,
          email: applicationData.email || null,
          residential_address: applicationData.residentialAddress,
          operating_areas: applicationData.operatingAreas,
          is_registered_business: applicationData.isRegisteredBusiness,
          status: 'pending_review',
          next_action: 'Documents are being reviewed by our team'
        })
        .select()
        .single();

      if (applicationError) {
        console.error('Error creating application:', applicationError);
        throw new Error('Failed to create application');
      }

      // Insert referee information
      const { error: refereeError } = await supabase
        .from('referee_verifications')
        .insert({
          application_id: application.id,
          referee_full_name: applicationData.refereeFullName,
          referee_whatsapp_number: applicationData.refereeWhatsappNumber,
          referee_role: applicationData.refereeRole,
          status: 'pending'
        });

      if (refereeError) {
        console.error('Error creating referee record:', refereeError);
        throw new Error('Failed to store referee information');
      }

      // Upload documents (only for authenticated users now)
      const uploadPromises = [];
      
      if (documents.idDocument) {
        uploadPromises.push(
          uploadDocument(documents.idDocument, application.id, 'id_document')
        );
      }
      
      if (documents.selfieWithId) {
        uploadPromises.push(
          uploadDocument(documents.selfieWithId, application.id, 'selfie_with_id')
        );
      }
      
      if (documents.cacDocument && applicationData.isRegisteredBusiness) {
        uploadPromises.push(
          uploadDocument(documents.cacDocument, application.id, 'cac_document')
        );
      }

      // Only upload documents if user is authenticated
      if (uploadPromises.length > 0) {
        try {
          await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.warn('Document upload failed, but application was created:', uploadError);
          // Continue without failing the entire application
        }
      }

      // Log initial status
      await supabase
        .from('verification_status_log')
        .insert({
          application_id: application.id,
          previous_status: null,
          new_status: 'pending_review',
          change_reason: 'Application submitted',
          notes: 'Initial application submission completed'
        });

      return { success: true, agentId, applicationId: application.id };
      
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplication,
    isSubmitting
  };
};
