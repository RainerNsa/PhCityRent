
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PricingSectionProps {
  pricePerYear: number;
  pricePerMonth: number;
  onInputChange: (field: string, value: number) => void;
}

const PricingSection = ({
  pricePerYear,
  pricePerMonth,
  onInputChange,
}: PricingSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price_per_year">Annual Rent (₦) *</Label>
        <Input
          id="price_per_year"
          type="number"
          min="0"
          value={pricePerYear}
          onChange={(e) => onInputChange('price_per_year', parseInt(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="price_per_month">Monthly Rent (₦)</Label>
        <Input
          id="price_per_month"
          type="number"
          min="0"
          value={pricePerMonth}
          onChange={(e) => onInputChange('price_per_month', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PricingSection;
