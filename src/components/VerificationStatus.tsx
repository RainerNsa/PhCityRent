
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { Search, Clock, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';

const VerificationStatus = () => {
  const [agentId, setAgentId] = useState('');
  const { checkStatus, loading, application } = useVerificationStatus();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agentId.trim()) {
      await checkStatus(agentId.trim());
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending_review': { variant: 'secondary', icon: Clock, label: 'Pending Review' },
      'documents_reviewed': { variant: 'default', icon: AlertCircle, label: 'Documents Reviewed' },
      'referee_contacted': { variant: 'default', icon: User, label: 'Referee Contacted' },
      'approved': { variant: 'default', icon: CheckCircle, label: 'Approved' },
      'rejected': { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      'needs_info': { variant: 'destructive', icon: AlertCircle, label: 'Needs Information' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending_review'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Verification Status
          </h1>
          <p className="text-gray-600">
            Enter your Agent ID to check the status of your verification application
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="agentId">Agent ID</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="agentId"
                  type="text"
                  placeholder="e.g., AGT-PHC-JOHN001"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {application && (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{application.full_name}</h2>
                  <p className="text-gray-600">{application.agent_id}</p>
                </div>
                {getStatusBadge(application.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Application Date</Label>
                  <p>{formatDate(application.created_at)}</p>
                </div>
                <div>
                  <Label className="font-medium">Last Updated</Label>
                  <p>{formatDate(application.updated_at)}</p>
                </div>
              </div>

              {application.reviewer_notes && (
                <div>
                  <Label className="font-medium">Review Notes</Label>
                  <p className="mt-1 text-gray-700">{application.reviewer_notes}</p>
                </div>
              )}

              {application.next_action && (
                <div>
                  <Label className="font-medium">Next Action Required</Label>
                  <p className="mt-1 text-gray-700">{application.next_action}</p>
                </div>
              )}

              {application.referee_verifications && application.referee_verifications.length > 0 && (
                <div>
                  <Label className="font-medium">Referee Status</Label>
                  <div className="mt-2 space-y-2">
                    {application.referee_verifications.map((ref, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{ref.referee_full_name}</p>
                          <p className="text-sm text-gray-600">{ref.referee_role}</p>
                        </div>
                        <Badge variant={ref.status === 'confirmed' ? 'default' : 'secondary'}>
                          {ref.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Need help?</strong> Contact our support team on WhatsApp at +234 XXX XXX XXXX 
                  if you have any questions about your verification status.
                </p>
              </div>
            </div>
          </Card>
        )}

        {application === null && agentId && !loading && (
          <Card className="p-6 text-center">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Not Found</h3>
            <p className="text-gray-600">
              No application found with Agent ID: <strong>{agentId}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please check your Agent ID and try again, or contact support if you need assistance.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;
