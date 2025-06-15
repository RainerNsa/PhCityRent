
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePropertyInquiry } from "@/hooks/useProperties";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Mail, Phone, User } from "lucide-react";

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

const PropertyInquiryForm = ({ propertyId, propertyTitle }: PropertyInquiryFormProps) => {
  const [formData, setFormData] = useState({
    inquirer_name: '',
    inquirer_email: '',
    inquirer_phone: '',
    message: '',
    inquiry_type: 'viewing_request'
  });

  const { toast } = useToast();
  const inquiryMutation = usePropertyInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await inquiryMutation.mutateAsync({
        property_id: propertyId,
        ...formData
      });
      
      toast({
        title: "Inquiry Sent Successfully!",
        description: "The property agent will contact you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        inquirer_name: '',
        inquirer_email: '',
        inquirer_phone: '',
        message: '',
        inquiry_type: 'viewing_request'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2 text-orange-500" />
        Inquire About This Property
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inquirer_name" className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <Input
            id="inquirer_name"
            name="inquirer_name"
            type="text"
            required
            value={formData.inquirer_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="inquirer_email" className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <Input
            id="inquirer_email"
            name="inquirer_email"
            type="email"
            required
            value={formData.inquirer_email}
            onChange={handleChange}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="inquirer_phone" className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <Input
            id="inquirer_phone"
            name="inquirer_phone"
            type="tel"
            value={formData.inquirer_phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="inquiry_type" className="block text-sm font-medium text-gray-700 mb-1">
            Inquiry Type
          </label>
          <select
            id="inquiry_type"
            name="inquiry_type"
            value={formData.inquiry_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="viewing_request">Schedule Viewing</option>
            <option value="rental_inquiry">Rental Information</option>
            <option value="general_inquiry">General Question</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={`I'm interested in viewing "${propertyTitle}". Please contact me to schedule a viewing.`}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          disabled={inquiryMutation.isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {inquiryMutation.isPending ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>
    </div>
  );
};

export default PropertyInquiryForm;
