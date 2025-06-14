
import React from "react";
import { Upload } from "lucide-react";

interface DocumentUploadSectionProps {
  uploadedIdDocument: File | null;
  uploadedSelfie: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, fileType: 'id' | 'selfie') => void;
}

const DocumentUploadSection = ({ uploadedIdDocument, uploadedSelfie, onFileUpload }: DocumentUploadSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Identity Verification</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">NIN or Government ID</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onFileUpload(e, 'id')}
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
              onChange={(e) => onFileUpload(e, 'selfie')}
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
  );
};

export default DocumentUploadSection;
