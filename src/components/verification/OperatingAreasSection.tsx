
import React from "react";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

const portHarcourtAreas = [
  "GRA (Government Residential Area)",
  "Trans Amadi",
  "D-Line",
  "Woji",
  "Ada-George",
  "Eliozu",
  "Eagle Island",
  "Old GRA",
  "New GRA",
  "Rumuola",
  "Rumukrushi",
  "Rumuigbo",
  "Choba",
  "Aluu",
  "Mgbuoba",
  "Port Harcourt Township",
  "Mile 1",
  "Mile 2",
  "Mile 3",
  "Diobu",
  "Rumuwoji",
  "Ozuoba"
];

interface OperatingAreasSectionProps {
  form: UseFormReturn<any>;
  selectedAreas: string[];
  onToggleArea: (area: string) => void;
}

const OperatingAreasSection = ({ form, selectedAreas, onToggleArea }: OperatingAreasSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Areas You Operate In
      </h3>
      <p className="text-sm text-gray-600">Select all areas in Port Harcourt where you work:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
        {portHarcourtAreas.map((area) => (
          <label key={area} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedAreas.includes(area)}
              onChange={() => onToggleArea(area)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{area}</span>
          </label>
        ))}
      </div>
      {form.formState.errors.operatingAreas && (
        <p className="text-sm text-red-600">{form.formState.errors.operatingAreas.message}</p>
      )}
    </div>
  );
};

export default OperatingAreasSection;
