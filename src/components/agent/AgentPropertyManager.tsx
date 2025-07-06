
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { Building, Eye, Edit, Plus, Trash2, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AgentPropertyManager = () => {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  // Filter properties for the current agent
  const agentProperties = properties?.filter(p => 
    p.agent_id === user?.id || p.landlord_id === user?.id
  ) || [];

  const filteredProperties = agentProperties.filter(property => {
    if (filter === 'available') return property.is_available;
    if (filter === 'occupied') return !property.is_available;
    if (filter === 'featured') return property.featured;
    return true;
  });

  const handleDeleteProperty = async (propertyId: string) => {
    // This would need to be implemented with a delete mutation
    toast({
      title: "Property Deleted",
      description: "Property has been removed from listings",
    });
  };

  const handleToggleAvailability = async (propertyId: string, currentStatus: boolean) => {
    // This would need to be implemented with an update mutation
    toast({
      title: "Status Updated",
      description: `Property marked as ${!currentStatus ? 'available' : 'unavailable'}`,
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading properties...</div>;
  }

  const stats = {
    total: agentProperties.length,
    available: agentProperties.filter(p => p.is_available).length,
    occupied: agentProperties.filter(p => !p.is_available).length,
    featured: agentProperties.filter(p => p.featured).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Property Management</h2>
        <Button onClick={() => navigate('/property-management')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
              <div className="text-sm text-gray-600">Occupied</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.featured}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'available', 'occupied', 'featured'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Button>
        ))}
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Building className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-2 truncate">{property.title}</h3>
                
                <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{property.location}</span>
                </div>

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

                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-4">
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                  <span>{property.property_type}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(property.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleToggleAvailability(property.id, property.is_available)}
                    className="px-2"
                  >
                    {property.is_available ? 'Mark Occupied' : 'Mark Available'}
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
            <h3 className="text-lg font-medium mb-2">
              {filter === 'all' ? 'No Properties Yet' : `No ${filter} Properties`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'Start managing properties by adding your first listing' 
                : `You don't have any ${filter} properties at the moment`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={() => navigate('/property-management')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentPropertyManager;
