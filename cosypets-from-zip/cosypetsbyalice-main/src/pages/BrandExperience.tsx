import React from 'react';
import { useNavigate } from 'react-router-dom';
import CozyMascot from '../components/mascots/CozyMascot';
import LunaMascot from '../components/mascots/LunaMascot';
import { Sparkles, Heart, Shield, Zap, Star, Users } from 'lucide-react';

const BrandExperience: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-purple-200/30 to-blue-200/30 animate-gradient-shift"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <CozyMascot variant="idle" size="large" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-fadeIn">
            Find the Perfect Care for Your Pet
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed animate-slideUp">
            Cozy Pets by Alice is the next-generation pet care experience — smart, emotional, and beautifully designed.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-scaleIn">
            <button
              onClick={() => navigate('/ai-match')}
              className="cozy-button-primary text-lg px-8 py-4"
            >
              Explore AI Match Center ✨
            </button>
            <button
              onClick={() => navigate('/about')}
              className="cozy-button-secondary text-lg px-8 py-4"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/4 text-6xl opacity-10 animate-float-slow">🐾</div>
        <div className="absolute top-20 right-1/4 text-6xl opacity-10 animate-float-particles">🐾</div>
      </section>

      <section className="py-20 px-6 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Cozy Pets Story
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pets are family. We built Cozy Pets to help every owner feel confident and supported —
              with smart matching, behavioral insights, and personalized care recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Built with Love', desc: 'Every feature designed with your pet\'s happiness in mind' },
              { icon: Sparkles, title: 'AI-Powered', desc: 'Advanced matching algorithms for perfect sitter-pet compatibility' },
              { icon: Shield, title: 'Safe & Secure', desc: 'Verified sitters, background checks, and 24/7 support' }
            ].map((item, idx) => (
              <div key={idx} className="cozy-card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Cozy & Luna — Your Smart AI Companions 🐾
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              They guide you, help you choose, celebrate your decisions, and care for your pet's happiness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-10 text-center transform hover:scale-105 transition-transform">
              <CozyMascot variant="celebrate" size="large" />
              <h3 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Cozy</h3>
              <p className="text-lg text-gray-700">
                Your friendly, energetic companion who celebrates every perfect match and guides you with warmth.
              </p>
              <div className="mt-6 flex gap-2 justify-center flex-wrap">
                <span className="cozy-tag">Helpful</span>
                <span className="cozy-tag">Excited</span>
                <span className="cozy-tag">Trustworthy</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-lavender-200 rounded-3xl p-10 text-center transform hover:scale-105 transition-transform">
              <LunaMascot variant="insight" size="large" />
              <h3 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Luna</h3>
              <p className="text-lg text-gray-700">
                Your calm, insightful advisor who provides deep pet-needs analysis and thoughtful recommendations.
              </p>
              <div className="mt-6 flex gap-2 justify-center flex-wrap">
                <span className="cozy-tag">Calm</span>
                <span className="cozy-tag">Smart</span>
                <span className="cozy-tag">Insightful</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Premium Features That Matter 🌟
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'AI Match %', desc: 'Intelligent matching with 90%+ accuracy', color: 'from-yellow-400 to-orange-400' },
              { icon: Sparkles, title: 'Alice Insights', desc: 'Deep behavioral & emotional analysis', color: 'from-blue-400 to-cyan-400' },
              { icon: Heart, title: 'Pet Needs Intelligence', desc: 'Personalized care recommendations', color: 'from-pink-400 to-rose-400' },
              { icon: Star, title: 'Auto-Booking Engine', desc: 'AI selects the perfect sitter for you', color: 'from-purple-400 to-pink-400' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Shield className="w-10 h-10 text-green-600" />
            <h2 className="text-4xl font-bold text-gray-900">Trust & Safety First</h2>
          </div>

          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Every sitter is verified, background-checked, and reviewed. Your pet's safety is our top priority.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Verified Sitters' },
              { icon: Shield, label: 'Background Checks' },
              { icon: Star, label: 'Real Reviews' },
              { icon: Heart, label: '24/7 Support' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <item.icon className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-9xl">🐾</div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-8">
            <CozyMascot variant="celebrate" size="medium" />
            <LunaMascot variant="idle" size="medium" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Let's Find the Perfect Match for Your Pet 🐾
          </h2>

          <p className="text-xl text-gray-700 mb-10">
            Join thousands of happy pet owners who trust Cozy Pets by Alice
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/ai-match')}
              className="cozy-button-primary text-xl px-10 py-5 shadow-2xl"
            >
              Launch Match Center ✨
            </button>
            <button
              onClick={() => navigate('/register')}
              className="cozy-button-secondary text-xl px-10 py-5"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandExperience;
