
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImageGalleryProps {
  propertyId: string;
  title: string;
}

const PropertyImageGallery = ({ propertyId, title }: PropertyImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Same Nigerian property images as other components
  const nigerianPropertyImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
  ];

  // Same hash function for consistent image selection
  const getImageIndex = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % nigerianPropertyImages.length;
  };

  // Get base image and create gallery with 3-4 related images
  const baseIndex = getImageIndex(propertyId);
  const galleryImages = [
    nigerianPropertyImages[baseIndex],
    nigerianPropertyImages[(baseIndex + 1) % nigerianPropertyImages.length],
    nigerianPropertyImages[(baseIndex + 2) % nigerianPropertyImages.length],
    nigerianPropertyImages[(baseIndex + 3) % nigerianPropertyImages.length],
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={galleryImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
              currentImageIndex === index ? 'border-orange-500' : 'border-transparent'
            }`}
          >
            <img
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyImageGallery;
