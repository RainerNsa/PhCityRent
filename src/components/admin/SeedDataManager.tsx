import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, Upload, Users, Building2, FileText, CheckCircle } from 'lucide-react';

const SeedDataManager = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const sampleProperties = [
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

  const sampleAgentProfiles = [
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

  const seedData = async (dataType: string) => {
    setIsSeeding(true);
    setSeedingStatus(prev => ({ ...prev, [dataType]: true }));

    try {
      if (dataType === 'properties') {
        const { error } = await supabase
          .from('properties')
          .insert(sampleProperties);
        
        if (error) throw error;
        
        toast({
          title: "Properties seeded successfully!",
          description: `Added ${sampleProperties.length} sample properties.`,
        });
      }

      if (dataType === 'agents') {
        const { error } = await supabase
          .from('agent_profiles')
          .insert(sampleAgentProfiles);
        
        if (error) throw error;
        
        toast({
          title: "Agent profiles seeded successfully!",
          description: `Added ${sampleAgentProfiles.length} agent profiles.`,
        });
      }

      if (dataType === 'all') {
        // Seed agents first
        const { error: agentError } = await supabase
          .from('agent_profiles')
          .insert(sampleAgentProfiles);
        
        if (agentError) throw agentError;

        // Then seed properties
        const { error: propertyError } = await supabase
          .from('properties')
          .insert(sampleProperties);
        
        if (propertyError) throw propertyError;
        
        toast({
          title: "All data seeded successfully!",
          description: "Added sample properties, agents, and profiles.",
        });
      }

    } catch (error: any) {
      toast({
        title: "Error seeding data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
      setSeedingStatus(prev => ({ ...prev, [dataType]: false }));
    }
  };

  const seedingOptions = [
    {
      key: 'properties',
      title: 'Sample Properties',
      description: 'Add 5 sample properties with images and details',
      icon: Building2,
      count: sampleProperties.length
    },
    {
      key: 'agents',
      title: 'Agent Profiles',
      description: 'Add 3 verified agent profiles',
      icon: Users,
      count: sampleAgentProfiles.length
    },
    {
      key: 'all',
      title: 'Complete Dataset',
      description: 'Seed all sample data at once',
      icon: Database,
      count: sampleProperties.length + sampleAgentProfiles.length
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          PhCityRent Data Seeding
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Populate your PhCityRent platform with high-quality sample data including properties, 
          agent profiles, and content to showcase the platform's capabilities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {seedingOptions.map((option) => (
          <Card key={option.key} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4">
                <option.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">{option.title}</CardTitle>
              <Badge variant="secondary" className="mx-auto">
                {option.count} items
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                {option.description}
              </p>
              <Button
                onClick={() => seedData(option.key)}
                disabled={isSeeding || seedingStatus[option.key]}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {seedingStatus[option.key] ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Seed {option.title}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Phase 1: Content Population Complete</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>✅ Properties:</strong> Premium listings with detailed descriptions, amenities, and high-quality images
            </div>
            <div>
              <strong>✅ Agents:</strong> Verified agent profiles with contact information and operating areas
            </div>
            <div>
              <strong>✅ Branding:</strong> Complete PhCityRent branding with modern UI and gradient design
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeedDataManager;
