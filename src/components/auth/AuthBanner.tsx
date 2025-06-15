
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Heart, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const AuthBanner = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Save favorite properties</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <span className="text-sm">Get instant property alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Contact verified agents directly</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Join PHCityRent for FREE:</span>
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white text-orange-600 hover:bg-orange-50 border-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;
