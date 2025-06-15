
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactInfoSectionProps {
  contactEmail: string;
  contactWhatsapp: string;
  onInputChange: (field: string, value: string) => void;
}

const ContactInfoSection = ({
  contactEmail,
  contactWhatsapp,
  onInputChange,
}: ContactInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          type="email"
          value={contactEmail}
          onChange={(e) => onInputChange('contact_email', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
        <Input
          id="contact_whatsapp"
          value={contactWhatsapp}
          onChange={(e) => onInputChange('contact_whatsapp', e.target.value)}
          placeholder="+234 xxx xxx xxxx"
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
