
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Eye, Star, Bed, Bath, Square } from 'lucide-react';

const PropertyShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('luxury');

  const categories = [
    { id: 'luxury', name: 'Luxury Apartments', color: 'from-purple-500 to-indigo-500' },
    { id: 'family', name: 'Family Homes', color: 'from-green-500 to-emerald-500' },
    { id: 'modern', name: 'Modern Studios', color: 'from-orange-500 to-red-500' },
    { id: 'premium', name: 'Premium Duplexes', color: 'from-blue-500 to-cyan-500' }
  ];

  const properties = {
    luxury: [
      {
        id: 1,
        title: "Oceanview Luxury Penthouse",
        location: "Victoria Island, Lagos",
        price: "₦8,500,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        beds: 4, baths: 3, sqft: 2800,
        rating: 4.9,
        badge: "Premium",
        features: ["Ocean View", "Private Pool", "Concierge"]
      },
      {
        id: 2,
        title: "Sky-High Executive Suite",
        location: "Ikoyi, Lagos",
        price: "₦6,200,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        beds: 3, baths: 2, sqft: 2200,
        rating: 4.8,
        badge: "Featured",
        features: ["City View", "Gym Access", "24/7 Security"]
      }
    ],
    family: [
      {
        id: 3,
        title: "Spacious Family Villa",
        location: "Lekki Phase 1, Lagos",
        price: "₦4,800,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
        beds: 5, baths: 4, sqft: 3500,
        rating: 4.7,
        badge: "Popular",
        features: ["Garden", "Playground", "School Nearby"]
      },
      {
        id: 4,
        title: "Cozy Suburban Home",
        location: "Magodo, Lagos",
        price: "₦3,600,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
        beds: 4, baths: 3, sqft: 2800,
        rating: 4.6,
        badge: "New",
        features: ["Quiet Area", "Parking", "Shopping Mall"]
      }
    ],
    modern: [
      {
        id: 5,
        title: "Minimalist Studio Loft",
        location: "Surulere, Lagos",
        price: "₦1,800,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        beds: 1, baths: 1, sqft: 800,
        rating: 4.5,
        badge: "Trending",
        features: ["Modern Design", "High Speed WiFi", "Metro Access"]
      },
      {
        id: 6,
        title: "Urban Creative Space",
        location: "Yaba, Lagos",
        price: "₦2,100,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        beds: 1, baths: 1, sqft: 950,
        rating: 4.4,
        badge: "Hot",
        features: ["Creative Hub", "Flexible Space", "Tech Community"]
      }
    ],
    premium: [
      {
        id: 7,
        title: "Luxury Duplex Mansion",
        location: "Banana Island, Lagos",
        price: "₦15,000,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        beds: 6, baths: 5, sqft: 5000,
        rating: 5.0,
        badge: "Exclusive",
        features: ["Private Beach", "Home Theater", "Wine Cellar"]
      },
      {
        id: 8,
        title: "Executive Duplex",
        location: "Parkview Estate, Ikoyi",
        price: "₦12,500,000",
        period: "per year",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
        beds: 5, baths: 4, sqft: 4200,
        rating: 4.9,
        badge: "Elite",
        features: ["Gated Community", "Golf Course", "Premium Location"]
      }
    ]
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
            <Eye className="w-4 h-4 mr-2" />
            Handpicked Properties
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover Your
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Dream Property
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our curated collection of premium properties across Lagos, each verified and ready for immediate occupancy.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                  : 'border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {properties[activeCategory].map((property) => (
            <Card 
              key={property.id}
              className="group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={property.image}
                  alt={property.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 text-white px-3 py-1 text-sm font-semibold">
                    {property.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{property.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{property.price}</div>
                    <div className="text-sm text-gray-500">{property.period}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-4 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.beds} beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.baths} baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.sqft} sqft</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {property.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PropertyShowcase;
