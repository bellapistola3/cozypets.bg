import React, { useEffect, useState } from 'react';
import CozyMascot from '../mascots/CozyMascot';
import LunaMascot from '../mascots/LunaMascot';
import { Check, Calendar, Clock, Share2, MessageCircle, Home } from 'lucide-react';

interface BookingSuccessProps {
  sitterName: string;
  sitterImage: string;
  bookingDate: string;
  bookingTime: string;
  totalPrice: number;
  onClose: () => void;
  onShare?: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  sitterName,
  sitterImage,
  bookingDate,
  bookingTime,
  totalPrice,
  onClose,
  onShare
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 z-50 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${20 + Math.random() * 20}px`
              }}
            >
              {['🎉', '❤️', '🐾', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-scaleIn relative">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-6">
            <CozyMascot variant="success" size="large" />
            <LunaMascot variant="idle" size="large" />
          </div>

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Резервацията е потвърдена! 🎉
          </h1>

          <p className="text-xl text-gray-700">
            Вашето животинче е в страхотни ръце! ❤️
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={sitterImage}
              alt={sitterName}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{sitterName}</h3>
              <p className="text-sm text-gray-600">Ще се погрижи за вашия любимец</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Дата</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {new Date(bookingDate).toLocaleDateString('bg-BG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Начален час</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{bookingTime}</div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Обща сума:</span>
              <span className="text-2xl font-bold text-pink-600">{totalPrice} лв</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Следващи стъпки
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Ще получите потвърждение по имейл с всички детайли</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Можете да чатите с {sitterName} директно в платформата</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Подгответе любимеца си за срещата</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span>Сподели във TikTok</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 cozy-button-primary"
          >
            <Home className="w-5 h-5" />
            <span>Към началната страница</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Благодарим ви, че избрахте Cozy Pets by Alice! 🐾
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
