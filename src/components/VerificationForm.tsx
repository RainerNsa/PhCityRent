
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAgentApplication } from "@/hooks/useAgentApplication";
import VerificationFormHeader from "./verification/VerificationFormHeader";
import PersonalInfoSection from "./verification/PersonalInfoSection";
import OperatingAreasSection from "./verification/OperatingAreasSection";
import DocumentUploadSection from "./verification/DocumentUploadSection";
import BusinessInfoSection from "./verification/BusinessInfoSection";
import RefereeSection from "./verification/RefereeSection";
import VerificationFormFooter from "./verification/VerificationFormFooter";

const verificationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  whatsappNumber: z.string().min(10, "Please enter a valid WhatsApp number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  residentialAddress: z.string().min(10, "Please provide your full residential address"),
  operatingAreas: z.array(z.string()).min(1, "Please select at least one area you operate in"),
  idDocument: z.any().optional(),
  selfieWithId: z.any().optional(),
  isRegisteredBusiness: z.boolean(),
  cacDocument: z.any().optional(),
  refereeFullName: z.string().min(2, "Referee full name is required"),
  refereeWhatsappNumber: z.string().min(10, "Please enter referee's WhatsApp number"),
  refereeRole: z.string().min(2, "Please specify referee's role/relationship"),
  verificationType: z.enum(["agent", "landlord"]),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface VerificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: "agent" | "landlord";
}

const VerificationForm = ({ isOpen, onClose, type }: VerificationFormProps) => {
  const [uploadedIdDocument, setUploadedIdDocument] = useState<File | null>(null);
  const [uploadedSelfie, setUploadedSelfie] = useState<File | null>(null);
  const [uploadedCacDocument, setUploadedCacDocument] = useState<File | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const { toast } = useToast();
  const { submitApplication, isSubmitting } = useAgentApplication();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      fullName: "",
      whatsappNumber: "",
      email: "",
      residentialAddress: "",
      operatingAreas: [],
      refereeFullName: "",
      refereeWhatsappNumber: "",
      refereeRole: "",
      verificationType: type,
      isRegisteredBusiness: false,
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'id' | 'selfie' | 'cac') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (fileType === 'id') {
        setUploadedIdDocument(file);
        form.setValue("idDocument", file);
      } else if (fileType === 'selfie') {
        setUploadedSelfie(file);
        form.setValue("selfieWithId", file);
      } else if (fileType === 'cac') {
        setUploadedCacDocument(file);
        form.setValue("cacDocument", file);
      }
    }
  };

  const toggleArea = (area: string) => {
    const updatedAreas = selectedAreas.includes(area)
      ? selectedAreas.filter(a => a !== area)
      : [...selectedAreas, area];
    
    setSelectedAreas(updatedAreas);
    form.setValue("operatingAreas", updatedAreas);
  };

  const onSubmit = async (data: VerificationFormData) => {
    try {
      const applicationData = {
        fullName: data.fullName,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        residentialAddress: data.residentialAddress,
        operatingAreas: data.operatingAreas,
        isRegisteredBusiness: data.isRegisteredBusiness,
        refereeFullName: data.refereeFullName,
        refereeWhatsappNumber: data.refereeWhatsappNumber,
        refereeRole: data.refereeRole,
      };

      const documents = {
        idDocument: uploadedIdDocument || undefined,
        selfieWithId: uploadedSelfie || undefined,
        cacDocument: uploadedCacDocument || undefined,
      };

      const result = await submitApplication(applicationData, documents);
      
      if (result.success) {
        toast({
          title: "Verification Application Submitted!",
          description: `Your ${type} verification application has been submitted with ID: ${result.agentId}. Our team will review your documents and contact your referee within 24-48 hours. You'll receive updates via WhatsApp.`,
        });
        
        form.reset();
        setUploadedIdDocument(null);
        setUploadedSelfie(null);
        setUploadedCacDocument(null);
        setSelectedAreas([]);
        onClose();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support on WhatsApp.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <VerificationFormHeader type={type} onClose={onClose} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoSection form={form} />
              
              <OperatingAreasSection 
                form={form} 
                selectedAreas={selectedAreas} 
                onToggleArea={toggleArea} 
              />
              
              <DocumentUploadSection 
                uploadedIdDocument={uploadedIdDocument}
                uploadedSelfie={uploadedSelfie}
                onFileUpload={handleFileUpload}
              />
              
              <BusinessInfoSection 
                form={form}
                uploadedCacDocument={uploadedCacDocument}
                onFileUpload={handleFileUpload}
              />
              
              <RefereeSection form={form} />
              
              <VerificationFormFooter 
                isSubmitting={isSubmitting}
                onClose={onClose}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
