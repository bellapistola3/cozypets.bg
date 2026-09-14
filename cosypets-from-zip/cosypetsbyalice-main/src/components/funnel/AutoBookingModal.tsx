import React, { useState, useEffect } from 'react';
import CozyMascot from '../mascots/CozyMascot';
import { X, Calendar, Clock, CreditCard, Shield, Star, MapPin } from 'lucide-react';

interface Sitter {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  pricePerHour: number;
  distanceKm: number;
  city: string;
}

interface AutoBookingModalProps {
  sitter: Sitter;
  confidenceScore: number;
  aiReason: string;
  onClose: () => void;
  onConfirm: (bookingData: BookingData) => void;
}

interface BookingData {
  sitterId: string;
  startDate: string;
  startTime: string;
  duration: number;
}

const AutoBookingModal: React.FC<AutoBookingModalProps> = ({
  sitter,
  confidenceScore,
  aiReason,
  onClose,
  onConfirm
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    sitterId: sitter.id,
    startDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 2
  });

  useEffect(() => {
    let start = 0;
    const end = confidenceScore;
    const duration = 900;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [confidenceScore]);

  const estimatedPrice = bookingData.duration * sitter.pricePerHour;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUpBounce">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <CozyMascot variant="celebrate" size="small" />
            <h2 className="text-2xl font-bold text-gray-900">
              Alice препоръчва този гледач! ✨
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center">
            <div className="text-7xl font-bold text-emerald-600 mb-2">
              {animatedScore}%
            </div>
            <div className="text-lg font-semibold text-emerald-900 mb-3">
              AI Confidence Score
            </div>
            <p className="text-emerald-800 leading-relaxed">
              {aiReason}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={sitter.profileImage}
                alt={sitter.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{sitter.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{sitter.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{sitter.distanceKm} км</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-xl p-3 text-center">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Verified</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Top Rated</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <CreditCard className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Secure</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Детайли за резервацията</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Дата
                </label>
                <input
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="cozy-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Начален час
                </label>
                <select
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  className="cozy-input w-full"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Продължителност
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 8].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setBookingData({ ...bookingData, duration: hours })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        bookingData.duration === hours
                          ? 'border-pink-500 bg-pink-50 font-bold'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {hours}ч
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Цена на час:</span>
              <span className="font-semibold">{sitter.pricePerHour} лв</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Продължителност:</span>
              <span className="font-semibold">{bookingData.duration}ч</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Обща сума:</span>
                <span className="text-3xl font-bold text-pink-600">{estimatedPrice} лв</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cozy-button-secondary flex-1"
            >
              Разгледай профила
            </button>
            <button
              onClick={() => onConfirm(bookingData)}
              className="cozy-button-primary flex-1 text-lg"
            >
              Потвърди резервация 🎉
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Ще получите потвърждение по имейл след резервацията
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoBookingModal;
