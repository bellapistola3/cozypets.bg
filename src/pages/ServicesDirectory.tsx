import React from 'react';
import { Search } from 'lucide-react';
import ServiceGrid from '../components/services/ServiceGrid';

const ServicesDirectory: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Нашите услуги
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Открийте перфектната грижа за вашия домашен любимец. Изберете услуга и намерете най-добрите гледачи в България.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Търсене на услуга..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <ServiceGrid />

        <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Не намирате това, което търсите?</h2>
          <p className="text-lg mb-6 opacity-90">
            Свържете се с нас и ще ви помогнем да намерите идеалната грижа за вашия любимец
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
            Свържете се с нас
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesDirectory;
