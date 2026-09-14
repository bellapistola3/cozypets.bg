import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ServiceType } from '../../lib/services/servicesList';
import ServiceModal from './ServiceModal';

interface ServiceCardProps {
  service: ServiceType;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSearch = (serviceId: string) => {
    setIsModalOpen(false);
    navigate(`/search?service=${serviceId}`);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-orange-400 transform hover:-translate-y-2"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {service.name}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-orange-600 font-semibold text-sm">
              {service.priceRange}
            </span>
            <span className="text-xs text-gray-500 group-hover:text-orange-500 transition-colors">
              Виж детайли →
            </span>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>

      <ServiceModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default ServiceCard;
