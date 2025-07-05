
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building, Users, Star, Shield } from 'lucide-react';

const EnhancedHero = () => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    // Navigate to properties page with filters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('type', propertyType);
    if (budget) params.append('budget', budget);
    
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
              <Building className="w-4 h-4 mr-2" />
              #1 Rental Platform in Port Harcourt
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your
                <br />
                <span className="text-orange-500">Perfect Home</span>
                <br />
                in Port Harcourt
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Discover premium rental properties with verified listings, transparent pricing, and secure transactions. Your dream home is just a click away.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-xl"
                onClick={() => window.location.href = '/properties'}
              >
                Explore Properties →
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 text-lg rounded-xl"
                onClick={() => window.location.href = '/agents'}
              >
                Find an Agent
              </Button>
            </div>

            {/* Quick Property Search */}
            <Card className="w-full bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Property Search</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-4 h-4" />
                      <Input
                        placeholder="Port Harcourt, Rivers"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Property Type</label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500">
                        <SelectValue placeholder="Apartment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="bungalow">Bungalow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Budget</label>
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500">
                        <SelectValue placeholder="₦200k - ₦500k" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-200000">Under ₦200k</SelectItem>
                        <SelectItem value="200000-500000">₦200k - ₦500k</SelectItem>
                        <SelectItem value="500000-1000000">₦500k - ₦1M</SelectItem>
                        <SelectItem value="1000000-2000000">₦1M - ₦2M</SelectItem>
                        <SelectItem value="2000000+">Above ₦2M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg font-medium rounded-lg"
                >
                  Search Properties
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Image and Stats */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/lovable-uploads/384341c1-7fa8-4f09-8a30-c684732b5b00.png" 
                alt="Modern apartment interior"
                className="w-full h-[600px] object-cover"
              />
              
              {/* Stats Overlay */}
              <Card className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Column 1 */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">500+</div>
                        <div className="text-sm text-gray-600">Premium Properties</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">100%</div>
                        <div className="text-sm text-gray-600">Verified Listings</div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">2000+</div>
                        <div className="text-sm text-gray-600">Happy Tenants</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">4.9</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
