
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface OperatingAreasSectionProps {
  form: UseFormReturn<any>;
  selectedAreas: string[];
  onToggleArea: (area: string) => void;
}

const OperatingAreasSection = ({ form, selectedAreas, onToggleArea }: OperatingAreasSectionProps) => {
  const portHarcourtAreas = [
    "D-Line", "Woji", "Ada-George", "GRA (Old)", "GRA (New)", "Trans Amadi",
    "Eliozu", "Rumuola", "Rumuokwurushi", "Rumueme", "Rumuibekwe", "Rumukrushi",
    "Rukpokwu", "Choba", "Aluu", "Igwuruta", "Ozuoba", "Agip", "Shell Location",
    "Rumudara", "Rumuokoro", "Mile 3", "Mile 4", "Garrison", "Rumola",
    "Elelenwo", "Akpajo", "Eleme", "Oyigbo", "Obio/Akpor"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-pulse-600" />
        <h3 className="text-lg font-semibold">Operating Areas in Port Harcourt</h3>
      </div>
      <p className="text-sm text-gray-600">
        Select all areas where you operate as an agent (minimum 1 required)
      </p>

      <FormField
        control={form.control}
        name="operatingAreas"
        render={() => (
          <FormItem>
            <FormLabel>Areas You Operate In *</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {portHarcourtAreas.map((area) => (
                <Badge
                  key={area}
                  variant={selectedAreas.includes(area) ? "default" : "outline"}
                  className={`cursor-pointer p-2 text-center transition-colors ${
                    selectedAreas.includes(area)
                      ? "bg-pulse-500 hover:bg-pulse-600 text-white"
                      : "hover:bg-pulse-50 hover:border-pulse-300"
                  }`}
                  onClick={() => onToggleArea(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedAreas.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected Areas ({selectedAreas.length}):</strong> {selectedAreas.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default OperatingAreasSection;
