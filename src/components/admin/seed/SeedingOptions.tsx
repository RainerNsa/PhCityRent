
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';
import { SeedingOption } from './SeedDataTypes';

interface SeedingOptionsProps {
  options: SeedingOption[];
  onSeedData: (dataType: string) => void;
  isSeeding: boolean;
  seedingStatus: Record<string, boolean>;
}

const SeedingOptions = ({ options, onSeedData, isSeeding, seedingStatus }: SeedingOptionsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {options.map((option) => (
        <Card key={option.key} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4">
              <option.icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{option.title}</CardTitle>
            <Badge variant="secondary" className="mx-auto">
              {option.count} items
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-6">
              {option.description}
            </p>
            <Button
              onClick={() => onSeedData(option.key)}
              disabled={isSeeding || seedingStatus[option.key]}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {seedingStatus[option.key] ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Seed {option.title}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SeedingOptions;
