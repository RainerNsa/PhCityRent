
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommissions } from '@/hooks/useCommissions';
import { useAuth } from '@/hooks/useAuth';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';

const AgentCommissionTracker = () => {
  const { user } = useAuth();
  const { data: commissions, isLoading } = useCommissions();

  const formatCurrency = (amount: number) => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalEarned = commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission_amount, 0) || 0;
  const totalPending = commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission_amount, 0) || 0;

  if (isLoading) {
    return <div className="animate-pulse">Loading commissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
                <p className="text-sm text-gray-600">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{commissions?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          {commissions && commissions.length > 0 ? (
            <div className="space-y-4">
              {commissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {commission.properties?.title || 'Property'}
                      </h4>
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {commission.properties?.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      {commission.commission_type} • {commission.commission_rate}% rate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(commission.commission_amount)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(commission.earned_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No commissions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCommissionTracker;
