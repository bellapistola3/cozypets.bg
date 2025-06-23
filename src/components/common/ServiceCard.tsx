import React from 'react';

interface ServiceFeature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  features: string[];
  popular: boolean;
}

interface ServiceCardProps {
  service: ServiceFeature;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className={`relative rounded-2xl p-8 ${
      service.popular 
        ? 'bg-white border-2 border-green-400 shadow-xl shadow-green-500/20' 
        : 'bg-white/90 backdrop-blur-sm border border-green-200 shadow-lg'
    } transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
      service.popular ? 'hover:shadow-green-500/30' : 'hover:shadow-green-500/20'
    }`}>
      {service.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            Най-популярна
          </span>
        </div>
      )}
      
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
        service.popular 
          ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-md' 
          : 'bg-gradient-to-br from-green-50 to-green-100'
      }`}>
        <div className="text-green-600">
          {service.icon}
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
      
      <div className="text-2xl font-bold text-green-600 mb-6">
        {service.price}
      </div>
      
      <ul className="space-y-3">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-700">
            <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
            <span className="text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard