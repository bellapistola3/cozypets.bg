import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, Star, Heart, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { SitterSearchFilters, SitterWithDetails } from '../types';
import Button from './common/Button';
import SitterCard from './SitterCard';
import InteractiveMap from './InteractiveMap';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import { PetTypeSelect } from './PetTypeSelect';
import { dbHelpers } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const SitterSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');

  const [filters, setFilters] = useState<SitterSearchFilters>({});
  const [petType, setPetType] = useState('');
  const [sitters, setSitters] = useState<SitterWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { user } = useAuth();


  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        location: filters.location,
        min_rate: filters.min_rate,
        max_rate: filters.max_rate,
        min_rating: filters.min_rating,
        service: serviceId || undefined
      };

      const sittersData = await dbHelpers.getSitters(searchFilters);
      setSitters(sittersData);
    } catch (error) {
      console.error('Error searching sitters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [serviceId]);

  const handleFilterChange = (key: keyof SitterSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSitterSelect = (sitter: SitterWithDetails) => {
    // TODO: Open sitter profile or booking modal
    console.log('Selected sitter:', sitter);
  };

  return (
    <section className="pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-mt-24">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Намерете перфектния гледач за вашия домашен любимец
          </h1>
          <p className="text-lg text-gray-600">
            Над 500 проверени гледачи в цяла България
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Град
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Въведете град"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
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
                  value={filters.start_date ? filters.start_date.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFilterChange('start_date', new Date(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Крайна дата
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={filters.end_date ? filters.end_date.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFilterChange('end_date', new Date(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <PetTypeSelect value={petType} onChange={setPetType} />
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Списък
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Карта
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Минимален рейтинг
                  </label>
                  <select
                    value={filters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', Number(e.target.value))}
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
                    Минимална цена (лв./час)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    value={filters.min_rate || ''}
                    onChange={(e) => handleFilterChange('min_rate', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимална цена (лв./час)
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={filters.max_rate || ''}
                    onChange={(e) => handleFilterChange('max_rate', Number(e.target.value))}
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
            <h3 className="font-semibold text-gray-900 mb-2">Сигурни плащания</h3>
            <p className="text-gray-600 text-sm">Защитени транзакции и гарантирано качество на услугите.</p>
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
        ) : viewMode === 'list' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sitters.map(sitter => (
              <SitterCard key={sitter.id} sitter={sitter} />
            ))}
          </div>
        ) : (
          <InteractiveMap sitters={sitters} onSitterSelect={handleSitterSelect} />
        )}
      </div>

      {/* Personalized Recommendations */}
      {user && <PersonalizedRecommendations userId={user.id} />}
    </section>
  );
};

export default SitterSearch;