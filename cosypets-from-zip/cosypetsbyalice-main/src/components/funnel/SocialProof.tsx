import React from 'react';
import { Users, Star, Shield, Heart } from 'lucide-react';

const SocialProof: React.FC = () => {
  return (
    <div className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-pink-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">32,000+</div>
            <div className="text-sm text-gray-600">Щастливи собственици</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4.9/5</div>
            <div className="text-sm text-gray-600">Среден рейтинг</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-600">Проверени гледачи</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
            <div className="text-sm text-gray-600">Удовлетвореност</div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Безопасни плащания</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Препоръчано от ветеринари</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-medium text-gray-700">24/7 Поддръжка</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
