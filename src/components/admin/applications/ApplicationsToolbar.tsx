
import React from 'react';
import EnhancedBulkActions from '../EnhancedBulkActions';
import ExportTools from '../ExportTools';

interface ApplicationsToolbarProps {
  selectedApplications: string[];
  onBulkActionComplete: () => void;
  onClearSelection: () => void;
}

const ApplicationsToolbar = ({
  selectedApplications,
  onBulkActionComplete,
  onClearSelection
}: ApplicationsToolbarProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <EnhancedBulkActions
          selectedApplications={selectedApplications}
          onBulkActionComplete={onBulkActionComplete}
          onClearSelection={onClearSelection}
        />
      </div>
      
      <div className="w-full">
        <ExportTools selectedApplications={selectedApplications} />
      </div>
    </div>
  );
};

export default ApplicationsToolbar;
