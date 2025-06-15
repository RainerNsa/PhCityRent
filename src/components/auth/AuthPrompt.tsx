
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Heart, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthPromptProps {
  title?: string;
  description?: string;
  features?: string[];
  variant?: 'default' | 'compact';
}

const AuthPrompt = ({ 
  title = "Join PHCityRent Today",
  description = "Create an account to unlock all features and start your property search journey",
  features = [
    "Save your favorite properties",
    "Get instant property alerts", 
    "Contact verified agents directly",
    "Access exclusive listings"
  ],
  variant = 'default'
}: AuthPromptProps) => {
  const navigate = useNavigate();

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-orange-500 hover:bg-orange-600">
            Sign Up Free
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-orange-500" />
        </div>
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const icons = [Heart, MessageCircle, Shield, User];
            const Icon = icons[index % icons.length];
            return (
              <div key={index} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/auth')} 
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            Create Free Account
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="outline" 
            className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Sign In
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          Join thousands of property seekers in Port Harcourt
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthPrompt;
