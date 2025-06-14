
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_size: number;
}

interface ApplicationDocumentsProps {
  documents: Document[];
  onViewDocument: (document: Document) => void;
}

const ApplicationDocuments = ({ documents, onViewDocument }: ApplicationDocumentsProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Documents ({documents.length})
      </h3>
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{doc.document_type.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{doc.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewDocument(doc)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No documents uploaded</p>
      )}
    </Card>
  );
};

export default ApplicationDocuments;
