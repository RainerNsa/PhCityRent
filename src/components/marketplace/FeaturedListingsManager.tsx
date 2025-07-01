
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, TrendingUp, Crown, Zap } from 'lucide-react';

const FeaturedListingsManager = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const promotionTiers = [
    {
      id: 'premium',
      title: 'Premium Placement',
      description: 'Top of search results, highlighted border',
      price: 25000,
      icon: Crown,
      color: 'bg-yellow-500',
      features: ['Top search position', 'Golden highlight', 'Priority support']
    },
    {
      id: 'featured',
      title: 'Featured Listing',
      description: 'Homepage showcase, increased visibility',
      price: 15000,
      icon: Star,
      color: 'bg-blue-500',
      features: ['Homepage display', 'Featured badge', 'Extended description']
    },
    {
      id: 'boost',
      title: 'Visibility Boost',
      description: '3x more views, algorithm preference',
      price: 10000,
      icon: TrendingUp,
      color: 'bg-green-500',
      features: ['Algorithm boost', 'View multiplier', 'Analytics insights']
    }
  ];

  const handlePromoteProperty = async (tierId: string) => {
    setIsUpdating(true);
    try {
      // Simulate API call for promotion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Property Promoted!",
        description: `Your property has been promoted to ${tierId} tier.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Marketplace Enhancements</h2>
        <p className="text-gray-600">Boost your property visibility with premium placements</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {promotionTiers.map((tier) => (
          <Card key={tier.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className={`flex items-center justify-center w-16 h-16 ${tier.color} rounded-full mx-auto mb-4`}>
                <tier.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">{tier.title}</CardTitle>
              <Badge variant="outline" className="mx-auto">
                ₦{tier.price.toLocaleString()}/month
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                {tier.description}
              </p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Zap className="w-4 h-4 mr-2 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePromoteProperty(tier.id)}
                disabled={isUpdating}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isUpdating ? 'Processing...' : 'Promote Property'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedListingsManager;
