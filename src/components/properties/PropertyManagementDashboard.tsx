
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import PropertyCreationForm from './PropertyCreationForm';
import { Plus, Edit, Eye, Trash2, MapPin, Calendar } from 'lucide-react';

const PropertyManagementDashboard = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Get properties for the current user (landlord/agent)
  const { data: properties = [], isLoading } = useProperties({
    // Add filter for current user's properties when hook supports it
  });

  const handleCreateProperty = () => {
    setShowCreateForm(true);
  };

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property);
    setShowCreateForm(true);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {selectedProperty ? 'Edit Property' : 'Create New Property'}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowCreateForm(false);
            setSelectedProperty(null);
          }}>
            Back to Dashboard
          </Button>
        </div>
        <PropertyCreationForm onSuccess={() => {
          setShowCreateForm(false);
          setSelectedProperty(null);
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Management</h2>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Button onClick={handleCreateProperty} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => p.is_available).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => p.featured).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rent</p>
                <p className="text-2xl font-bold">
                  ₦{properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price_per_year, 0) / properties.length / 1000000 * 10) / 10 : 0}M
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any properties yet.</p>
              <Button onClick={handleCreateProperty}>Create Your First Property</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <Badge variant={property.is_available ? "default" : "secondary"}>
                          {property.is_available ? "Available" : "Unavailable"}
                        </Badge>
                        {property.featured && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                            Featured
                          </Badge>
                        )}
                        {property.is_verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {property.location}
                        </div>
                        <div>
                          {property.property_type} • {property.bedrooms} bed • {property.bathrooms} bath
                        </div>
                        <div className="font-medium text-gray-900">
                          ₦{property.price_per_year.toLocaleString()}/year
                        </div>
                        <div>
                          Created {new Date(property.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProperty(property)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyManagementDashboard;
