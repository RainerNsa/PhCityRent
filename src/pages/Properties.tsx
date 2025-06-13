
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, MapPin, Bed, Bath, Square } from "lucide-react";

const Properties = () => {
  const properties = [
    {
      id: 1,
      title: "Modern 3BR Apartment in GRA",
      location: "Government Residential Area",
      price: "₦800,000/year",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,200 sq ft",
      image: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
      verified: true,
    },
    {
      id: 2,
      title: "Luxury 2BR Flat in Trans Amadi",
      location: "Trans Amadi Industrial Layout",
      price: "₦600,000/year",
      bedrooms: 2,
      bathrooms: 2,
      area: "900 sq ft",
      image: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
      verified: true,
    },
    {
      id: 3,
      title: "Spacious 4BR House in Eliozu",
      location: "Eliozu",
      price: "₦1,200,000/year",
      bedrooms: 4,
      bathrooms: 3,
      area: "1,800 sq ft",
      image: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
            <p className="text-xl opacity-90">Browse verified properties in Port Harcourt</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {property.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.area}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-orange-600">
                      {property.price}
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
