
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommissions } from '@/hooks/useCommissions';
import { useAuth } from '@/hooks/useAuth';
import { DollarSign, Calendar, TrendingUp, Filter, Download } from 'lucide-react';

const AgentCommissionTracker = () => {
  const { user } = useAuth();
  const { data: commissions, isLoading } = useCommissions();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

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

  // Filter commissions based on status and date range
  const filteredCommissions = commissions?.filter(commission => {
    if (filter !== 'all' && commission.status !== filter) return false;
    
    if (dateRange !== 'all') {
      const commissionDate = new Date(commission.earned_date);
      const now = new Date();
      
      switch (dateRange) {
        case 'thisMonth':
          return commissionDate.getMonth() === now.getMonth() && 
                 commissionDate.getFullYear() === now.getFullYear();
        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return commissionDate.getMonth() === lastMonth.getMonth() && 
                 commissionDate.getFullYear() === lastMonth.getFullYear();
        case 'thisYear':
          return commissionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    }
    
    return true;
  }) || [];

  const totalEarned = filteredCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission_amount, 0);
  const totalPending = filteredCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission_amount, 0);
  const totalCancelled = filteredCommissions.filter(c => c.status === 'cancelled').reduce((sum, c) => sum + c.commission_amount, 0);

  const averageCommission = filteredCommissions.length > 0 
    ? filteredCommissions.reduce((sum, c) => sum + c.commission_amount, 0) / filteredCommissions.length 
    : 0;

  if (isLoading) {
    return <div className="animate-pulse">Loading commissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Commission Tracking</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold">{formatCurrency(averageCommission)}</p>
                <p className="text-sm text-gray-600">Average Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{filteredCommissions.length}</p>
                <p className="text-sm text-gray-600">Total Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <span className="text-sm font-medium">Status:</span>
          {['all', 'paid', 'pending', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-sm font-medium">Period:</span>
          {[
            { key: 'all', label: 'All Time' },
            { key: 'thisMonth', label: 'This Month' },
            { key: 'lastMonth', label: 'Last Month' },
            { key: 'thisYear', label: 'This Year' }
          ].map((period) => (
            <Button
              key={period.key}
              variant={dateRange === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(period.key)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCommissions && filteredCommissions.length > 0 ? (
            <div className="space-y-4">
              {filteredCommissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {commission.properties?.title || 'Property Commission'}
                      </h4>
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {commission.properties?.location || 'Location not specified'}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span>{commission.commission_type}</span>
                      <span>{commission.commission_rate}% rate</span>
                      <span>Transaction: {formatCurrency(commission.transaction_amount)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(commission.commission_amount)}</p>
                    <p className="text-sm text-gray-500">
                      Earned: {new Date(commission.earned_date).toLocaleDateString()}
                    </p>
                    {commission.paid_date && (
                      <p className="text-sm text-green-600">
                        Paid: {new Date(commission.paid_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Commissions Found</h3>
              <p className="text-gray-600">
                {filter !== 'all' || dateRange !== 'all' 
                  ? 'No commissions match your current filters' 
                  : 'Start earning commissions by closing deals'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCommissionTracker;
