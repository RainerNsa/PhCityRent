
import { SampleProperty, SampleAgentProfile } from './SeedDataTypes';

export const sampleProperties: SampleProperty[] = [
  {
    title: "Luxury 3-Bedroom Apartment in Old GRA",
    description: "Spacious and modern 3-bedroom apartment located in the prestigious Old Government Reserved Area. Features include air conditioning in all rooms, fitted kitchen, swimming pool, and 24/7 security.",
    location: "Old GRA, Port Harcourt",
    property_type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 1200,
    price_per_month: 450000,
    price_per_year: 5400000,
    amenities: ["Swimming Pool", "24/7 Security", "Air Conditioning", "Fitted Kitchen", "Parking Space", "Generator"],
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG001",
    contact_whatsapp: "+2348123456789",
    contact_email: "agent1@phcityrent.com"
  },
  {
    title: "Executive 4-Bedroom Duplex in New GRA",
    description: "Beautiful 4-bedroom duplex with modern finishing, large compound, and excellent location in New GRA. Perfect for families looking for comfort and style.",
    location: "New GRA, Port Harcourt",
    property_type: "house",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 2000,
    price_per_month: 650000,
    price_per_year: 7800000,
    amenities: ["Large Compound", "Modern Finishing", "Parking for 3 Cars", "Study Room", "Family Lounge", "Kitchen Island"],
    images: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG002",
    contact_whatsapp: "+2348123456790",
    contact_email: "agent2@phcityrent.com"
  },
  {
    title: "Modern 2-Bedroom Flat in D-Line",
    description: "Contemporary 2-bedroom apartment in the heart of D-Line. Close to shopping centers, restaurants, and business districts. Ideal for young professionals.",
    location: "D-Line, Port Harcourt",
    property_type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 900,
    price_per_month: 280000,
    price_per_year: 3360000,
    amenities: ["Close to Shopping Centers", "Modern Kitchen", "Balcony", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG001",
    contact_whatsapp: "+2348123456789",
    contact_email: "agent1@phcityrent.com"
  },
  {
    title: "Affordable 1-Bedroom Studio in Mile 3",
    description: "Cozy 1-bedroom studio apartment perfect for students or young professionals. Affordable rent with basic amenities included.",
    location: "Mile 3, Port Harcourt",
    property_type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 450,
    price_per_month: 120000,
    price_per_year: 1440000,
    amenities: ["Basic Furnishing", "Security", "Water Supply", "Easy Transport Access"],
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG003",
    contact_whatsapp: "+2348123456791",
    contact_email: "agent3@phcityrent.com"
  },
  {
    title: "Premium 5-Bedroom Mansion in Eliozu",
    description: "Luxury 5-bedroom mansion with swimming pool, gym, and beautiful gardens. Located in the upscale Eliozu area with top-notch security.",
    location: "Eliozu, Port Harcourt",
    property_type: "house",
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 3500,
    price_per_month: 1200000,
    price_per_year: 14400000,
    amenities: ["Swimming Pool", "Gym", "Beautiful Gardens", "24/7 Security", "Staff Quarters", "Double Garage"],
    images: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG002",
    contact_whatsapp: "+2348123456790",
    contact_email: "agent2@phcityrent.com"
  }
];

export const sampleAgentProfiles: SampleAgentProfile[] = [
  {
    agent_id: "AG001",
    full_name: "Chinedu Okafor",
    email: "chinedu@phcityrent.com",
    whatsapp_number: "+2348123456789",
    operating_areas: ["Old GRA", "New GRA", "D-Line", "Mile 1"],
    is_active: true
  },
  {
    agent_id: "AG002", 
    full_name: "Blessing Amadi",
    email: "blessing@phcityrent.com",
    whatsapp_number: "+2348123456790",
    operating_areas: ["New GRA", "Eliozu", "Woji", "Ada George"],
    is_active: true
  },
  {
    agent_id: "AG003",
    full_name: "Emeka Nwachukwu",
    email: "emeka@phcityrent.com", 
    whatsapp_number: "+2348123456791",
    operating_areas: ["Mile 3", "Mile 4", "Diobu", "Town"],
    is_active: true
  }
];
