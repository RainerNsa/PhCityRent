
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { Building, Users, DollarSign, Wrench } from 'lucide-react';
import RentalAgreementGenerator from './RentalAgreementGenerator';
import MaintenanceRequestsList from './MaintenanceRequestsList';

const LandlordDashboard = () => {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();

  const myProperties = properties?.filter(p => p.landlord_id === user?.id) || [];
  const totalProperties = myProperties.length;
  const occupiedProperties = myProperties.filter(p => !p.is_available).length;
  const totalRevenue = myProperties.reduce((sum, p) => sum + (p.price_per_year || 0), 0);

  if (isLoading) {
    return <div className="animate-pulse p-6">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Landlord Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalProperties}</p>
                <p className="text-sm text-gray-600">Total Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{occupiedProperties}</p>
                <p className="text-sm text-gray-600">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-600">Annual Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="agreements">Rental Agreements</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {myProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProperties.map((property) => (
                    <Card key={property.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <p className="font-bold text-orange-600">
                          ₦{property.price_per_year.toLocaleString()}/year
                        </p>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            property.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {property.is_available ? 'Available' : 'Occupied'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No properties found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements">
          <RentalAgreementGenerator />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceRequestsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandlordDashboard;
