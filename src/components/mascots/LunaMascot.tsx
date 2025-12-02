import React from 'react';

interface LunaMascotProps {
  variant?: 'idle' | 'insight' | 'uncertain';
  size?: 'small' | 'medium' | 'large';
}

const LunaMascot: React.FC<LunaMascotProps> = ({ variant = 'idle', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const getAnimation = () => {
    switch (variant) {
      case 'uncertain':
        return 'animate-head-tilt';
      case 'insight':
        return 'animate-pulse-gentle';
      default:
        return 'animate-breathe';
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${getAnimation()}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <radialGradient id="lunaGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#C8A8FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4BAFF" stopOpacity="1" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="50" cy="56" rx="26" ry="24" fill="url(#lunaGradient)" filter="url(#softGlow)" />

        <ellipse cx="40" cy="53" rx="5" ry="8" fill="#FFFFFF" />
        <ellipse cx="60" cy="53" rx="5" ry="8" fill="#FFFFFF" />

        <ellipse cx="40" cy="54" rx="2" ry="6" fill="#374151" className="animate-blink" />
        <ellipse cx="60" cy="54" rx="2" ry="6" fill="#374151" className="animate-blink" />

        <ellipse cx="37" cy="52" rx="1" ry="2" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="57" cy="52" rx="1" ry="2" fill="#FFFFFF" opacity="0.8" />

        <path d="M 45 64 L 50 62 L 55 64" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 50 62 L 50 66" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />

        <circle cx="50" cy="60" r="1.5" fill="#B88FFF" />

        <path d="M 28 38 Q 25 42 28 48 Q 30 45 32 42 Z" fill="url(#lunaGradient)" className="animate-ear-twitch" />
        <path d="M 72 38 Q 75 42 72 48 Q 70 45 68 42 Z" fill="url(#lunaGradient)" className="animate-ear-twitch-delay" />

        {variant === 'insight' && (
          <text x="65" y="35" fontSize="14" fill="#A8F0D2" className="animate-glow">💡</text>
        )}
      </svg>

      {variant === 'uncertain' && (
        <div className="absolute -top-4 -right-2 text-xs animate-float-slow">
          🤔
        </div>
      )}
    </div>
  );
};

export default LunaMascot;
