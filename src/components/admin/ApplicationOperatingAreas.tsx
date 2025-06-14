
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ApplicationOperatingAreasProps {
  operatingAreas: string[];
}

const ApplicationOperatingAreas = ({ operatingAreas }: ApplicationOperatingAreasProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Operating Areas
      </h3>
      <div className="flex flex-wrap gap-2">
        {operatingAreas?.map((area, index) => (
          <Badge key={index} variant="outline">{area}</Badge>
        ))}
      </div>
    </Card>
  );
};

export default ApplicationOperatingAreas;
