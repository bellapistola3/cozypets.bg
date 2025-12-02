import React, { useState } from 'react';
import LunaMascot from '../mascots/LunaMascot';
import { Mail, X } from 'lucide-react';

interface ExitIntentModalProps {
  onSave: (email: string) => void;
  onClose: () => void;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onSave, onClose }) => {
  const [email, setEmail] = useState('');

  const handleSave = () => {
    if (email && email.includes('@')) {
      onSave(email);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LunaMascot variant="uncertain" size="large" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Искате ли да запазя тези съвпадения? 🐾
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Намерих няколко страхотни гледача за вашия любимец. Дайте ми имейл, за да ви изпратя списъка и да продължите по-късно.
          </p>

          <div className="mb-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Вашият имейл"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={!email || !email.includes('@')}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                email && email.includes('@')
                  ? 'cozy-button-primary'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Запази съвпаденията ✨
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Продължи без запазване
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Няма да получавате спам. Обещаваме! 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;
