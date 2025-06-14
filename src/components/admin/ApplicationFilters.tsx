
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ApplicationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const ApplicationFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange 
}: ApplicationFiltersProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          <Input
            placeholder="Search by name, Agent ID, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="documents_reviewed">Documents Reviewed</SelectItem>
            <SelectItem value="referee_contacted">Referee Contacted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="needs_info">Needs Info</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default ApplicationFilters;
