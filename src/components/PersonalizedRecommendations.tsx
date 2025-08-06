import React, { useState, useEffect } from 'react';
import { Star, MapPin, Heart, TrendingUp } from 'lucide-react';
import { SitterWithDetails, User, Review } from '../types';
import SitterCard from './SitterCard';

interface PersonalizedRecommendationsProps {
  userId: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<SitterWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user preferences (in a real app, this would come from user profile)
  const userPreferences = {
    preferredServices: ['daily-walks', 'home-visits'],
    preferredPetTypes: ['dog'],
    maxPrice: 100,
    preferredLocation: 'София',
    minRating: 4.5,
  };

  // Mock sitters data
  const mockSitters: SitterWithDetails[] = [
    {
      sitter_id: 1,
      user_id: 1,
      bio: 'Обожавам животните и имам над 5 години опит в грижата за домашни любимци.',
      photo_url: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
      hourly_rate: 25.00,
      location: 'София, кв. Лозенец',
      qualifications: '5 години опит, сертификат за първа помощ за животни',
      rating: 4.9,
      average_rating: 4.9,
      total_reviews: 47,
      createdAt: new Date(),
      updated_at: new Date(),
      user: {
        user_id: 1,
        name: 'Мария Петкова',
        email: 'maria@example.com',
        phone: '+359888123456',
        password_hash: '',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      reviews: [],
    },
    {
      sitter_id: 2,
      user_id: 2,
      bio: 'Специализирам се в грижата за кучета от големи породи.',
      photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      hourly_rate: 30.00,
      location: 'София, кв. Младост',
      qualifications: '3 години опит, специализация в големи породи кучета',
      rating: 4.8,
      average_rating: 4.8,
      total_reviews: 32,
      createdAt: new Date(),
      updated_at: new Date(),
      user: {
        user_id: 2,
        name: 'Анна Георгиева',
        email: 'anna@example.com',
        phone: '+359888234567',
        password_hash: '',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      reviews: [],
    },
  ];

  useEffect(() => {
    // Simulate API call to get personalized recommendations
    const getRecommendations = async () => {
      setLoading(true);
      
      // Filter sitters based on user preferences
      const filtered = mockSitters.filter(sitter => {
        // Simplified filtering based on available data
        const isInPriceRange = sitter.hourly_rate <= userPreferences.maxPrice;
        const isInPreferredLocation = sitter.location.includes(userPreferences.preferredLocation);
        const meetsRatingRequirement = sitter.average_rating >= userPreferences.minRating;

        return isInPriceRange && isInPreferredLocation && meetsRatingRequirement;
      });

      // Sort by rating and experience
      const sorted = filtered.sort((a, b) => {
        const scoreA = a.average_rating * 0.7 + (a.hourly_rate / 100) * 0.3;
        const scoreB = b.average_rating * 0.7 + (b.hourly_rate / 100) * 0.3;
        return scoreB - scoreA;
      });

      setTimeout(() => {
        setRecommendations(sorted);
        setLoading(false);
      }, 1000);
    };

    getRecommendations();
  }, [userId]);

  const getRecommendationReason = (sitter: SitterWithDetails) => {
    const reasons = [];
    
    if (sitter.average_rating >= 4.8) {
      reasons.push('Високо оценен');
    }
    
    if (sitter.location.includes(userPreferences.preferredLocation)) {
      reasons.push('В района ви');
    }
    
    if (sitter.hourly_rate <= userPreferences.maxPrice * 0.8) {
      reasons.push('Добра цена');
    }

    return reasons[0] || 'Препоръчан за вас';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            Препоръчани за вас
          </h2>
          <p className="text-gray-600 mt-1">
            Базирано на вашите предпочитания и история на резервации
          </p>
        </div>
        <button className="text-green-600 hover:text-green-700 font-medium">
          Виж всички
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Няма препоръки в момента
          </h3>
          <p className="text-gray-600">
            Актуализирайте предпочитанията си, за да получите персонализирани препоръки
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((sitter) => (
            <div key={sitter.sitter_id} className="relative">
              {/* Recommendation badge */}
              <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {getRecommendationReason(sitter)}
              </div>
              <SitterCard sitter={sitter} />
            </div>
          ))}
        </div>
      )}

      {/* Preferences Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4">Вашите предпочитания</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Услуги:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {userPreferences.preferredServices.map(service => (
                <span key={service} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  {service === 'daily-walks' ? 'Разходки' : 'Домашно гледане'}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Домашни любимци:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {userPreferences.preferredPetTypes.map(petType => (
                <span key={petType} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  {petType === 'dog' ? 'Кучета' : petType}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Максимална цена:</span>
            <p className="font-medium text-gray-900">{userPreferences.maxPrice} лв.</p>
          </div>
          <div>
            <span className="text-gray-600">Локация:</span>
            <p className="font-medium text-gray-900">{userPreferences.preferredLocation}</p>
          </div>
        </div>
        <button className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm">
          Редактирай предпочитания
        </button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;