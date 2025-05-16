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
    <div className={`relative rounded-2xl p-6 ${
      service.popular 
        ? 'bg-primary-50 border-2 border-accent-500' 
        : 'bg-white border border-secondary-200'
    } shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      {service.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
        service.popular ? 'bg-primary-200' : 'bg-secondary-100'
      }`}>
        {service.icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-secondary-900">{service.title}</h3>
      <p className="text-secondary-700 mb-4">{service.description}</p>
      
      <div className="text-lg font-bold text-accent-600 mb-4">
        {service.price}
      </div>
      
      <ul className="space-y-2">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-center text-secondary-700">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard