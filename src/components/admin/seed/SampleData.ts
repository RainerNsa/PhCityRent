
import { SampleProperty, SampleAgentProfile } from './SeedDataTypes';

export const sampleProperties: SampleProperty[] = [
  // Showcase Properties from PropertyShowcase component
  {
    id: "prop-001",
    title: "Waterfront Luxury Penthouse",
    description: "Stunning waterfront penthouse with panoramic river views, private pool, and concierge services. Located in the prestigious Old GRA with premium amenities and luxury finishes throughout.",
    location: "Old GRA, Port Harcourt",
    property_type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2800,
    price_per_month: 708333,
    price_per_year: 8500000,
    amenities: ["River View", "Private Pool", "Concierge", "24/7 Security", "Gym Access", "Parking"],
    images: [
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~0221aa35039df89b_4-4169-1-4d073bf.jpg",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~62e1075f039df8d0_4-4169-1-b2d4729.jpg"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG001",
    contact_whatsapp: "+2348123456789",
    contact_email: "agent1@phcityrent.com"
  },
  {
    id: "prop-002",
    title: "Sky-High Executive Suite",
    description: "Modern executive suite with city views, gym access, and 24/7 security. Perfect for professionals seeking luxury living in the heart of New GRA.",
    location: "New GRA, Port Harcourt",
    property_type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2200,
    price_per_month: 516667,
    price_per_year: 6200000,
    amenities: ["City View", "Gym Access", "24/7 Security", "Modern Kitchen", "Balcony", "Parking"],
    images: [
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~62e1075f039df8d0_4-4169-1-b2d4729.jpg",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092341.jpg"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG002",
    contact_whatsapp: "+2348123456790",
    contact_email: "agent2@phcityrent.com"
  },
  {
    id: "prop-003",
    title: "Spacious Family Villa",
    description: "Beautiful family villa with garden, playground area, and close proximity to schools. Perfect for families looking for space and comfort in Woji.",
    location: "Woji, Port Harcourt",
    property_type: "house",
    bedrooms: 5,
    bathrooms: 4,
    area_sqft: 3500,
    price_per_month: 400000,
    price_per_year: 4800000,
    amenities: ["Garden", "Playground", "School Nearby", "Large Compound", "Family Lounge", "Study Room"],
    images: [
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "/Properties/houses.jpg"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG003",
    contact_whatsapp: "+2348123456791",
    contact_email: "agent3@phcityrent.com"
  },
  {
    id: "prop-004",
    title: "Cozy Suburban Home",
    description: "Comfortable suburban home in quiet Eliozu area with parking and close to shopping mall. Ideal for families seeking peaceful living.",
    location: "Eliozu, Port Harcourt",
    property_type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2800,
    price_per_month: 300000,
    price_per_year: 3600000,
    amenities: ["Quiet Area", "Parking", "Shopping Mall", "Security", "Modern Kitchen", "Family Room"],
    images: [
      "/Properties/houses.jpg",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG004",
    contact_whatsapp: "+2348123456792",
    contact_email: "agent4@phcityrent.com"
  },
  {
    id: "prop-005",
    title: "Minimalist Studio Loft",
    description: "Modern studio loft with high-speed WiFi and bus access. Perfect for young professionals in the heart of D-Line business district.",
    location: "D-Line, Port Harcourt",
    property_type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 800,
    price_per_month: 150000,
    price_per_year: 1800000,
    amenities: ["Modern Design", "High Speed WiFi", "Bus Access", "Security", "Kitchenette", "Balcony"],
    images: [
      "/Properties/657092341.jpg",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092948.jpg"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG005",
    contact_whatsapp: "+2348123456793",
    contact_email: "agent5@phcityrent.com"
  },
  {
    id: "prop-006",
    title: "Urban Creative Space",
    description: "Flexible creative space in Ada George, perfect for artists and tech professionals. Part of a vibrant creative community.",
    location: "Ada George, Port Harcourt",
    property_type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 950,
    price_per_month: 175000,
    price_per_year: 2100000,
    amenities: ["Creative Hub", "Flexible Space", "Tech Community", "High Speed Internet", "Meeting Rooms", "Parking"],
    images: [
      "/Properties/657092948.jpg",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092341.jpg"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG006",
    contact_whatsapp: "+2348123456794",
    contact_email: "agent6@phcityrent.com"
  },
  {
    id: "prop-007",
    title: "Luxury Duplex Mansion",
    description: "Exclusive luxury duplex mansion with waterfront view, home theater, and wine cellar. The pinnacle of luxury living in Old GRA Phase 2.",
    location: "Old GRA Phase 2, Port Harcourt",
    property_type: "duplex",
    bedrooms: 6,
    bathrooms: 5,
    area_sqft: 5000,
    price_per_month: 1250000,
    price_per_year: 15000000,
    amenities: ["Waterfront View", "Home Theater", "Wine Cellar", "Private Pool", "Gym", "Staff Quarters"],
    images: [
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~0221aa35039df89b_4-4169-1-4d073bf.jpg",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG007",
    contact_whatsapp: "+2348123456795",
    contact_email: "agent7@phcityrent.com"
  },
  {
    id: "prop-008",
    title: "Executive Duplex",
    description: "Elite executive duplex in gated community with recreation center and premium location. Perfect for executives and high-net-worth individuals.",
    location: "New GRA Estate, Port Harcourt",
    property_type: "duplex",
    bedrooms: 5,
    bathrooms: 4,
    area_sqft: 4200,
    price_per_month: 1041667,
    price_per_year: 12500000,
    amenities: ["Gated Community", "Recreation Center", "Premium Location", "Swimming Pool", "Tennis Court", "24/7 Security"],
    images: [
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~62e1075f039df8d0_4-4169-1-b2d4729.jpg"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG008",
    contact_whatsapp: "+2348123456796",
    contact_email: "agent8@phcityrent.com"
  },
  // Original sample properties with updated images
  {
    id: "prop-009",
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
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~0221aa35039df89b_4-4169-1-4d073bf.jpg",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~62e1075f039df8d0_4-4169-1-b2d4729.jpg",
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
    id: "prop-010",
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
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      "/Properties/houses.jpg",
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
    id: "prop-011",
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
      "/Properties/657092341.jpg",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092948.jpg"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG001",
    contact_whatsapp: "+2348123456789",
    contact_email: "agent1@phcityrent.com"
  },
  {
    id: "prop-012",
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
      "/Properties/657092948.jpg",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092341.jpg"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG003",
    contact_whatsapp: "+2348123456791",
    contact_email: "agent3@phcityrent.com"
  },
  {
    id: "prop-013",
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
      "/Properties/houses.jpg",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG002",
    contact_whatsapp: "+2348123456790",
    contact_email: "agent2@phcityrent.com"
  },
  // Additional properties with mixed image sources
  {
    id: "prop-014",
    title: "Contemporary 3-Bedroom Apartment in Trans Amadi",
    description: "Modern 3-bedroom apartment with sleek design and premium finishes. Located in the bustling Trans Amadi industrial area with easy access to business districts.",
    location: "Trans Amadi, Port Harcourt",
    property_type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1400,
    price_per_month: 380000,
    price_per_year: 4560000,
    amenities: ["Modern Kitchen", "Balcony", "Security", "Parking", "Generator", "Water Supply"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092341.jpg",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG001",
    contact_whatsapp: "+2348123456789",
    contact_email: "agent1@phcityrent.com"
  },
  {
    id: "prop-015",
    title: "Elegant 4-Bedroom Duplex in Rumuokwuta",
    description: "Spacious duplex with elegant design and family-friendly amenities. Perfect for executives and large families seeking comfort in Rumuokwuta.",
    location: "Rumuokwuta, Port Harcourt",
    property_type: "duplex",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 2600,
    price_per_month: 750000,
    price_per_year: 9000000,
    amenities: ["Family Lounge", "Study Room", "Compound", "Security", "Modern Kitchen", "Parking for 2 Cars"],
    images: [
      "/Properties/standard-4-bedroom-duplex-with-bq-OyxBI8lrm4Y58PQG4agi.jpg",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "/Properties/houses.jpg",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG003",
    contact_whatsapp: "+2348123456791",
    contact_email: "agent3@phcityrent.com"
  },
  {
    id: "prop-016",
    title: "Luxury Studio in Aba Road",
    description: "Premium studio apartment with modern amenities and excellent location on Aba Road. Perfect for young professionals and students.",
    location: "Aba Road, Port Harcourt",
    property_type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 600,
    price_per_month: 180000,
    price_per_year: 2160000,
    amenities: ["Modern Design", "High Speed Internet", "Security", "Kitchenette", "Air Conditioning"],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "/Properties/657092948.jpg",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    is_available: true,
    is_verified: true,
    agent_id: "AG004",
    contact_whatsapp: "+2348123456792",
    contact_email: "agent4@phcityrent.com"
  },
  {
    id: "prop-017",
    title: "Executive Mansion in Rumuibekwe",
    description: "Magnificent executive mansion with premium amenities and luxury finishes. Located in the prestigious Rumuibekwe area with top-tier security.",
    location: "Rumuibekwe, Port Harcourt",
    property_type: "house",
    bedrooms: 6,
    bathrooms: 7,
    area_sqft: 4500,
    price_per_month: 1500000,
    price_per_year: 18000000,
    amenities: ["Swimming Pool", "Home Theater", "Wine Cellar", "Gym", "Staff Quarters", "Triple Garage", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~0221aa35039df89b_4-4169-1-4d073bf.jpg",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      "/Properties/iroko-interior-design-sa-private-residence-port-harcourt-nigeria-iroko-interior-design-and-consulting-img~62e1075f039df8d0_4-4169-1-b2d4729.jpg"
    ],
    featured: true,
    is_available: true,
    is_verified: true,
    agent_id: "AG005",
    contact_whatsapp: "+2348123456793",
    contact_email: "agent5@phcityrent.com"
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
  },
  {
    agent_id: "AG004",
    full_name: "Grace Okoro",
    email: "grace@phcityrent.com",
    whatsapp_number: "+2348123456792",
    operating_areas: ["Aba Road", "Rumuokwuta", "Trans Amadi", "Mile 2"],
    is_active: true
  },
  {
    agent_id: "AG005",
    full_name: "David Eze",
    email: "david@phcityrent.com",
    whatsapp_number: "+2348123456793",
    operating_areas: ["Rumuibekwe", "GRA Phase 1", "GRA Phase 2", "Eliozu"],
    is_active: true
  },
  {
    agent_id: "AG006",
    full_name: "Patience Ikenna",
    email: "patience@phcityrent.com",
    whatsapp_number: "+2348123456794",
    operating_areas: ["Ada George", "D-Line", "Mile 1", "Woji"],
    is_active: true
  },
  {
    agent_id: "AG007",
    full_name: "Samuel Okonkwo",
    email: "samuel@phcityrent.com",
    whatsapp_number: "+2348123456795",
    operating_areas: ["Old GRA Phase 2", "New GRA Estate", "Eliozu", "Woji"],
    is_active: true
  },
  {
    agent_id: "AG008",
    full_name: "Mary Udoh",
    email: "mary@phcityrent.com",
    whatsapp_number: "+2348123456796",
    operating_areas: ["New GRA Estate", "Old GRA", "D-Line", "Mile 1"],
    is_active: true
  }
];
