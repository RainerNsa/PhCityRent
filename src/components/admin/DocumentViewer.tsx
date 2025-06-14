
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye, X, ZoomIn, ZoomOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type?: string;
}

interface DocumentViewerProps {
  document: VerificationDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (document && isOpen) {
      loadDocumentPreview();
    }
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [document, isOpen]);

  const loadDocumentPreview = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const bucketName = getBucketName(document.document_type);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      setDocumentUrl(url);
    } catch (error) {
      console.error('Error loading document preview:', error);
      toast({
        title: "Preview Failed",
        description: "Could not load document preview. You can still download it.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBucketName = (documentType: string): string => {
    switch (documentType) {
      case 'id_document':
        return 'agent-id-photos';
      case 'selfie_with_id':
        return 'agent-selfies';
      case 'cac_document':
        return 'agent-cac-docs';
      default:
        return 'agent-id-photos';
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    try {
      const bucketName = getBucketName(document.document_type);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
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

  const isImageFile = (mimeType?: string) => {
    return mimeType?.startsWith('image/') || false;
  };

  const isPdfFile = (mimeType?: string) => {
    return mimeType === 'application/pdf';
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
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

          {/* Document Preview */}
          <div className="border rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-500"></div>
              </div>
            ) : documentUrl ? (
              <div className="flex flex-col items-center">
                {isImageFile(document.mime_type) ? (
                  <div className="relative">
                    <img
                      src={documentUrl}
                      alt={document.file_name}
                      style={{ transform: `scale(${zoom})` }}
                      className="max-w-full h-auto transition-transform"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setZ oom(Math.max(zoom - 0.2, 0.5))}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : isPdfFile(document.mime_type) ? (
                  <iframe
                    src={documentUrl}
                    className="w-full h-96 border-0"
                    title={document.file_name}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Preview not available for this file type</p>
                    <p className="text-sm">Please download to view the document</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Could not load document preview</p>
                <p className="text-sm">Please try downloading the document</p>
              </div>
            )}
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
