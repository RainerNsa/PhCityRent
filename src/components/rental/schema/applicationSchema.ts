
import * as z from 'zod';

export const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  
  // Current Address
  currentAddress: z.string().min(10, 'Current address is required'),
  currentCity: z.string().min(2, 'City is required'),
  currentState: z.string().min(2, 'State is required'),
  currentZip: z.string().min(5, 'ZIP code is required'),
  timeAtCurrentAddress: z.string().min(1, 'Time at current address is required'),
  reasonForMoving: z.string().min(10, 'Reason for moving is required'),
  
  // Employment Information
  employmentStatus: z.string().min(1, 'Employment status is required'),
  employer: z.string().min(2, 'Employer name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  workAddress: z.string().min(10, 'Work address is required'),
  monthlyIncome: z.string().min(1, 'Monthly income is required'),
  employmentDuration: z.string().min(1, 'Employment duration is required'),
  supervisorName: z.string().min(2, 'Supervisor name is required'),
  supervisorPhone: z.string().min(10, 'Supervisor phone is required'),
  
  // Additional Income
  additionalIncome: z.string().optional(),
  additionalIncomeSource: z.string().optional(),
  
  // References
  reference1Name: z.string().min(2, 'Reference name is required'),
  reference1Phone: z.string().min(10, 'Reference phone is required'),
  reference1Relationship: z.string().min(2, 'Relationship is required'),
  reference2Name: z.string().min(2, 'Reference name is required'),
  reference2Phone: z.string().min(10, 'Reference phone is required'),
  reference2Relationship: z.string().min(2, 'Relationship is required'),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactRelationship: z.string().min(2, 'Emergency contact relationship is required'),
  
  // Additional Information
  pets: z.boolean().default(false),
  petDetails: z.string().optional(),
  smokingStatus: z.string().min(1, 'Smoking status is required'),
  vehicleInfo: z.string().optional(),
  backgroundCheck: z.boolean().default(false),
  creditCheck: z.boolean().default(false),
  termsAgreed: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
