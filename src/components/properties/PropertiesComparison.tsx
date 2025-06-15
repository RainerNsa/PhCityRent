
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, X } from "lucide-react";
import PropertyComparison from "./PropertyComparison";

interface PropertiesComparisonProps {
  comparisonCount: number;
  isComparing: boolean;
  comparisonList: any[];
  onStartComparison: () => void;
  onStopComparison: () => void;
  onClearComparison: () => void;
  onRemoveFromComparison: (propertyId: string) => void;
}

const PropertiesComparison = ({
  comparisonCount,
  isComparing,
  comparisonList,
  onStartComparison,
  onStopComparison,
  onClearComparison,
  onRemoveFromComparison
}: PropertiesComparisonProps) => {
  return (
    <>
      {/* Comparison Bar */}
      {comparisonCount > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="w-5 h-5 text-orange-600" />
              <span className="font-medium">
                {comparisonCount} {comparisonCount === 1 ? 'property' : 'properties'} selected for comparison
              </span>
              <Badge variant="secondary">{comparisonCount}/3</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={isComparing ? onStopComparison : onStartComparison}
                variant={isComparing ? "default" : "outline"}
              >
                {isComparing ? 'Hide Comparison' : 'Compare Now'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClearComparison}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {isComparing && (
        <div className="mb-8">
          <PropertyComparison
            properties={comparisonList}
            onRemoveProperty={onRemoveFromComparison}
            onClose={onStopComparison}
          />
        </div>
      )}
    </>
  );
};

export default PropertiesComparison;
