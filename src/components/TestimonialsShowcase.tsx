
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsShowcase = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Adebayo Johnson",
      role: "Software Engineer",
      company: "Shell Nigeria",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "PHCityRent transformed my house hunting experience completely. The AI recommendations were spot-on, and I found my perfect apartment in just 3 days. The escrow service gave me complete peace of mind.",
      location: "Old GRA, Port Harcourt",
      property: "3-bedroom apartment"
    },
    {
      id: 2,
      name: "Funmi Adebisi",
      role: "Marketing Director",
      company: "Total Nigeria",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As a busy professional, I needed a platform that understood my needs. PHCityRent's personalized approach and verified listings saved me weeks of searching. Highly recommended!",
      location: "New GRA, Port Harcourt",
      property: "Executive studio"
    },
    {
      id: 3,
      name: "Chidi Okafor",
      role: "Business Owner",
      company: "TechHub Port Harcourt",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The virtual tours feature is revolutionary! I was able to shortlist properties from Abuja and secure my Port Harcourt apartment before even visiting. The transparency in pricing is refreshing.",
      location: "Woji, Port Harcourt",
      property: "4-bedroom duplex"
    },
    {
      id: 4,
      name: "Kemi Adesanya",
      role: "Doctor",
      company: "University of Port Harcourt Teaching Hospital",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Moving to Port Harcourt for my residency was stressful until I found PHCityRent. The verified agents, secure payments, and neighborhood insights made everything seamless. Thank you!",
      location: "D-Line, Port Harcourt",
      property: "2-bedroom apartment"
    },
    {
      id: 5,
      name: "Emeka Nwankwo",
      role: "Investment Banker",
      company: "Zenith Bank",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The market intelligence feature helped me negotiate the best deal. PHCityRent's data-driven approach to property rental is exactly what Port Harcourt needs. Outstanding service!",
      location: "Trans Amadi, Port Harcourt",
      property: "Luxury penthouse"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Real Stories, Real Results
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            What Our
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied tenants and landlords who have transformed their rental experience with PhCityRent.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-6xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="flex items-center justify-between mb-8">
                <Quote className="w-16 h-16 text-orange-500 opacity-50" />
                <div className="flex items-center space-x-1">
                  {[...Array(testimonials[activeSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-2xl lg:text-3xl text-white font-medium leading-relaxed mb-8">
                "{testimonials[activeSlide].text}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 ring-4 ring-orange-500/30">
                    <AvatarImage src={testimonials[activeSlide].image} />
                    <AvatarFallback className="bg-orange-500 text-white text-lg font-semibold">
                      {testimonials[activeSlide].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-bold text-white">{testimonials[activeSlide].name}</div>
                    <div className="text-orange-400 font-medium">{testimonials[activeSlide].role}</div>
                    <div className="text-gray-400 text-sm">{testimonials[activeSlide].company}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-gray-300 text-sm mb-1">{testimonials[activeSlide].property}</div>
                  <div className="text-gray-400 text-sm">{testimonials[activeSlide].location}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center space-x-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSlide === index ? 'bg-orange-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-gray-400">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">2,500+</div>
            <div className="text-gray-400">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">98%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsShowcase;
