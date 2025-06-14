
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Building, 
  Users, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  Star,
  TrendingUp,
  Calendar,
  FileText,
  CreditCard
} from "lucide-react";

const Landlords = () => {
  const features = [
    {
      icon: Building,
      title: "Property Management",
      description: "Easily manage multiple properties from one dashboard"
    },
    {
      icon: Users,
      title: "Tenant Screening",
      description: "Comprehensive background checks and verification tools"
    },
    {
      icon: DollarSign,
      title: "Rent Collection",
      description: "Automated rent collection with escrow protection"
    },
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Access to legal documents and tenant dispute resolution"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increased Revenue",
      description: "Our verified listings get 3x more views than unverified ones",
      stat: "300% more views"
    },
    {
      icon: Calendar,
      title: "Faster Rentals",
      description: "Verified properties rent 50% faster on average",
      stat: "50% faster"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% payment guarantee through our escrow service",
      stat: "100% secure"
    }
  ];

  const testimonials = [
    {
      name: "Mrs. Ada Uche",
      property: "5 Properties in GRA",
      rating: 5,
      text: "RentPH Safe has revolutionized how I manage my properties. The tenant screening is excellent and I never worry about payments anymore."
    },
    {
      name: "Mr. Johnson Okeke",
      property: "12 Properties in Trans Amadi",
      rating: 5,
      text: "Since joining RentPH Safe, my vacancy rates dropped to almost zero. The platform brings quality tenants who pay on time."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Landlord Solutions</h1>
            <p className="text-xl opacity-90">Maximize your rental income with our comprehensive property management platform</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Key Features */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Manage Your Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From listing to rent collection, we provide all the tools you need to succeed as a landlord
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Benefits with Stats */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Verified Landlords Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Simple 3-Step Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-2">Submit Documents</h3>
                <p className="text-gray-600">Provide property ownership documents and ID verification</p>
              </div>
              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-2">Property Inspection</h3>
                <p className="text-gray-600">Our team verifies your property details and condition</p>
              </div>
              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-2">Start Listing</h3>
                <p className="text-gray-600">Get verified badge and start receiving quality tenant inquiries</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">What Our Landlords Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.property}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Transparent Pricing</h2>
            <div className="text-4xl font-bold text-blue-600 mb-2">5%</div>
            <p className="text-xl mb-4">Commission on successful rentals only</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>No monthly fees</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>No listing fees</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>No hidden charges</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Get Verified as Landlord
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landlords;
