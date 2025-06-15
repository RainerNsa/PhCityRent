
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { Control, UseFormWatch } from 'react-hook-form';

interface AdditionalInfoStepProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ control, watch }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Check className="w-5 h-5" />
        Additional Information
      </h3>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="pets"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Do you have pets?</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {watch('pets') && (
          <FormField
            control={control}
            name="petDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please describe your pets (type, breed, age, etc.)"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={control}
          name="smokingStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Smoking Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="non-smoker">Non-Smoker</SelectItem>
                  <SelectItem value="smoker">Smoker</SelectItem>
                  <SelectItem value="occasional">Occasional Smoker</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="vehicleInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Information</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Make, model, year, license plate (optional)"
                  {...field} 
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-3">
          <FormField
            control={control}
            name="backgroundCheck"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I consent to a background check</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="creditCheck"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I consent to a credit check</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="termsAgreed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I agree to the terms and conditions</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
