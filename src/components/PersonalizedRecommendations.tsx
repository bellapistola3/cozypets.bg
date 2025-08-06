import React, { useState, useEffect } from 'react';
import { Star, MapPin, Heart, TrendingUp } from 'lucide-react';
import { Sitter } from '../types';
import SitterCard from './SitterCard';

interface PersonalizedRecommendationsProps {
  userId: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<Sitter[]>([]);
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
  const mockSitters: Sitter[] = [
    {
      id: '1',
      firstName: 'Мария',
      lastName: 'Петкова',
      email: 'maria@example.com',
      phone: '+359888123456',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
      createdAt: new Date(),
      isVerified: true,
      bio: 'Обожавам животните и имам над 5 години опит в грижата за домашни любимци.',
      experience: 5,
      services: ['daily-walks', 'home-visits'],
      location: {
        city: 'София',
        address: 'кв. Лозенец',
      },
      pricing: {
        'daily-walks': 25,
        'home-visits': 60,
        'overnight': 95,
        'pet-taxi': 35,
        'grooming': 50,
      },
      availability: {},
      photos: ['https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg'],
      reviews: [],
      rating: 4.9,
      totalReviews: 47,
      languages: ['Български', 'English'],
      petTypes: ['dog', 'cat'],
      emergencyContact: {
        name: 'Иван Петков',
        phone: '+359888654321',
      },
    },
    {
      id: '2',
      firstName: 'Анна',
      lastName: 'Георгиева',
      email: 'anna@example.com',
      phone: '+359888234567',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      createdAt: new Date(),
      isVerified: true,
      bio: 'Специализирам се в грижата за кучета от големи породи.',
      experience: 3,
      services: ['daily-walks', 'pet-taxi'],
      location: {
        city: 'София',
        address: 'кв. Младост',
      },
      pricing: {
        'daily-walks': 30,
        'home-visits': 70,
        'overnight': 100,
        'pet-taxi': 40,
        'grooming': 55,
      },
      availability: {},
      photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'],
      reviews: [],
      rating: 4.8,
      totalReviews: 32,
      languages: ['Български'],
      petTypes: ['dog'],
      emergencyContact: {
        name: 'Петър Георгиев',
        phone: '+359888765432',
      },
    },
  ];

  useEffect(() => {
    // Simulate API call to get personalized recommendations
    const getRecommendations = async () => {
      setLoading(true);
      
      // Filter sitters based on user preferences
      const filtered = mockSitters.filter(sitter => {
        const hasPreferredService = sitter.services.some(service => 
          userPreferences.preferredServices.includes(service)
        );
        const hasPreferredPetType = sitter.petTypes.some(petType => 
          userPreferences.preferredPetTypes.includes(petType)
        );
        const isInPriceRange = Math.min(...Object.values(sitter.pricing)) <= userPreferences.maxPrice;
        const isInPreferredLocation = sitter.location.city === userPreferences.preferredLocation;
        const meetsRatingRequirement = sitter.rating >= userPreferences.minRating;

        return hasPreferredService && hasPreferredPetType && isInPriceRange && 
               isInPreferredLocation && meetsRatingRequirement;
      });

      // Sort by rating and experience
      const sorted = filtered.sort((a, b) => {
        const scoreA = a.rating * 0.7 + (a.experience / 10) * 0.3;
        const scoreB = b.rating * 0.7 + (b.experience / 10) * 0.3;
        return scoreB - scoreA;
      });

      setTimeout(() => {
        setRecommendations(sorted);
        setLoading(false);
      }, 1000);
    };

    getRecommendations();
  }, [userId]);

  const getRecommendationReason = (sitter: Sitter) => {
    const reasons = [];
    
    if (sitter.rating >= 4.8) {
      reasons.push('Високо оценен');
    }
    
    if (sitter.services.some(service => userPreferences.preferredServices.includes(service))) {
      reasons.push('Предлага предпочитаните ви услуги');
    }
    
    if (sitter.location.city === userPreferences.preferredLocation) {
      reasons.push('В района ви');
    }
    
    if (Math.min(...Object.values(sitter.pricing)) <= userPreferences.maxPrice * 0.8) {
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
            <div key={sitter.id} className="relative">
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