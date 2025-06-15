
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
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <EnhancedBulkActions
          selectedApplications={selectedApplications}
          onBulkActionComplete={onBulkActionComplete}
          onClearSelection={onClearSelection}
        />
      </div>
      
      <ExportTools selectedApplications={selectedApplications} />
    </div>
  );
};

export default ApplicationsToolbar;
