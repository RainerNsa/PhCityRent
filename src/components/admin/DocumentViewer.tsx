
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type?: string;
}

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!document) return;

    try {
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Document download has started",
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'id_document':
        return 'ID Document';
      case 'selfie_with_id':
        return 'Selfie with ID';
      case 'cac_document':
        return 'CAC Document';
      default:
        return type.replace('_', ' ').toUpperCase();
    }
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {getDocumentTypeLabel(document.document_type)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-600">File Name:</label>
              <p>{document.file_name}</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">File Size:</label>
              <p>{(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Type:</label>
              <p>{getDocumentTypeLabel(document.document_type)}</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Format:</label>
              <p>{document.mime_type || 'Unknown'}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-pulse-500 hover:bg-pulse-600">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
