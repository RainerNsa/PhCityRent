
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'prospect';
  propertyInterests: string[];
  lastContact: string;
  totalInquiries: number;
  potentialValue: number;
  location: string;
}

const AgentClientManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock client data - in real app this would come from API
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+234 123 456 7890',
      status: 'active',
      propertyInterests: ['3-bedroom apartment', 'Old GRA area'],
      lastContact: '2024-01-15',
      totalInquiries: 3,
      potentialValue: 5000000,
      location: 'Port Harcourt'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+234 098 765 4321',
      status: 'prospect',
      propertyInterests: ['2-bedroom flat', 'New GRA'],
      lastContact: '2024-01-10',
      totalInquiries: 1,
      potentialValue: 3000000,
      location: 'Port Harcourt'
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael.j@email.com',
      phone: '+234 555 123 4567',
      status: 'inactive',
      propertyInterests: ['4-bedroom house', 'Woji'],
      lastContact: '2023-12-20',
      totalInquiries: 5,
      potentialValue: 8000000,
      location: 'Port Harcourt'
    }
  ];

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockClients.length,
    active: mockClients.filter(c => c.status === 'active').length,
    prospects: mockClients.filter(c => c.status === 'prospect').length,
    inactive: mockClients.filter(c => c.status === 'inactive').length,
    totalValue: mockClients.reduce((sum, c) => sum + c.potentialValue, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'prospect':
        return 'bg-blue-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Client Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.prospects}</div>
              <div className="text-sm text-gray-600">Prospects</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₦{(stats.totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'prospect', 'inactive'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Client List */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {client.totalInquiries} inquiries
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">
                      ₦{(client.potentialValue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-500">Potential Value</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{client.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Last contact: {new Date(client.lastContact).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Property Interests:</div>
                  <div className="flex flex-wrap gap-1">
                    {client.propertyInterests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No Matching Clients' : 'No Clients Yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start building your client base by adding your first client'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentClientManager;
