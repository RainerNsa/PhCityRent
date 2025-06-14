
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const AdvancedFilters = ({ onFiltersChange, onClearFilters }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState({
    agentId: '',
    status: '',
    operatingArea: '',
    dateRange: undefined as DateRange | undefined,
    businessType: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update active filters
    const active = Object.entries(newFilters)
      .filter(([k, v]) => {
        if (k === 'dateRange') return v && v.from && v.to;
        return v && v !== '';
      })
      .map(([k]) => k);
    
    setActiveFilters(active);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      agentId: '',
      status: '',
      operatingArea: '',
      dateRange: undefined,
      businessType: ''
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onClearFilters();
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    if (filterKey === 'dateRange') {
      newFilters.dateRange = undefined;
    } else {
      (newFilters as any)[filterKey] = '';
    }
    setFilters(newFilters);
    
    const active = activeFilters.filter(f => f !== filterKey);
    setActiveFilters(active);
    onFiltersChange(newFilters);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Advanced Filters</h3>
        <Button variant="outline" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Agent ID</label>
          <Input
            placeholder="Search by Agent ID..."
            value={filters.agentId}
            onChange={(e) => handleFilterChange('agentId', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="documents_reviewed">Documents Reviewed</SelectItem>
              <SelectItem value="referee_contacted">Referee Contacted</SelectItem>
              <SelectItem value="needs_info">Needs Info</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Operating Area</label>
          <Input
            placeholder="Search by area..."
            value={filters.operatingArea}
            onChange={(e) => handleFilterChange('operatingArea', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={(range) => handleFilterChange('dateRange', range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Business Type</label>
          <Select value={filters.businessType} onValueChange={(value) => handleFilterChange('businessType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="registered">Registered Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter === 'dateRange' ? 'Date Range' : filter.replace(/([A-Z])/g, ' $1').trim()}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AdvancedFilters;
