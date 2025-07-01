
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const SeedingStatusCard = () => {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Phase 1: Content Population Complete</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <strong>✅ Properties:</strong> Premium listings with detailed descriptions, amenities, and high-quality images
          </div>
          <div>
            <strong>✅ Agents:</strong> Verified agent profiles with contact information and operating areas
          </div>
          <div>
            <strong>✅ Branding:</strong> Complete PhCityRent branding with modern UI and gradient design
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedingStatusCard;
