import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, Star, Heart, Shield } from 'lucide-react';
import { ServiceType, PetType, SearchFilters, Sitter } from '../types';
import Button from './common/Button';
import SitterCard from './SitterCard';

const SitterSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
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
      bio: 'Обожавам животните и имам над 5 години опит в грижата за домашни любимци. Специализирам се в грижата за кучета и котки.',
      experience: 5,
      services: ['daily-walks', 'home-visits', 'overnight'],
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
      photos: [
        'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
        'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      ],
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
      firstName: 'Георги',
      lastName: 'Стоянов',
      email: 'georgi@example.com',
      phone: '+359888234567',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      createdAt: new Date(),
      isVerified: true,
      bio: 'Ветеринарен асистент с опит в грижата за домашни любимци с медицински нужди. Специализирам се в грижата за възрастни животни.',
      experience: 8,
      services: ['home-visits', 'overnight', 'pet-taxi'],
      location: {
        city: 'Пловдив',
        address: 'Център',
      },
      pricing: {
        'daily-walks': 30,
        'home-visits': 70,
        'overnight': 110,
        'pet-taxi': 40,
        'grooming': 60,
      },
      availability: {},
      photos: [
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      ],
      reviews: [],
      rating: 5.0,
      totalReviews: 32,
      languages: ['Български'],
      petTypes: ['dog', 'cat', 'bird'],
      emergencyContact: {
        name: 'Мария Стоянова',
        phone: '+359888765432',
      },
    },
  ];

  const serviceOptions = [
    { value: 'daily-walks', label: 'Ежедневни разходки' },
    { value: 'home-visits', label: 'Домашно гледане' },
    { value: 'overnight', label: 'Нощна грижа' },
    { value: 'pet-taxi', label: 'Такси за домашни любимци' },
  ];

  const petTypeOptions = [
    { value: 'dog', label: 'Куче' },
    { value: 'cat', label: 'Котка' },
    { value: 'bird', label: 'Птица' },
    { value: 'small-mammal', label: 'Дребен бозайник' },
    { value: 'reptile', label: 'Влечуго' },
    { value: 'other', label: 'Друг' },
  ];

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSitters(mockSitters);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Намерете перфектния гледач за вашия домашен любимец
          </h1>
          <p className="text-lg text-gray-600">
            Над 500 проверени гледачи в цяла България
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Услуга
              </label>
              <select
                value={filters.serviceType || ''}
                onChange={(e) => handleFilterChange('serviceType', e.target.value as ServiceType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Всички услуги</option>
                {serviceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Град
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Въведете град"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Начална дата
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFilterChange('startDate', new Date(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-5 w-5 mr-2" />
                Търсене
              </Button>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              <Filter className="h-5 w-5 mr-2" />
              Допълнителни филтри
            </button>
            <div className="text-sm text-gray-600">
              Намерени {sitters.length} гледачи
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вид домашен любимец
                  </label>
                  <select
                    value={filters.petType || ''}
                    onChange={(e) => handleFilterChange('petType', e.target.value as PetType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Всички видове</option>
                    {petTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Минимален рейтинг
                  </label>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Всички рейтинги</option>
                    <option value="4">4+ звезди</option>
                    <option value="4.5">4.5+ звезди</option>
                    <option value="4.8">4.8+ звезди</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимална цена (лв.)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.priceRange?.max || ''}
                    onChange={(e) => handleFilterChange('priceRange', { 
                      ...filters.priceRange, 
                      max: Number(e.target.value) 
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Проверени гледачи</h3>
            <p className="text-gray-600 text-sm">Всички гледачи преминават проверка на самоличност и препоръки</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Застраховка включена</h3>
            <p className="text-gray-600 text-sm">Покритие на ветеринарни разходи до 5000 лв.</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Гарантирано качество</h3>
            <p className="text-gray-600 text-sm">Средна оценка 4.8/5 от над 10,000 резервации</p>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Търсим най-добрите гледачи за вас...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sitters.map(sitter => (
              <SitterCard key={sitter.id} sitter={sitter} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SitterSearch;