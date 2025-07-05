
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProperty } from "@/hooks/useProperty";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import EnhancedBreadcrumb from "@/components/ui/enhanced-breadcrumb";
import EnhancedPropertyDetail from "@/components/properties/EnhancedPropertyDetail";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="animate-pulse space-y-8">
              {/* Breadcrumb Skeleton */}
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              
              {/* Header Skeleton */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="aspect-video bg-gray-200 rounded-2xl"></div>
                  <div className="bg-white rounded-2xl p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <EnhancedBreadcrumb 
              items={[
                { label: 'Properties', href: '/properties' },
                { label: 'Property Not Found' }
              ]} 
            />
            
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                The property you're looking for doesn't exist or is no longer available. 
                It may have been rented or removed from our listings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/properties">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Browse Properties
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold">
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Enhanced Breadcrumb */}
          <EnhancedBreadcrumb 
            items={[
              { label: 'Properties', href: '/properties' },
              { label: property.title }
            ]} 
          />

          {/* Enhanced Property Detail Component */}
          <EnhancedPropertyDetail 
            property={property}
            tourImages={property.images || []}
            reviews={[]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
