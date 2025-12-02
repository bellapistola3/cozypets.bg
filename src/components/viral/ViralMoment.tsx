import React, { useEffect, useState } from 'react';
import CozyMascot from '../mascots/CozyMascot';
import LunaMascot from '../mascots/LunaMascot';

interface ViralMomentProps {
  type: 'success' | 'thinking' | 'uncertain' | 'celebrate' | 'magic-swipe';
  message?: string;
  onComplete?: () => void;
}

const ViralMoment: React.FC<ViralMomentProps> = ({ type, message, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type === 'celebrate' || type === 'success') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-scaleIn">
        {(type === 'success' || type === 'celebrate') && (
          <div className="flex flex-col items-center gap-4">
            <CozyMascot variant="celebrate" size="large" />
            {message && (
              <div className="bg-white rounded-2xl shadow-2xl px-6 py-4 animate-slideUp">
                <p className="text-lg font-bold text-gray-900 text-center">{message}</p>
              </div>
            )}
            <div className="flex gap-2 animate-float-particles">
              <span className="text-2xl">🎉</span>
              <span className="text-2xl">❤️</span>
              <span className="text-2xl">🐾</span>
            </div>
          </div>
        )}

        {type === 'thinking' && (
          <div className="flex flex-col items-center gap-3">
            <CozyMascot variant="thinking" size="medium" />
            <div className="bg-white rounded-full shadow-lg px-4 py-2">
              <p className="text-sm text-gray-700">Alice е в процес на анализ...</p>
            </div>
          </div>
        )}

        {type === 'uncertain' && (
          <div className="flex flex-col items-center gap-3">
            <LunaMascot variant="uncertain" size="medium" />
            <div className="bg-white rounded-2xl shadow-lg px-4 py-3 max-w-xs">
              <p className="text-sm text-gray-700 text-center">
                {message || "Hmm... Сравнявам опциите за теб."}
              </p>
            </div>
          </div>
        )}

        {type === 'magic-swipe' && (
          <div className="absolute bottom-20 right-8 animate-slideUpBounce">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-4">
                <CozyMascot variant="celebrate" size="small" />
                <p className="text-sm font-semibold text-gray-900">
                  Намерих най-добрия вариант! ✨
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViralMoment;
