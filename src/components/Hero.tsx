import React, { useState } from 'react';
import Button from './common/Button';
import { ArrowDown, Search } from 'lucide-react';
import PetSitterSearch from './PetSitterSearch';

const Hero: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Floating Effect */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg"
          alt="Pet sitting background"
          className="w-full h-full object-cover animate-float"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mt-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp">
            Find Your Perfect <br />
            <span className="text-accent-500">Pet Sitter</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 animate-fadeInUp animation-delay-100">
            Connect with trusted pet sitters in your area who will treat your pets like family while you're away.
          </p>
          <div className="animate-fadeInUp animation-delay-200">
            <Button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center gap-2 text-lg px-8 py-3"
            >
              <Search className="h-5 w-5" />
              Find a Pet Sitter
            </Button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <PetSitterSearch onClose={() => setIsSearchOpen(false)} />
      )}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#services" className="text-white flex flex-col items-center">
          <span className="text-sm font-medium mb-2">Discover Our Services</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;