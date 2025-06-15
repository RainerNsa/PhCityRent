
import React from "react";
import AdvancedSearch from "@/components/search/AdvancedSearch";
import AuthPrompt from "@/components/auth/AuthPrompt";

interface PropertiesFiltersProps {
  onFiltersChange: (filters: any) => void;
  user: any;
}

const PropertiesFilters = ({ onFiltersChange, user }: PropertiesFiltersProps) => {
  return (
    <>
      {/* Authentication Prompt for Non-Users */}
      {!user && (
        <div className="mb-8">
          <AuthPrompt 
            variant="compact"
            title="Get the Full Experience"
            description="Sign up to save properties, get alerts, and contact agents directly"
          />
        </div>
      )}
      
      <div className="mb-8">
        <AdvancedSearch onFiltersChange={onFiltersChange} />
      </div>
    </>
  );
};

export default PropertiesFilters;
