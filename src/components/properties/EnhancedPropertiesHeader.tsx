
import React from "react";
import { Search, Filter, MapPin, Building2 } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

const EnhancedPropertiesHeader = () => {
  const stats = [
    { 
      icon: Building2, 
      number: "500+", 
      label: "Active Properties",
      color: "text-orange-600"
    },
    { 
      icon: MapPin, 
      number: "15+", 
      label: "Areas Covered",
      color: "text-blue-600"
    },
    { 
      icon: Search, 
      number: "1,000+", 
      label: "Monthly Searches",
      color: "text-green-600"
    },
    { 
      icon: Filter, 
      number: "50+", 
      label: "Filter Options",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-16 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Property in Port Harcourt
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse through our extensive collection of verified properties. 
            Use our advanced filters to find exactly what you're looking for.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedPropertiesHeader;
