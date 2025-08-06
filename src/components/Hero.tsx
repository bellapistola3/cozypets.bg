import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import Button from './common/Button';
import { ArrowDown, Search } from 'lucide-react';
import PetSitterSearch from './PetSitterSearch';

const Hero: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dynamic hero images with pets
  const heroImages = [
    {
      url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      alt: 'Beautiful dogs in nature'
    },
    {
      url: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      alt: 'Happy golden retriever playing'
    },
    {
      url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      alt: 'Cute cat resting peacefully'
    },
    {
      url: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg',
      alt: 'Cat looking through window'
    },
    {
      url: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      alt: 'Dog enjoying a walk'
    },
    {
      url: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
      alt: 'Playful cat with toy'
    },
    {
      url: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg',
      alt: 'Guinea pig eating vegetables'
    },
    {
      url: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg',
      alt: 'Rabbit in the garden'
    }
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section id="hero" className="relative h-[calc(100vh-80px)] mt-20 min-h-[600px] flex items-center">
      {/* Background Image - Beautiful dogs image */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        
        {/* Image indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp">
            Намерете вашия перфектен <br />
            <span className="text-green-400">гледач на домашни любимци</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 animate-fadeInUp animation-delay-100">
            Свържете се с доверени гледачи на домашни любимци в района ви, които ще се отнасят към вашите любимци като към семейство, докато сте далеч.
          </p>
          <div className="animate-fadeInUp animation-delay-200">
            <button 
              onClick={() => window.location.href = '/search'}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-400/20"
            >
              <Search className="h-7 w-7" />
              Намерете гледач на домашни любимци
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#services" className="text-white flex flex-col items-center">
          <span className="text-sm font-medium mb-2">Открийте нашите услуги</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;