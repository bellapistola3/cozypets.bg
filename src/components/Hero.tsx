import React, { useState } from 'react';
import Button from './common/Button';
import { ArrowDown, Search } from 'lucide-react';
import PetSitterSearch from './PetSitterSearch';

const Hero: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <section id="hero" className="relative h-[calc(100vh-80px)] mt-20 min-h-[600px] flex items-center">
      {/* Background Image - Beautiful dogs image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
          alt="Beautiful dogs in nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
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