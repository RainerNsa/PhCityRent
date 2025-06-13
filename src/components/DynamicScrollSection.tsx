
import React, { useEffect, useRef, useState } from "react";
import { Shield, Home, Users, CheckCircle } from "lucide-react";

const DynamicScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Calculate progress when section is in view
      const startTrigger = sectionTop - windowHeight;
      const endTrigger = sectionTop + sectionHeight;
      
      if (scrollY >= startTrigger && scrollY <= endTrigger) {
        const progress = (scrollY - startTrigger) / (endTrigger - startTrigger);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Verified Properties Only",
      description: "Every listing is verified by our team",
      delay: 0,
    },
    {
      icon: Users,
      title: "Trusted Agents",
      description: "All agents are background-checked",
      delay: 0.2,
    },
    {
      icon: Home,
      title: "Secure Transactions",
      description: "Escrow service protects your payments",
      delay: 0.4,
    },
    {
      icon: CheckCircle,
      title: "Peace of Mind",
      description: "No more rental scams in Port Harcourt",
      delay: 0.6,
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden min-h-fit"
      style={{
        background: `linear-gradient(135deg, 
          rgba(249,115,22,${0.8 + scrollProgress * 0.2}) 0%, 
          rgba(249,115,22,${0.6 + scrollProgress * 0.3}) 50%, 
          rgba(251,146,60,${0.8 + scrollProgress * 0.2}) 100%)`
      }}
    >
      {/* Dynamic background elements - contained within section */}
      <div 
        className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
        style={{
          transform: `translateX(${(1 - scrollProgress) * 50}px) translateY(${scrollProgress * 30}px)`,
          opacity: 0.3 + scrollProgress * 0.4,
        }}
      ></div>
      
      <div 
        className="absolute bottom-10 left-10 w-48 h-48 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
        style={{
          transform: `translateX(${(1 - scrollProgress) * -50}px) translateY(${(1 - scrollProgress) * 30}px)`,
          opacity: 0.2 + scrollProgress * 0.6,
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className="text-center mb-12 md:mb-16 transition-all duration-1000"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 30}px)`,
            opacity: Math.max(0.3, scrollProgress),
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why RentPH Safe is Different
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            We've revolutionized the rental process in Port Harcourt with verified listings and secure transactions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const itemProgress = Math.max(0, Math.min(1, (scrollProgress - feature.delay) / 0.3));
            
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl text-center p-6 transition-all duration-500 hover:bg-white/20"
                style={{
                  transform: `translateY(${(1 - itemProgress) * 50}px) scale(${0.9 + itemProgress * 0.1})`,
                  opacity: Math.max(0.1, itemProgress),
                }}
              >
                <div 
                  className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500"
                  style={{
                    transform: `rotate(${itemProgress * 180}deg)`,
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic stats counter */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center transition-all duration-1000"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 20}px)`,
            opacity: Math.max(0.3, scrollProgress),
          }}
        >
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {Math.floor(scrollProgress * 500)}+
            </div>
            <div className="text-white/80">Verified Properties</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {Math.floor(scrollProgress * 150)}+
            </div>
            <div className="text-white/80">Trusted Agents</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {Math.floor(scrollProgress * 1000)}+
            </div>
            <div className="text-white/80">Happy Tenants</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicScrollSection;
