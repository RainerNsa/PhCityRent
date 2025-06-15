
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Lock, Heart, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const PropertyAuthPrompt = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unlock Full Access to Properties
          </h3>
          <p className="text-gray-600 mb-4">
            Create a free account to save properties, set up alerts for new listings, and contact verified agents directly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-orange-500" />
              <span>Save favorite properties</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bell className="w-4 h-4 text-orange-500" />
              <span>Get instant property alerts</span>
            </div>
          </div>
          
          <Link to="/auth">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyAuthPrompt;
