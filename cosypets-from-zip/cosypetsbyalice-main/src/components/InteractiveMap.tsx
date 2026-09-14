import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, Star, Phone } from 'lucide-react';
import { SitterWithDetails } from '../types';
import Button from './common/Button';

interface InteractiveMapProps {
  sitters: SitterWithDetails[];
  onSitterSelect: (sitter: SitterWithDetails) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ sitters, onSitterSelect }) => {
  const [selectedSitter, setSelectedSitter] = useState<SitterWithDetails | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 42.6977, lng: 23.3219 }); // Sofia coordinates
  const [zoom, setZoom] = useState(12);

  // Mock coordinates for sitters (in a real app, these would come from the database)
  const sittersWithCoordinates = sitters.map((sitter, index) => ({
    ...sitter,
    coordinates: {
      lat: 42.6977 + (Math.random() - 0.5) * 0.1,
      lng: 23.3219 + (Math.random() - 0.5) * 0.1,
    },
  }));

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceFromUser = (sitter: any) => {
    if (!userLocation || !sitter.coordinates) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      sitter.coordinates.lat,
      sitter.coordinates.lng
    );
  };

  const handleSitterClick = (sitter: SitterWithDetails) => {
    setSelectedSitter(sitter);
  };

  const handleContactSitter = (sitter: SitterWithDetails) => {
    onSitterSelect(sitter);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Гледачи в района</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center text-green-600 hover:text-green-700">
              <Navigation className="h-5 w-5 mr-2" />
              Моето местоположение
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-700">
              <Filter className="h-5 w-5 mr-2" />
              Филтри
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Map Container - In a real app, this would be Google Maps or Mapbox */}
        <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
          {/* Mock map background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-green-300"></div>
          </div>
          
          {/* User location marker */}
          {userLocation && (
            <div 
              className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
            </div>
          )}

          {/* Sitter markers */}
          {sittersWithCoordinates.map((sitter, index) => {
            const distance = getDistanceFromUser(sitter);
            return (
              <div
                key={sitter.sitter_id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 ${
                  selectedSitter?.sitter_id === sitter.sitter_id ? 'scale-110' : 'hover:scale-105'
                } transition-transform duration-200`}
                style={{
                  left: `${30 + (index % 3) * 20}%`,
                  top: `${30 + Math.floor(index / 3) * 15}%`,
                }}
                onClick={() => handleSitterClick(sitter)}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full border-3 shadow-lg overflow-hidden ${
                    selectedSitter?.sitter_id === sitter.sitter_id 
                      ? 'border-green-500 ring-4 ring-green-200' 
                      : 'border-white'
                  }`}>
                    <img
                      src={sitter.photo_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'}
                      alt={sitter.user?.name || 'Pet Sitter'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {sitter.average_rating?.toFixed(1) || '5.0'}
                  </div>
                  {distance && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-md whitespace-nowrap">
                      {distance.toFixed(1)} км
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
              onClick={() => setZoom(zoom + 1)}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
            >
              +
            </button>
            <button 
              onClick={() => setZoom(zoom - 1)}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
            >
              −
            </button>
          </div>
        </div>

        {/* Selected sitter info panel */}
        {selectedSitter && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-30">
            <div className="flex items-center gap-4">
              <img
                src={selectedSitter.photo_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'}
                alt={selectedSitter.user?.name || 'Pet Sitter'}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {selectedSitter.user?.name || 'Pet Sitter'}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedSitter.location || 'София'}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{selectedSitter.average_rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-gray-600 text-sm ml-1">({selectedSitter.total_reviews || 0})</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 mb-2">
                  {selectedSitter.hourly_rate || 15} лв./час
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleContactSitter(selectedSitter)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Свържи се
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Профил
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sitters list */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Близо до вас ({sittersWithCoordinates.length})</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sittersWithCoordinates
            .sort((a, b) => {
              const distanceA = getDistanceFromUser(a) || Infinity;
              const distanceB = getDistanceFromUser(b) || Infinity;
              return distanceA - distanceB;
            })
            .map((sitter) => {
              const distance = getDistanceFromUser(sitter);
              return (
                <div
                  key={sitter.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSitter?.sitter_id === sitter.sitter_id 
                      ? 'bg-green-50 border border-green-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSitterClick(sitter)}
                >
                  <img
                    src={sitter.photo_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'}
                    alt={sitter.user?.name || 'Pet Sitter'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {sitter.user?.name || 'Pet Sitter'}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span>{sitter.average_rating?.toFixed(1) || '5.0'}</span>
                      {distance && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{distance.toFixed(1)} км</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {sitter.hourly_rate || 15} лв.
                    </div>
                    <div className="text-xs text-gray-500">час</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;