
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentUpload } from "./useDocumentUpload";

interface ApplicationData {
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

interface DocumentFiles {
  idDocument?: File;
  selfieWithId?: File;
  cacDocument?: File;
}

export const useAgentApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadDocument } = useDocumentUpload();

  const submitApplication = async (
    applicationData: ApplicationData,
    documents: DocumentFiles
  ) => {
    setIsSubmitting(true);
    
    try {
      // Generate agent ID
      const { data: agentIdData, error: agentIdError } = await supabase
        .rpc('generate_agent_id', { applicant_name: applicationData.fullName });

      if (agentIdError) throw agentIdError;
      const agentId = agentIdData;

      // Create application
      const { data: application, error: applicationError } = await supabase
        .from('agent_applications')
        .insert({
          agent_id: agentId,
          full_name: applicationData.fullName,
          whatsapp_number: applicationData.whatsappNumber,
          email: applicationData.email,
          residential_address: applicationData.residentialAddress,
          operating_areas: applicationData.operatingAreas,
          is_registered_business: applicationData.isRegisteredBusiness,
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Create referee verification record
      await supabase
        .from('referee_verifications')
        .insert({
          application_id: application.id,
          referee_full_name: applicationData.refereeFullName,
          referee_whatsapp_number: applicationData.refereeWhatsappNumber,
          referee_role: applicationData.refereeRole,
        });

      // Upload documents if provided
      const uploadPromises = [];
      
      if (documents.idDocument) {
        uploadPromises.push(
          uploadDocument(documents.idDocument, 'id_document', application.id)
        );
      }
      
      if (documents.selfieWithId) {
        uploadPromises.push(
          uploadDocument(documents.selfieWithId, 'selfie_with_id', application.id)
        );
      }
      
      if (documents.cacDocument) {
        uploadPromises.push(
          uploadDocument(documents.cacDocument, 'cac_document', application.id)
        );
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      return { success: true, agentId };
    } catch (error) {
      console.error('Application submission error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplication, isSubmitting };
};
