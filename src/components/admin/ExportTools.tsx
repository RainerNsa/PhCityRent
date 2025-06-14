
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Table, Mail } from 'lucide-react';

interface ExportToolsProps {
  selectedApplications?: string[];
}

const ExportTools = ({ selectedApplications = [] }: ExportToolsProps) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportApplications = async () => {
    setExporting(true);
    try {
      let query = supabase
        .from('agent_applications')
        .select(`
          *,
          referee_verifications (
            status,
            referee_full_name,
            referee_role
          )
        `);

      if (selectedApplications.length > 0) {
        query = query.in('id', selectedApplications);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (exportFormat === 'csv') {
        downloadCSV(data);
      } else if (exportFormat === 'json') {
        downloadJSON(data);
      }

      toast({
        title: "Export Successful",
        description: `Exported ${data.length} applications as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export applications",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const downloadCSV = (data: any[]) => {
    const headers = [
      'Agent ID', 'Full Name', 'Email', 'WhatsApp', 'Status', 
      'Operating Areas', 'Created At', 'Registered Business'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(app => [
        app.agent_id,
        `"${app.full_name}"`,
        app.email,
        app.whatsapp_number,
        app.status,
        `"${app.operating_areas?.join('; ') || ''}"`,
        app.created_at,
        app.is_registered_business
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-applications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReport = async () => {
    try {
      const { data: stats } = await supabase
        .from('agent_applications')
        .select('status, created_at, operating_areas');

      const report = {
        generatedAt: new Date().toISOString(),
        totalApplications: stats?.length || 0,
        statusBreakdown: stats?.reduce((acc: any, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {}),
        selectedCount: selectedApplications.length
      };

      downloadJSON([report]);
      
      toast({
        title: "Report Generated",
        description: "Analytics report has been downloaded",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Report Failed",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Tools
        </h3>
        {selectedApplications.length > 0 && (
          <span className="text-sm text-gray-600">
            {selectedApplications.length} selected
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={exportFormat} onValueChange={setExportFormat}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={exportApplications}
          disabled={exporting}
          className="flex-1 sm:flex-none"
        >
          <Table className="w-4 h-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export Data'}
        </Button>

        <Button 
          variant="outline"
          onClick={generateReport}
          className="flex-1 sm:flex-none"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </Card>
  );
};

export default ExportTools;
