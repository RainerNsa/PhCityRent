
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, UserCheck, Shield, Home } from "lucide-react";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const StepCard = ({ number, title, description, icon: Icon, isActive, onClick }: StepCardProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl p-6 cursor-pointer transition-all duration-500 border",
        isActive 
          ? "bg-white shadow-lg border-blue-200" 
          : "bg-white/50 hover:bg-white/80 border-transparent"
      )}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={cn(
          "flex items-center justify-center rounded-full w-12 h-12 mr-4 flex-shrink-0 transition-colors duration-300",
          isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className={cn(
            "text-lg font-semibold mb-2 transition-colors duration-300",
            isActive ? "text-blue-600" : "text-gray-800"
          )}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsData = [
    {
      number: "01",
      title: "Browse Verified Listings",
      description: "Search through our database of verified rental properties across Port Harcourt, all vetted by our team.",
      icon: Search,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "02",
      title: "Connect with Trusted Agents",
      description: "Get in touch with verified agents who have been thoroughly screened and approved by our platform.",
      icon: UserCheck,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "03",
      title: "Secure Your Rent with Escrow",
      description: "Use our secure escrow service to protect your rent payment until you've verified the property and keys.",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "04",
      title: "Move Into Your New Home",
      description: "Complete the rental process with confidence, knowing you're protected from scams and fraud.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [stepsData.length]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll(".fade-in-stagger");
    elements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${0.1 * (index + 1)}s`;
      observer.observe(el);
    });
    
    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  return (
    <section className="py-20 bg-gray-50 relative" id="how-it-works" ref={sectionRef}>
      <div className="absolute -top-20 right-0 w-72 h-72 bg-blue-100/60 rounded-full opacity-60 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-green-50 rounded-full opacity-70 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 fade-in-stagger">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200 mb-4">
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple four-step process ensures you find verified rentals safely and securely.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 order-2 lg:order-1 opacity-0 fade-in-stagger">
            {stepsData.map((step, index) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
          
          <div className="relative rounded-3xl overflow-hidden h-[400px] shadow-lg order-1 lg:order-2 opacity-0 fade-in-stagger">
            {stepsData.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  activeStep === index ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="text-blue-400 font-medium mb-2 block">{step.number}</span>
                    <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-white/80">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
