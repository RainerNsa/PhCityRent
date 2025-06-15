
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

import { applicationSchema, ApplicationFormData } from './schema/applicationSchema';
import StepIndicator, { applicationSteps } from './StepIndicator';
import PersonalInfoStep from './steps/PersonalInfoStep';
import AddressHistoryStep from './steps/AddressHistoryStep';
import EmploymentInfoStep from './steps/EmploymentInfoStep';
import ReferencesStep from './steps/ReferencesStep';
import AdditionalInfoStep from './steps/AdditionalInfoStep';

interface RentalApplicationFormProps {
  propertyId?: string;
  onSubmitSuccess?: () => void;
}

const RentalApplicationForm: React.FC<RentalApplicationFormProps> = ({ 
  propertyId, 
  onSubmitSuccess 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.user_metadata?.full_name?.split(' ')[0] || '',
      lastName: user?.user_metadata?.full_name?.split(' ')[1] || '',
      pets: false,
      backgroundCheck: false,
      creditCheck: false,
      termsAgreed: false
    }
  });

  const progress = ((currentStep + 1) / applicationSteps.length) * 100;

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit an application.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        user_id: user.id,
        property_id: propertyId,
        status: 'submitted',
        application_data: data,
        submitted_at: new Date().toISOString()
      };

      const { error } = await (supabase as any)
        .from('rental_applications')
        .insert(applicationData);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your rental application has been submitted successfully.",
      });

      form.reset();
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < applicationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep control={form.control} />;
      case 1:
        return <AddressHistoryStep control={form.control} />;
      case 2:
        return <EmploymentInfoStep control={form.control} />;
      case 3:
        return <ReferencesStep control={form.control} />;
      case 4:
        return <AdditionalInfoStep control={form.control} watch={form.watch} />;
      default:
        return <PersonalInfoStep control={form.control} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Rental Application</CardTitle>
          <CardDescription>
            Complete all sections to submit your rental application
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep + 1} of {applicationSteps.length}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <StepIndicator currentStep={currentStep} steps={applicationSteps} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderCurrentStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                {currentStep === applicationSteps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.watch('termsAgreed')}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalApplicationForm;
