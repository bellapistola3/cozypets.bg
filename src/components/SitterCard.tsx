import React from 'react';
import { Star, MapPin, Shield, Heart, MessageCircle } from 'lucide-react';
import { Sitter } from '../types';
import Button from './common/Button';

interface SitterCardProps {
  sitter: Sitter;
}

const SitterCard: React.FC<SitterCardProps> = ({ sitter }) => {
  const getServiceLabel = (service: string) => {
    const labels: { [key: string]: string } = {
      'daily-walks': 'Разходки',
      'home-visits': 'Домашно гледане',
      'overnight': 'Нощна грижа',
      'pet-taxi': 'Такси',
      'grooming': 'Груминг',
    };
    return labels[service] || service;
  };

  const getPetTypeLabel = (petType: string) => {
    const labels: { [key: string]: string } = {
      'dog': 'Кучета',
      'cat': 'Котки',
      'bird': 'Птици',
      'small-mammal': 'Дребни бозайници',
      'reptile': 'Влечуги',
      'other': 'Други',
    };
    return labels[petType] || petType;
  };

  const minPrice = Math.min(...Object.values(sitter.pricing));

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Header with photo and basic info */}
      <div className="relative">
        <img
          src={sitter.avatar}
          alt={`${sitter.firstName} ${sitter.lastName}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {sitter.isVerified && (
            <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Проверен
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="font-semibold text-gray-900">{sitter.rating}</span>
            <span className="text-gray-600 text-sm ml-1">({sitter.totalReviews})</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Name and location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {sitter.firstName} {sitter.lastName}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{sitter.location.city}, {sitter.location.address}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {sitter.bio}
        </p>

        {/* Services */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {sitter.services.slice(0, 3).map(service => (
              <span
                key={service}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {getServiceLabel(service)}
              </span>
            ))}
            {sitter.services.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                +{sitter.services.length - 3} още
              </span>
            )}
          </div>
        </div>

        {/* Pet types */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Грижи се за:</p>
          <div className="flex flex-wrap gap-1">
            {sitter.petTypes.map(petType => (
              <span
                key={petType}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                {getPetTypeLabel(petType)}
              </span>
            ))}
          </div>
        </div>

        {/* Experience and pricing */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Опит</p>
            <p className="font-semibold text-gray-900">{sitter.experience} години</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">От</p>
            <p className="font-bold text-green-600 text-lg">{minPrice} лв.</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 text-sm py-2">
            <MessageCircle className="h-4 w-4 mr-2" />
            Свържи се
          </Button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitterCard;