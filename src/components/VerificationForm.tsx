
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, UserCheck, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const verificationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  whatsappNumber: z.string().min(10, "Please enter a valid WhatsApp number"),
  propertyLocations: z.string().min(5, "Please describe your property locations"),
  idDocument: z.any().optional(),
  referenceContact: z.string().min(5, "Please provide a reference contact"),
  verificationType: z.enum(["agent", "landlord"]),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface VerificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: "agent" | "landlord";
}

const VerificationForm = ({ isOpen, onClose, type }: VerificationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      fullName: "",
      whatsappNumber: "",
      propertyLocations: "",
      referenceContact: "",
      verificationType: type,
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedFile(file);
      form.setValue("idDocument", file);
    }
  };

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - in real app, this would send to your backend/Airtable
      console.log("Verification form data:", data);
      console.log("Uploaded file:", uploadedFile);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted!",
        description: `Your ${type} verification application has been submitted. We'll review it within 24-48 hours and contact you via WhatsApp.`,
      });
      
      form.reset();
      setUploadedFile(null);
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-pulse-100 p-2 rounded-lg">
                <UserCheck className="w-6 h-6 text-pulse-600" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">
                  {type === "agent" ? "Agent" : "Landlord"} Verification
                </h2>
                <p className="text-sm text-gray-600">Get verified to build trust</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 801 234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Locations</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List the areas/locations where you operate (e.g., GRA, Trans Amadi, Eliozu)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">ID Document Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="id-upload"
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFile ? uploadedFile.name : "Click to upload ID (PDF, JPG, PNG)"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                  </label>
                </div>
              </div>

              <FormField
                control={form.control}
                name="referenceContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Contact</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide contact details of a past client or landlord who can vouch for you"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-pulse-500 hover:bg-pulse-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
