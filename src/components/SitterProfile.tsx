import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Shield,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  Award,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Sitter } from '../types';
import Button from './common/Button';
import ReviewsList from './ReviewsList';

interface SitterProfileProps {
  sitter: Sitter;
  onClose: () => void;
}

const SitterProfile: React.FC<SitterProfileProps> = ({ sitter, onClose }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const getServiceLabel = (service: string) => {
    const labels: { [key: string]: string } = {
      'daily-walks': 'Ежедневни разходки',
      'home-visits': 'Домашно гледане',
      'overnight': 'Нощна грижа',
      'pet-taxi': 'Такси за домашни любимци',
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

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % sitter.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + sitter.photos.length) % sitter.photos.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {/* Photo Gallery */}
            <div className="relative h-80 overflow-hidden rounded-t-2xl">
              <img
                src={sitter.photos[currentPhotoIndex]}
                alt={`${sitter.firstName} ${sitter.lastName}`}
                className="w-full h-full object-cover"
              />
              
              {sitter.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {sitter.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="absolute top-4 right-4 flex gap-2">
                {sitter.isVerified && (
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Проверен
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Basic Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {sitter.firstName} {sitter.lastName}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{sitter.location.city}, {sitter.location.address}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold text-gray-900 mr-2">{sitter.rating}</span>
                  <span className="text-gray-600">({sitter.totalReviews} отзива)</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline">
                  <Heart className="h-5 w-5 mr-2" />
                  Запази
                </Button>
                <Button onClick={() => setShowBookingModal(true)}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Резервирай
                </Button>
              </div>
            </div>

            {/* About */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">За мен</h2>
              <p className="text-gray-700 leading-relaxed">{sitter.bio}</p>
            </div>

            {/* Experience & Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{sitter.experience}</div>
                <div className="text-gray-600">години опит</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{sitter.rating}</div>
                <div className="text-gray-600">средна оценка</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-gray-600">наличност</div>
              </div>
            </div>

            {/* Services & Pricing */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Услуги и цени</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sitter.services.map(service => (
                  <div key={service} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <span className="font-medium">{getServiceLabel(service)}</span>
                    <span className="text-green-600 font-bold">{sitter.pricing[service]} лв.</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pet Types */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Грижи се за</h2>
              <div className="flex flex-wrap gap-3">
                {sitter.petTypes.map(petType => (
                  <span
                    key={petType}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                  >
                    {getPetTypeLabel(petType)}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Езици</h2>
              <div className="flex flex-wrap gap-3">
                {sitter.languages.map(language => (
                  <span
                    key={language}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Отзиви</h2>
              <ReviewsList sitterId={sitter.id} showRatingSummary={true} />
            </div>

            {/* Contact */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Свържете се</h2>
              <div className="flex gap-4">
                <Button className="flex-1">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Изпрати съобщение
                </Button>
                <Button variant="outline">
                  <Phone className="h-5 w-5 mr-2" />
                  Обади се
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitterProfile;