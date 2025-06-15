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
        "feature-card cursor-pointer transition-all duration-500 border",
        isActive 
          ? "glass-card border-pulse-200 shadow-elegant" 
          : "bg-white/50 hover:bg-white/80 border-transparent hover:shadow-elegant"
      )}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={cn(
          "flex items-center justify-center rounded-full w-12 h-12 mr-4 flex-shrink-0 transition-colors duration-300",
          isActive ? "bg-pulse-500 text-white" : "bg-gray-100 text-gray-500"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className={cn(
            "text-lg font-display font-semibold mb-2 transition-colors duration-300",
            isActive ? "text-pulse-500" : "text-gray-800"
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
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80" // Modern Nigerian duplex
    },
    {
      number: "02",
      title: "Connect with Trusted Agents",
      description: "Get in touch with verified agents who have been thoroughly screened and approved by our platform.",
      icon: UserCheck,
      image: "https://images.unsplash.com/photo-1565402170291-8491f14678db?auto=format&fit=crop&w=800&q=80" // Nigerian residential building/agent scene
    },
    {
      number: "03",
      title: "Secure Your Rent with Escrow",
      description: "Use our secure escrow service to protect your rent payment until you've verified the property and keys.",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80" // Nigerian modern home/security
    },
    {
      number: "04",
      title: "Move Into Your New Home",
      description: "Complete the rental process with confidence, knowing you're protected from scams and fraud.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=800&q=80" // Nigerian family home/moving scene
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
    <section className="section-container relative animate-on-scroll" id="how-it-works" ref={sectionRef} style={{
      background: 'linear-gradient(180deg, rgba(249,115,22,0.02) 0%, rgba(249,115,22,0.05) 100%)'
    }}>
      <div className="absolute -top-20 right-0 w-72 h-72 bg-pulse-100/60 rounded-full opacity-60 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-pulse-50 rounded-full opacity-70 blur-3xl -z-10"></div>
      
      <div className="text-center mb-16 opacity-0 fade-in-stagger">
        <div className="pulse-chip mb-4">
          <span>Simple Process</span>
        </div>
        <h2 className="section-title text-gray-900 mb-4">How It Works</h2>
        <p className="section-subtitle">
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
        
        <div className="robot-image-container h-[400px] order-1 lg:order-2 opacity-0 fade-in-stagger">
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
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-2xl">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="text-pulse-400 font-medium mb-2 block">{step.number}</span>
                  <h3 className="text-2xl font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
