
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMaintenanceRequests, useUpdateMaintenanceRequest } from '@/hooks/useMaintenanceRequests';
import { Wrench, Calendar, DollarSign, User } from 'lucide-react';
import { toast } from 'sonner';

const MaintenanceRequestsList = () => {
  const { data: requests, isLoading } = useMaintenanceRequests();
  const updateRequest = useUpdateMaintenanceRequest();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'acknowledged':
        return 'bg-yellow-500';
      case 'submitted':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await updateRequest.mutateAsync({
        id: requestId,
        updates: { status: newStatus }
      });
      toast.success('Request status updated successfully');
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request status');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading maintenance requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Maintenance Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{request.title}</h4>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {request.properties?.title} - {request.properties?.location}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Category: {request.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(request.created_at).toLocaleDateString()}
                  </div>
                  {request.estimated_cost && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Est: ₦{(request.estimated_cost / 100).toLocaleString()}
                    </div>
                  )}
                  {request.actual_cost && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Actual: ₦{(request.actual_cost / 100).toLocaleString()}
                    </div>
                  )}
                </div>

                {request.contractor_name && (
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Contractor:</strong> {request.contractor_name}
                    {request.contractor_contact && ` (${request.contractor_contact})`}
                  </div>
                )}

                <div className="flex gap-2">
                  {request.status === 'submitted' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, 'acknowledged')}
                      disabled={updateRequest.isPending}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {request.status === 'acknowledged' && (
                    <Button 
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'in_progress')}
                      disabled={updateRequest.isPending}
                    >
                      Start Work
                    </Button>
                  )}
                  {request.status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, 'completed')}
                      disabled={updateRequest.isPending}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No maintenance requests found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceRequestsList;
