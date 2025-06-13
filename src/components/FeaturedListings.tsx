
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
    <section className="section-container bg-white animate-on-scroll" id="listings">
      <div className="text-center mb-12">
        <div className="pulse-chip mb-4">
          <Shield className="w-4 h-4 mr-2" />
          <span>Verified Listings</span>
        </div>
        <h2 className="section-title text-gray-900 mb-4">
          Featured Properties
        </h2>
        <p className="section-subtitle">
          Discover verified rental properties from trusted agents across Port Harcourt
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing, index) => (
            <div key={listing.id} className={`glass-card feature-card hover-lift fadeIn stagger-${(index % 3) + 1}`}>
              <div className="relative">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {listing.verified && (
                  <div className="absolute top-4 right-4 bg-pulse-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">{listing.title}</h3>
                
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
                  <div className="flex items-center text-pulse-500 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{listing.price}</span>
                  </div>
                  <button className="button-primary text-sm py-2 px-4">
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
        <button className="button-primary">
          View All Properties
        </button>
      </div>
    </section>
  );
};

export default FeaturedListings;
