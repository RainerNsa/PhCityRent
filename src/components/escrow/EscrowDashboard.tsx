
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEscrowTransactions, useUpdateEscrowMilestone } from '@/hooks/useEscrow';
import { Shield, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const EscrowDashboard = () => {
  const { data: transactions, isLoading } = useEscrowTransactions();
  const updateMilestone = useUpdateEscrowMilestone();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'funds_held': return 'bg-blue-100 text-blue-800';
      case 'released': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Escrow Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>{transactions?.length || 0} transactions</span>
        </div>
      </div>

      {!transactions?.length ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Escrow Transactions</h3>
            <p className="text-gray-600">Your secure transactions will appear here once created.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {transaction.properties?.title || 'Property Transaction'}
                  </CardTitle>
                  <Badge className={getTransactionStatusColor(transaction.status)}>
                    {transaction.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{transaction.tenant_name}</span>
                  <span>•</span>
                  <span>{transaction.transaction_type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>${(transaction.amount / 100).toFixed(2)}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Transaction Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">${(transaction.amount / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Escrow Fee:</span>
                        <span className="font-medium">${((transaction.escrow_fee || 0) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenant:</span>
                        <span className="font-medium">{transaction.tenant_email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Progress Milestones</h4>
                    <div className="space-y-3">
                      {transaction.escrow_milestones?.map((milestone: any) => (
                        <div key={milestone.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : milestone.status === 'failed' ? (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-sm font-medium">
                              {milestone.milestone_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                          </div>
                          <Badge className={getStatusColor(milestone.status)} variant="outline">
                            {milestone.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {transaction.status === 'pending' && (
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      Waiting for payment confirmation. You'll receive updates as the transaction progresses.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EscrowDashboard;
