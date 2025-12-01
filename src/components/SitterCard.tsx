import React from 'react';
import { Star, MapPin, Shield, Heart } from 'lucide-react';
import { SitterWithDetails } from '../types';
import Button from './common/Button';

interface SitterCardProps {
  sitter: SitterWithDetails;
}

const SitterCard: React.FC<SitterCardProps> = ({ sitter }) => {
  return (
    <div className="interactive-card neon-glow bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with photo and basic info */}
      <div className="relative">
        <img
          src={sitter.photo_url || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg'}
          alt={sitter.user?.name || 'Гледач'}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {sitter.rating >= 4.5 && (
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
            <span className="text-gray-600 text-sm ml-1">({sitter.total_reviews})</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Name and location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {sitter.user?.name || 'Гледач'}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{sitter.location}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4">
          {sitter.bio}
        </p>

        {/* Qualifications */}
        <div className="mb-4">
          {sitter.qualifications && (
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {sitter.qualifications}
              </span>
            </div>
          )}
        </div>

        {/* Rating and pricing */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Рейтинг</p>
            <p className="font-semibold text-gray-900">{sitter.average_rating.toFixed(1)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">От</p>
            <p className="font-bold text-green-600 text-lg">{sitter.hourly_rate} лв./час</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1 text-sm py-2"
            onClick={() => window.location.href = `/#booking?sitter=${sitter.id}&location=${sitter.location}`}
          >
            Резервирай
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