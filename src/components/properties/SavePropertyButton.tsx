
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsSavedProperty, useToggleSavedProperty } from '@/hooks/useSavedProperties';
import { useNavigate } from 'react-router-dom';

interface SavePropertyButtonProps {
  propertyId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

const SavePropertyButton = ({ 
  propertyId, 
  variant = 'ghost', 
  size = 'default', 
  showText = false 
}: SavePropertyButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: isSaved = false } = useIsSavedProperty(propertyId);
  const toggleSaved = useToggleSavedProperty();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    toggleSaved.mutate({ propertyId, isSaved });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={toggleSaved.isPending}
      className={`${isSaved ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
    >
      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''} ${showText ? 'mr-2' : ''}`} />
      {showText && (isSaved ? 'Saved' : 'Save')}
    </Button>
  );
};

export default SavePropertyButton;
