import React from 'react';

interface CozyMascotProps {
  variant?: 'idle' | 'thinking' | 'celebrate' | 'warning' | 'success';
  size?: 'small' | 'medium' | 'large';
}

const CozyMascot: React.FC<CozyMascotProps> = ({ variant = 'idle', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const getAnimation = () => {
    switch (variant) {
      case 'thinking':
        return 'animate-thinking';
      case 'celebrate':
        return 'animate-celebrate';
      case 'warning':
        return 'animate-warning';
      case 'success':
        return 'animate-success';
      default:
        return 'animate-idle';
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${getAnimation()}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <radialGradient id="cozyGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FF7DAA" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF9FBF" stopOpacity="1" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx="50" cy="55" r="28" fill="url(#cozyGradient)" filter="url(#softGlow)" />

        <ellipse cx="38" cy="52" rx="4" ry="6" fill="#FFFFFF" />
        <ellipse cx="62" cy="52" rx="4" ry="6" fill="#FFFFFF" />

        <circle cx="38" cy="52" r="2.5" fill="#374151" className="animate-blink" />
        <circle cx="62" cy="52" r="2.5" fill="#374151" className="animate-blink" />

        <ellipse cx="35" cy="50" rx="1.5" ry="2" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="59" cy="50" rx="1.5" ry="2" fill="#FFFFFF" opacity="0.8" />

        <path d="M 45 62 Q 50 65 55 62" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />

        <circle cx="50" cy="58" r="2" fill="#FF5A8A" />

        <ellipse cx="30" cy="42" rx="8" ry="12" fill="url(#cozyGradient)" opacity="0.9" className="animate-ear-wiggle" />
        <ellipse cx="70" cy="42" rx="8" ry="12" fill="url(#cozyGradient)" opacity="0.9" className="animate-ear-wiggle-delay" />

        {variant === 'celebrate' && (
          <>
            <text x="20" y="25" fontSize="12" fill="#FFD700" className="animate-sparkle">✨</text>
            <text x="75" y="25" fontSize="12" fill="#FFD700" className="animate-sparkle-delay">✨</text>
          </>
        )}

        {variant === 'thinking' && (
          <text x="65" y="35" fontSize="10" fill="#8EC9FF" className="animate-float">?</text>
        )}
      </svg>

      {variant === 'celebrate' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-float-heart">
            ❤️
          </div>
        </div>
      )}
    </div>
  );
};

export default CozyMascot;
