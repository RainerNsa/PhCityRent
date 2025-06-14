
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StatusSearchFormProps {
  searchId: string;
  onSearchIdChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const StatusSearchForm = ({ searchId, onSearchIdChange, onSearch, isLoading }: StatusSearchFormProps) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Check Your Application Status</h2>
      <div className="flex gap-3">
        <Input
          placeholder="Enter your Agent ID (e.g., AGT-PHC-EMEKA001)"
          value={searchId}
          onChange={(e) => onSearchIdChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={onSearch}
          disabled={isLoading || !searchId.trim()}
          className="bg-pulse-500 hover:bg-pulse-600"
        >
          {isLoading ? "Searching..." : "Check Status"}
        </Button>
      </div>
    </Card>
  );
};

export default StatusSearchForm;
