
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RentalApplicationForm from '@/components/rental/RentalApplicationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RentalApplication = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const handleSubmitSuccess = () => {
    navigate('/tenant-portal?tab=applications', { 
      state: { message: 'Application submitted successfully!' }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rental Application
            </h1>
            <p className="text-gray-600">
              Complete your rental application to secure your new home
            </p>
          </div>
        </div>

        <RentalApplicationForm 
          propertyId={propertyId}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </div>
  );
};

export default RentalApplication;
