import React, { useState } from 'react';
import CozyMascot from '../mascots/CozyMascot';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PetData {
  type: string;
  age: number;
  personality: string;
}

interface PetOnboardingProps {
  onComplete: (petData: PetData) => void;
  onSkip?: () => void;
}

const PetOnboarding: React.FC<PetOnboardingProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [petData, setPetData] = useState<PetData>({
    type: '',
    age: 3,
    personality: ''
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(petData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) return petData.type !== '';
    if (step === 2) return petData.age > 0;
    if (step === 3) return petData.personality !== '';
    return false;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-scaleIn">
        <div className="flex justify-center mb-6">
          <CozyMascot variant={step === 3 ? 'celebrate' : 'idle'} size="medium" />
        </div>

        <div className="mb-8">
          <div className="flex gap-2 justify-center mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-12 bg-pink-500' : s < step ? 'w-8 bg-pink-300' : 'w-8 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">Стъпка {step} от 3</p>
        </div>

        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
              Какво животно имате? 🐾
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Това ми помага да намеря най-добрите гледачи за вас
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { value: 'dog', label: 'Куче', emoji: '🐕' },
                { value: 'cat', label: 'Котка', emoji: '🐈' },
                { value: 'rabbit', label: 'Заек', emoji: '🐰' },
                { value: 'bird', label: 'Птица', emoji: '🐦' },
                { value: 'reptile', label: 'Влечуго', emoji: '🦎' },
                { value: 'other', label: 'Друго', emoji: '🐾' }
              ].map((pet) => (
                <button
                  key={pet.value}
                  onClick={() => setPetData({ ...petData, type: pet.value })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                    petData.type === pet.value
                      ? 'border-pink-500 bg-pink-50 scale-105 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{pet.emoji}</div>
                  <div className="font-semibold text-gray-900">{pet.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
              На колко години е вашият любимец? 🎂
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Възрастта помага да намеря гледачи с подходящ опит
            </p>

            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-pink-600 mb-2">
                  {petData.age}
                </div>
                <div className="text-gray-600">
                  {petData.age === 1 ? 'година' : 'години'}
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                value={petData.age}
                onChange={(e) => setPetData({ ...petData, age: parseInt(e.target.value) })}
                className="w-full h-3 bg-gradient-to-r from-pink-200 to-pink-400 rounded-lg appearance-none cursor-pointer accent-pink-500"
                style={{
                  background: `linear-gradient(to right, #FF7DAA 0%, #FF7DAA ${(petData.age / 20) * 100}%, #E5E7EB ${(petData.age / 20) * 100}%, #E5E7EB 100%)`
                }}
              />

              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 год.</span>
                <span>20+ год.</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
              Какъв е характерът на вашия любимец? 💕
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Това ми помага да намеря личностно съвместими гледачи
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'calm', label: 'Спокоен', emoji: '😌', desc: 'Любим тиха среда' },
                { value: 'playful', label: 'Игрив', emoji: '🎾', desc: 'Обича активности' },
                { value: 'shy', label: 'Плах', emoji: '🙈', desc: 'Нуждае се от време' },
                { value: 'energetic', label: 'Енергичен', emoji: '⚡', desc: 'Много активен' },
                { value: 'sensitive', label: 'Чувствителен', emoji: '🥺', desc: 'Нежно отношение' },
                { value: 'independent', label: 'Независим', emoji: '😎', desc: 'Самостоятелен' }
              ].map((personality) => (
                <button
                  key={personality.value}
                  onClick={() => setPetData({ ...petData, personality: personality.value })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                    petData.personality === personality.value
                      ? 'border-pink-500 bg-pink-50 scale-105 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{personality.emoji}</div>
                  <div className="font-bold text-gray-900 mb-1">{personality.label}</div>
                  <div className="text-sm text-gray-600">{personality.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Назад</span>
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-lg transition-all ${
              canProceed()
                ? 'cozy-button-primary'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{step === 3 ? 'Намери гледачи!' : 'Напред'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {onSkip && step === 1 && (
          <button
            onClick={onSkip}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Пропусни засега
          </button>
        )}
      </div>
    </div>
  );
};

export default PetOnboarding;
