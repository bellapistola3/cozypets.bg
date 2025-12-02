import React from 'react';
import CozyMascot from '../components/mascots/CozyMascot';
import LunaMascot from '../components/mascots/LunaMascot';
import { Heart, Sparkles } from 'lucide-react';

const MascotShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Meet Cozy & Luna 🐾
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI companions who guide you through the pet care journey with warmth, intelligence, and personality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 text-center">
            <CozyMascot variant="celebrate" size="large" />
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Cozy 🐶</h2>
            <p className="text-lg text-gray-700 mb-6">
              The friendly, energetic guide who celebrates your matches and keeps you motivated
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="cozy-tag">Helpful</span>
              <span className="cozy-tag">Excited</span>
              <span className="cozy-tag">Trustworthy</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-lavender-100 rounded-3xl p-8 text-center">
            <LunaMascot variant="insight" size="large" />
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Luna 🐱</h2>
            <p className="text-lg text-gray-700 mb-6">
              The calm, intelligent analyst who provides deep insights and thoughtful recommendations
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="cozy-tag">Calm</span>
              <span className="cozy-tag">Smart</span>
              <span className="cozy-tag">Insightful</span>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Emotion States ✨
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { variant: 'idle' as const, label: 'Idle', desc: 'Gentle breathing' },
              { variant: 'thinking' as const, label: 'Thinking', desc: 'AI processing' },
              { variant: 'celebrate' as const, label: 'Celebrate', desc: 'Perfect match!' },
              { variant: 'warning' as const, label: 'Warning', desc: 'Low compatibility' }
            ].map((state, idx) => (
              <div key={idx} className="cozy-card text-center">
                <CozyMascot variant={state.variant} size="medium" />
                <h3 className="font-bold text-gray-900 mt-4 mb-1">{state.label}</h3>
                <p className="text-sm text-gray-600">{state.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Viral UX Moments 🎬
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Cozy Happy Jump',
                desc: 'When AI finds a perfect match (90%+), Cozy jumps with joy and hearts float around',
                trigger: 'Perfect match found',
                icon: Heart
              },
              {
                title: 'Luna Head Tilt',
                desc: 'When AI confidence is below 60%, Luna tilts her head with curiosity',
                trigger: 'Low confidence',
                icon: Sparkles
              },
              {
                title: 'Paw Reveal Animation',
                desc: 'Soft paw overlay that fades to reveal the Match Center',
                trigger: 'Page load',
                icon: Sparkles
              },
              {
                title: 'Magic Swipe',
                desc: 'AutoBookEngine panel slides up with sparkles when best sitter is selected',
                trigger: 'Auto-booking',
                icon: Sparkles
              }
            ].map((moment, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center mb-4">
                  <moment.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{moment.title}</h3>
                <p className="text-gray-700 mb-3">{moment.desc}</p>
                <div className="text-sm text-purple-600 font-semibold">
                  Triggers: {moment.trigger}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Brand Identity</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Cozy & Luna are more than mascots — they're the emotional center of the platform. They build trust, create memorable moments, and make pet care feel personal and magical.
          </p>
          <div className="flex justify-center gap-6">
            <CozyMascot variant="idle" size="medium" />
            <LunaMascot variant="idle" size="medium" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MascotShowcase;
