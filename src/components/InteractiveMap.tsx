import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SitterWithDetails } from '../types';

// Fix for default marker icon in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface InteractiveMapProps {
  sitters: SitterWithDetails[];
  onSitterSelect: (sitter: SitterWithDetails) => void;
}

// Component to handle map center updates
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ sitters, onSitterSelect }) => {
  const [selectedSitter, setSelectedSitter] = useState<SitterWithDetails | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([42.6977, 23.3219]); // Sofia coordinates
  const [zoom] = useState(13);

  // Mock coordinates for sitters if they don't have them
  const sittersWithCoordinates = sitters.map((sitter, index) => ({
    ...sitter,
    coordinates: sitter.coordinates || {
      lat: 42.6977 + (Math.random() - 0.5) * 0.05,
      lng: 23.3219 + (Math.random() - 0.5) * 0.05,
    },
  }));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSitterClick = (sitter: SitterWithDetails) => {
    setSelectedSitter(sitter);
  };

  const handleContactSitter = (sitter: SitterWithDetails) => {
    onSitterSelect(sitter);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Гледачи в района</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => userLocation && setMapCenter(userLocation)}
              className="flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              <Navigation className="h-4 w-4 mr-1.5" />
              Моето местоположение
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="h-[450px] w-full z-0">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={mapCenter} zoom={zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Вие сте тук</Popup>
              </Marker>
            )}

            {sittersWithCoordinates.map((sitter) => (
              <Marker
                key={sitter.id}
                position={[sitter.coordinates.lat, sitter.coordinates.lng]}
                eventHandlers={{
                  click: () => handleSitterClick(sitter),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={sitter.photo_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'}
                        alt={sitter.user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-bold text-gray-900 leading-tight">{sitter.user?.name?.split(' ')[0]}</div>
                        <div className="flex items-center text-xs text-yellow-500">
                          <Star className="h-3 w-3 fill-current mr-0.5" />
                          <span>{sitter.average_rating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600 mb-2">
                      {sitter.hourly_rate} лв./час
                    </div>
                    <button
                      onClick={() => handleContactSitter(sitter)}
                      className="w-full bg-green-600 text-white text-xs font-semibold py-1.5 rounded hover:bg-green-700 transition-colors"
                    >
                      Преглед
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Sitter Floating Panel */}
        {selectedSitter && (
          <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl shadow-2xl p-4 z-[1000] border border-green-100 flex items-center gap-4 animate-slideUp">
            <img
              src={selectedSitter.photo_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'}
              alt={selectedSitter.user?.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-green-50"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 leading-tight">
                {selectedSitter.user?.name}
              </h3>
              <div className="flex items-center text-gray-500 text-xs mt-0.5">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{selectedSitter.location}</span>
              </div>
              <div className="flex items-center mt-1">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-semibold">{selectedSitter.average_rating?.toFixed(1) || '5.0'}</span>
                <span className="text-gray-400 text-xs ml-1">({selectedSitter.total_reviews || 0})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-extrabold text-green-600">
                {selectedSitter.hourly_rate} лв.
              </div>
              <button
                onClick={() => handleContactSitter(selectedSitter)}
                className="mt-1 bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-bold"
              >
                Профил
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;