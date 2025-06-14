
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, UserCheck, X, Shield, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const portHarcourtAreas = [
  "GRA (Government Residential Area)",
  "Trans Amadi",
  "D-Line",
  "Woji",
  "Ada-George",
  "Eliozu",
  "Eagle Island",
  "Old GRA",
  "New GRA",
  "Rumuola",
  "Rumukrushi",
  "Rumuigbo",
  "Choba",
  "Aluu",
  "Mgbuoba",
  "Port Harcourt Township",
  "Mile 1",
  "Mile 2",
  "Mile 3",
  "Diobu",
  "Rumuwoji",
  "Ozuoba"
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedIdDocument, setUploadedIdDocument] = useState<File | null>(null);
  const [uploadedSelfie, setUploadedSelfie] = useState<File | null>(null);
  const [uploadedCacDocument, setUploadedCacDocument] = useState<File | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const { toast } = useToast();

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
    setIsSubmitting(true);
    
    try {
      // Generate unique agent ID
      const agentId = `AGT-PHC-${data.fullName.substring(0, 5).toUpperCase()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Simulate form submission with all the enhanced data
      console.log("Enhanced verification form data:", {
        ...data,
        agentId,
        submittedAt: new Date().toISOString(),
        status: "pending_review"
      });
      
      // Log file uploads
      console.log("Uploaded files:", {
        idDocument: uploadedIdDocument?.name,
        selfieWithId: uploadedSelfie?.name,
        cacDocument: uploadedCacDocument?.name
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Verification Application Submitted!",
        description: `Your ${type} verification application has been submitted with ID: ${agentId}. Our team will review your documents and contact your referee within 24-48 hours. You'll receive updates via WhatsApp.`,
      });
      
      form.reset();
      setUploadedIdDocument(null);
      setUploadedSelfie(null);
      setUploadedCacDocument(null);
      setSelectedAreas([]);
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-pulse-100 p-2 rounded-lg">
                <UserCheck className="w-6 h-6 text-pulse-600" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">
                  {type === "agent" ? "Agent" : "Landlord"} Verification - PHCityRent
                </h2>
                <p className="text-sm text-gray-600">Get verified to build trust in Port Harcourt</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Why We Verify</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  PHCityRent only works with verified agents to protect Port Harcourt renters from scams. 
                  Your referee will be contacted to confirm your trustworthiness.
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Personal Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (as on ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="Emeka Okafor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 803 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="emeka@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="residentialAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="123 Trans Amadi Industrial Layout, Port Harcourt, Rivers State"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Operating Areas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Areas You Operate In
                </h3>
                <p className="text-sm text-gray-600">Select all areas in Port Harcourt where you work:</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {portHarcourtAreas.map((area) => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAreas.includes(area)}
                        onChange={() => toggleArea(area)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>
                {form.formState.errors.operatingAreas && (
                  <p className="text-sm text-red-600">{form.formState.errors.operatingAreas.message}</p>
                )}
              </div>

              {/* Document Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Identity Verification</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NIN or Government ID</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'id')}
                        className="hidden"
                        id="id-upload"
                      />
                      <label htmlFor="id-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadedIdDocument ? uploadedIdDocument.name : "Upload ID Document"}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selfie Holding ID</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'selfie')}
                        className="hidden"
                        id="selfie-upload"
                      />
                      <label htmlFor="selfie-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadedSelfie ? uploadedSelfie.name : "Upload Selfie with ID"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    🚨 <strong>Important:</strong> Your selfie must clearly show your face and the ID document. 
                    This helps us prevent identity fraud and keeps PHCityRent safe.
                  </p>
                </div>
              </div>

              {/* Business Registration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="isRegisteredBusiness"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Are you a registered business?
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          Check this if you have a CAC registration
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("isRegisteredBusiness") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CAC Registration Document</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'cac')}
                        className="hidden"
                        id="cac-upload"
                      />
                      <label htmlFor="cac-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadedCacDocument ? uploadedCacDocument.name : "Upload CAC Document"}
                        </p>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Referee Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Referee Information</h3>
                <p className="text-sm text-gray-600">
                  Provide someone who can vouch for your trustworthiness (past client, landlord, pastor, etc.)
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="refereeFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referee Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Chief Williams Okoro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="refereeWhatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referee WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 805 987 6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="refereeRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referee Role/Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Past client, Landlord, Pastor, Business partner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-6">
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
                  {isSubmitting ? "Submitting Application..." : "Submit for Verification"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Our team reviews your documents (24-48 hours)</li>
              <li>2. We contact your referee via WhatsApp</li>
              <li>3. You receive approval/rejection notification</li>
              <li>4. Approved agents get a unique Agent ID and dashboard access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
