
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Users } from 'lucide-react';

interface ApplicationsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  filters: {
    status: string;
    operatingArea: string;
    dateRange: any;
    searchTerm: string;
  };
  onFiltersChange: (newFilters: any) => void;
  onBulkAction: (action: string) => void;
}

const ApplicationsToolbar: React.FC<ApplicationsToolbarProps> = ({
  selectedCount,
  totalCount,
  onClearSelection,
  filters,
  onFiltersChange,
  onBulkAction,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search applications..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending_documents">Pending Documents</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.operatingArea} onValueChange={(value) => handleFilterChange('operatingArea', value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
              <SelectItem value="obio-akpor">Obio/Akpor</SelectItem>
              <SelectItem value="eleme">Eleme</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Selection and Bulk Actions Row */}
      {selectedCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              {selectedCount} of {totalCount} applications selected
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBulkAction('approve')}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              Approve Selected
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBulkAction('reject')}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Reject Selected
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBulkAction('export')}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsToolbar;
