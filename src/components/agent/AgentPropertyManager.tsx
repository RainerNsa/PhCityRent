
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { Building, Eye, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgentPropertyManager = () => {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();
  const navigate = useNavigate();

  // Get user's agent profile to find their agent_id
  const agentProperties = properties?.filter(p => p.agent_id) || [];

  if (isLoading) {
    return <div className="animate-pulse">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Property Management</h2>
        <Button onClick={() => navigate('/property-management')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Property
        </Button>
      </div>

      {agentProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentProperties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Building className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-2">{property.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                <p className="font-bold text-orange-600 mb-3">
                  ₦{property.price_per_year.toLocaleString()}/year
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={property.is_available ? "default" : "secondary"}>
                    {property.is_available ? 'Available' : 'Occupied'}
                  </Badge>
                  {property.is_verified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                  {property.featured && (
                    <Badge className="bg-orange-500">Featured</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-4">Start managing properties by adding your first listing</p>
            <Button onClick={() => navigate('/property-management')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentPropertyManager;
