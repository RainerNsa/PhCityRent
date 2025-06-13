
import React, { useEffect, useState } from "react";
import { MapPin, Bed, Bath, DollarSign, Shield } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  verified: boolean;
  agent: string;
}

const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with Airtable API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListings([
        {
          id: '1',
          title: 'Modern 3-Bedroom Apartment',
          location: 'GRA Phase 1, Port Harcourt',
          price: '₦1,500,000/year',
          bedrooms: 3,
          bathrooms: 2,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
          verified: true,
          agent: 'John Doe Properties'
        },
        {
          id: '2',
          title: 'Executive 2-Bedroom Flat',
          location: 'Old GRA, Port Harcourt',
          price: '₦1,200,000/year',
          bedrooms: 2,
          bathrooms: 2,
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
          verified: true,
          agent: 'Rivers State Homes'
        },
        {
          id: '3',
          title: 'Luxury 4-Bedroom Duplex',
          location: 'Ada George, Port Harcourt',
          price: '₦2,800,000/year',
          bedrooms: 4,
          bathrooms: 3,
          image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
          verified: true,
          agent: 'Premium Properties PH'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="py-16 bg-white" id="listings">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 border border-green-200 mb-4">
            <Shield className="w-4 h-4 mr-2" />
            <span>Verified Listings</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover verified rental properties from trusted agents across Port Harcourt
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  {listing.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{listing.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{listing.bathrooms} baths</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 font-semibold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{listing.price}</span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Listed by: {listing.agent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
