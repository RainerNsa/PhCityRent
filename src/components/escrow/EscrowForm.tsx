
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaystack } from '@/hooks/usePaystack';
import { DollarSign, Shield, Clock } from 'lucide-react';

interface EscrowFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

const EscrowForm = ({ propertyId, propertyTitle }: EscrowFormProps) => {
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    amount: '',
    transactionType: 'rent_deposit',
  });

  const { initializePayment, isLoading } = usePaystack();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId) {
      alert('Please select a property first');
      return;
    }

    const amount = parseInt(formData.amount);
    const escrowFee = amount * 0.025;
    const totalAmount = amount + escrowFee;
    
    // Generate unique reference
    const reference = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      await initializePayment({
        email: formData.tenantEmail,
        amount: totalAmount,
        reference,
        metadata: {
          propertyId,
          tenantName: formData.tenantName,
          tenantPhone: formData.tenantPhone,
          transactionType: formData.transactionType,
          originalAmount: amount,
          escrowFee,
        },
        callback_url: `${window.location.origin}/escrow/success`,
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
    }
  };

  const escrowFee = formData.amount ? (parseInt(formData.amount) * 0.025).toFixed(2) : '0.00';
  const totalAmount = formData.amount ? (parseInt(formData.amount) + parseFloat(escrowFee)).toFixed(2) : '0.00';

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Start Secure Escrow Transaction</span>
        </CardTitle>
        {propertyTitle && (
          <p className="text-sm text-gray-600">Property: {propertyTitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Tenant Full Name</Label>
              <Input
                id="tenantName"
                value={formData.tenantName}
                onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantEmail">Tenant Email</Label>
              <Input
                id="tenantEmail"
                type="email"
                value={formData.tenantEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, tenantEmail: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantPhone">Tenant Phone (Optional)</Label>
            <Input
              id="tenantPhone"
              type="tel"
              value={formData.tenantPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, tenantPhone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, transactionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent_deposit">Rent Deposit</SelectItem>
                  <SelectItem value="security_deposit">Security Deposit</SelectItem>
                  <SelectItem value="first_month_rent">First Month Rent</SelectItem>
                  <SelectItem value="last_month_rent">Last Month Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
          </div>

          {formData.amount && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-blue-900">Payment Breakdown</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Transaction Amount:</span>
                  <span>₦{parseInt(formData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Fee (2.5%):</span>
                  <span>₦{parseFloat(escrowFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total to Pay:</span>
                  <span>₦{parseFloat(totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Secure Transaction</h4>
                <p className="text-sm text-gray-600">Your funds are held securely until all conditions are met</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">24-48 Hour Processing</h4>
                <p className="text-sm text-gray-600">Fast verification and release process</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Transparent Fees</h4>
                <p className="text-sm text-gray-600">Only 2.5% service fee, no hidden charges</p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Proceed to Secure Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EscrowForm;
