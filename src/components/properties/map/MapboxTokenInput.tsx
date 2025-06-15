
import React from 'react';
import { MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
  height: string;
}

const MapboxTokenInput = ({ onTokenSubmit, height }: MapboxTokenInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('token') as string;
    if (token) {
      onTokenSubmit(token);
    }
  };

  return (
    <div 
      className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
      style={{ height }}
    >
      <div className="text-center p-6">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Map Integration Available</h3>
        <p className="text-gray-600 mb-4 max-w-md">
          To view properties on the map, please enter your Mapbox public token. 
          Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">mapbox.com</a>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
          <div>
            <Label htmlFor="token">Mapbox Public Token</Label>
            <Input
              id="token"
              name="token"
              type="text"
              placeholder="pk.eyJ1..."
              required
            />
          </div>
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
            <Settings className="w-4 h-4 mr-2" />
            Enable Map
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MapboxTokenInput;
