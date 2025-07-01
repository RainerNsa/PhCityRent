
export interface SampleProperty {
  title: string;
  description: string;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  price_per_month: number;
  price_per_year: number;
  amenities: string[];
  images: string[];
  featured: boolean;
  is_available: boolean;
  is_verified: boolean;
  agent_id: string;
  contact_whatsapp: string;
  contact_email: string;
}

export interface SampleAgentProfile {
  agent_id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  operating_areas: string[];
  is_active: boolean;
}

export interface SeedingOption {
  key: string;
  title: string;
  description: string;
  icon: any;
  count: number;
}
