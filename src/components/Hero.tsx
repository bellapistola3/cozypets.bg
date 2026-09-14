import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Search, Calendar, Heart, ShieldCheck } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section id="hero" className="relative h-[calc(100vh-96px)] mt-24 min-h-[620px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ transition: 'opacity 1s ease-in-out, transform 8s linear' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        
        {/* Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-emerald-400 w-8 scale-110 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 px-5 py-2 rounded-full mb-6 animate-fadeInUp">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="font-extrabold text-sm uppercase tracking-wider">#1 Платформа за гледане на любимци в България</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-2xl animate-fadeInUp">
            Професионална грижа за <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300">
              вашия домашен любимец
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 animate-fadeInUp animation-delay-100 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Свържете се с сертифицирани гледачи и ветеринари с 24/7 гаранция за безопасност и любов.
          </p>

          {/* Integrated Super Trigger CTA Pill */}
          <div className="animate-fadeInUp animation-delay-200">
            <button
              onClick={() => {
                const headerBtn = document.querySelector('header button');
                if (headerBtn) (headerBtn as HTMLElement).click();
                else window.location.href = '/search';
              }}
              className="group mx-auto inline-flex items-center justify-center gap-4 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xl px-10 py-5 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.6)] border-2 border-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Sparkles className="h-6 w-6 text-yellow-200" />
              </div>
              <span>Открий гледач или резервирай с 1 клик</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                →
              </div>
            </button>
          </div>

          {/* Security Features Pill */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-200 text-sm font-semibold">
            <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Застраховка при всяка резервация
            </span>
            <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Heart className="w-4 h-4 text-emerald-400" />
              Проверени ветеринари & гледачи
            </span>
          </div>

        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#services" className="text-white/80 hover:text-white flex flex-col items-center transition-colors">
          <span className="text-xs font-bold mb-1 tracking-wider uppercase">Открийте услугите</span>
          <ArrowDown className="h-5 w-5 text-emerald-400" />
        </a>
      </div>
    </section>
  );
};

export default Hero;