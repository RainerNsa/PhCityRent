
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Upload, Building } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BusinessInfoSectionProps {
  form: UseFormReturn<any>;
  uploadedCacDocument: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, fileType: 'cac') => void;
}

const BusinessInfoSection = ({ form, uploadedCacDocument, onFileUpload }: BusinessInfoSectionProps) => {
  return (
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
              onChange={(e) => onFileUpload(e, 'cac')}
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
  );
};

export default BusinessInfoSection;
