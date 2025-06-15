
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SavedPropertiesList from '@/components/properties/SavedPropertiesList';
import { Heart, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const TenantProperties = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Saved Properties
              </CardTitle>
              <CardDescription>Properties you've bookmarked for later viewing</CardDescription>
            </div>
            <Link to="/properties">
              <Button className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <SavedPropertiesList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Preferences</CardTitle>
          <CardDescription>Set your preferences to get better property recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Budget Range</h4>
              <p className="text-sm text-gray-600">₦200,000 - ₦500,000/year</p>
              <Button variant="outline" size="sm" className="mt-2">Update</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Preferred Areas</h4>
              <p className="text-sm text-gray-600">Port Harcourt, GRA</p>
              <Button variant="outline" size="sm" className="mt-2">Update</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Property Type</h4>
              <p className="text-sm text-gray-600">Apartment, House</p>
              <Button variant="outline" size="sm" className="mt-2">Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProperties;
