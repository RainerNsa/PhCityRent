
import React from "react";
import { Star, MapPin, GraduationCap, Briefcase, Home } from "lucide-react";

const LocalTestimonials = () => {
  const testimonials = [
    {
      name: "Chioma Okeke",
      role: "NYSC Corps Member",
      location: "Trans Amadi",
      rating: 5,
      avatar: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
      icon: GraduationCap,
      before: "I was scammed ₦400,000 by a fake agent who showed me someone else's property photos on WhatsApp.",
      after: "Found my current apartment through PHCityRent's verified agent. The escrow service protected my money until I got the keys.",
      savings: "₦400,000 saved from scam"
    },
    {
      name: "Daniel Eze",
      role: "Shell Employee",
      location: "GRA Phase 2",
      rating: 5,
      avatar: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
      icon: Briefcase,
      before: "Spent 3 months house hunting, visiting fake properties and dealing with agents who disappeared after collecting 'viewing fees'.",
      after: "Used PHCityRent and found my dream house in 2 weeks. All agents are ID-verified and the property matched exactly what was advertised.",
      savings: "3 months time saved"
    },
    {
      name: "Blessing Uche",
      role: "UNIPORT Student",
      location: "Choba",
      rating: 5,
      avatar: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
      icon: GraduationCap,
      before: "Almost paid double rent for a property that was already occupied. The 'landlord' was actually a scammer.",
      after: "PHCityRent's verification process caught the scam before I lost money. Found authentic student housing near campus.",
      savings: "₦200,000 scam avoided"
    },
    {
      name: "Mrs. Ada Nwankwo",
      role: "Property Owner",
      location: "Eliozu",
      rating: 5,
      avatar: "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png",
      icon: Home,
      before: "Tenants kept disappearing without paying rent. Lost ₦800,000 in unpaid rent and property damage.",
      after: "PHCityRent's tenant screening and escrow system ensures I get paid on time. Zero bad tenants in 8 months.",
      savings: "₦800,000 in unpaid rent recovered"
    }
  ];

  const stats = [
    { number: "₦50M+", label: "Protected from Scams", color: "text-green-600" },
    { number: "1,200+", label: "Verified Properties", color: "text-blue-600" },
    { number: "450+", label: "ID-Checked Agents", color: "text-purple-600" },
    { number: "98%", label: "Scam Prevention Rate", color: "text-orange-600" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real Port Harcourt Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how PHCityRent has protected our neighbors from rental scams and found them safe homes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Before/After Stories */}
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{testimonial.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Icon className="w-4 h-4" />
                        <span>{testimonial.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-bold text-red-700 mb-3">Before PHCityRent:</h4>
                      <p className="text-gray-700 italic">"{testimonial.before}"</p>
                    </div>

                    {/* After */}
                    <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-bold text-green-700 mb-3">After PHCityRent:</h4>
                      <p className="text-gray-700 italic">"{testimonial.after}"</p>
                      <div className="mt-3 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        💰 {testimonial.savings}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Trust */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Join the Protected Community</h3>
            <p className="text-gray-600 mb-6">
              Over 5,000 Port Harcourt residents trust PHCityRent for safe housing
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
              <span>✓ NYSC Recommended</span>
              <span>✓ Student Verified</span>
              <span>✓ Professional Approved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalTestimonials;
