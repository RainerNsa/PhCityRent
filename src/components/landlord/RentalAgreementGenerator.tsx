
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';
import { useCreateRentalAgreement, useRentalAgreements } from '@/hooks/useRentalAgreements';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const RentalAgreementGenerator = () => {
  const { user } = useAuth();
  const { data: properties } = useProperties();
  const { data: agreements } = useRentalAgreements();
  const createAgreement = useCreateRentalAgreement();

  const [formData, setFormData] = useState({
    property_id: '',
    agreement_type: 'standard',
    rent_amount: '',
    security_deposit: '',
    lease_duration_months: '12',
    lease_start_date: '',
    lease_end_date: ''
  });

  const myProperties = properties?.filter(p => p.landlord_id === user?.id) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to create agreements');
      return;
    }

    const startDate = new Date(formData.lease_start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(formData.lease_duration_months));

    try {
      await createAgreement.mutateAsync({
        property_id: formData.property_id,
        landlord_id: user.id,
        agreement_type: formData.agreement_type,
        rent_amount: parseInt(formData.rent_amount) * 100, // Convert to cents
        security_deposit: parseInt(formData.security_deposit) * 100,
        lease_duration_months: parseInt(formData.lease_duration_months),
        lease_start_date: startDate.toISOString().split('T')[0],
        lease_end_date: endDate.toISOString().split('T')[0]
      });

      toast.success('Rental agreement created successfully!');
      setFormData({
        property_id: '',
        agreement_type: 'standard',
        rent_amount: '',
        security_deposit: '',
        lease_duration_months: '12',
        lease_start_date: '',
        lease_end_date: ''
      });
    } catch (error) {
      console.error('Error creating agreement:', error);
      toast.error('Failed to create rental agreement');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-500';
      case 'pending_signature':
        return 'bg-yellow-500';
      case 'draft':
        return 'bg-gray-500';
      case 'active':
        return 'bg-blue-500';
      case 'terminated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Rental Agreement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {myProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {property.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agreement_type">Agreement Type</Label>
                <Select value={formData.agreement_type} onValueChange={(value) => setFormData({...formData, agreement_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="furnished">Furnished</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent_amount">Monthly Rent (₦)</Label>
                <Input
                  id="rent_amount"
                  type="number"
                  value={formData.rent_amount}
                  onChange={(e) => setFormData({...formData, rent_amount: e.target.value})}
                  placeholder="e.g., 500000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="security_deposit">Security Deposit (₦)</Label>
                <Input
                  id="security_deposit"
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({...formData, security_deposit: e.target.value})}
                  placeholder="e.g., 1000000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lease_duration">Lease Duration (Months)</Label>
                <Select value={formData.lease_duration_months} onValueChange={(value) => setFormData({...formData, lease_duration_months: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lease_start_date">Lease Start Date</Label>
                <Input
                  id="lease_start_date"
                  type="date"
                  value={formData.lease_start_date}
                  onChange={(e) => setFormData({...formData, lease_start_date: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={createAgreement.isPending} className="w-full">
              {createAgreement.isPending ? 'Creating...' : 'Generate Agreement'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          {agreements && agreements.length > 0 ? (
            <div className="space-y-4">
              {agreements.map((agreement) => (
                <div key={agreement.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      {agreement.properties?.title || 'Property'}
                    </h4>
                    <Badge className={getStatusColor(agreement.status)}>
                      {agreement.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {agreement.properties?.location}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ₦{(agreement.rent_amount / 100).toLocaleString()}/month
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {agreement.lease_duration_months} months
                    </div>
                    <div>
                      Start: {new Date(agreement.lease_start_date).toLocaleDateString()}
                    </div>
                    <div>
                      End: {new Date(agreement.lease_end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No rental agreements found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalAgreementGenerator;
