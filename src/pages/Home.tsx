import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CozyMascot from '../components/mascots/CozyMascot';
import LunaMascot from '../components/mascots/LunaMascot';
import { Sparkles, Heart, Shield, Zap, Brain, CheckCircle, Award, Lock } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const mascotSectionRef = useRef<HTMLDivElement>(null);

  const scrollToMascots = () => {
    mascotSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-pink-200 via-mint-200 to-lavender-200">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 text-8xl animate-float-slow">🐾</div>
          <div className="absolute bottom-40 right-20 text-7xl animate-float-particles">🐾</div>
          <div className="absolute top-1/2 left-1/3 text-6xl animate-idle">🐾</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideUp">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find the Perfect Care for Your Pet —{' '}
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
              Smart matching. Emotional insights. Real sitters who truly care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/match')}
                className="cozy-button-primary text-xl px-10 py-5 flex items-center justify-center gap-2 group"
              >
                <span>Launch AI Match Center</span>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>

              <button
                onClick={scrollToMascots}
                className="cozy-button-secondary text-xl px-10 py-5"
              >
                Meet Cozy & Luna
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Instant AI matching</span>
              </div>
            </div>
          </div>

          <div className="relative animate-scaleIn">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl opacity-30"></div>

            <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
              <div className="flex justify-center gap-8 mb-6">
                <CozyMascot variant="celebrate" size="large" />
                <LunaMascot variant="insight" size="large" />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your AI Companions 🐾
                </h3>
                <p className="text-gray-600">
                  Cozy & Luna will guide you to the perfect sitter match
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">90%</div>
                  <div className="text-xs text-gray-600">AI Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">60s</div>
                  <div className="text-xs text-gray-600">Match Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5000+</div>
                  <div className="text-xs text-gray-600">Sitters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Cozy Pets Exists
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Pets are family. We built Cozy Pets to help every owner feel confident and supported — with smart matching, behavioral insights, and personalized care recommendations.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our AI doesn't just match by location. It understands your pet's personality, needs, and emotional requirements to find the perfect caregiver.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Sparkles, title: 'AI Matching', desc: 'Intelligent compatibility scoring', color: 'from-yellow-400 to-orange-400' },
                { icon: Brain, title: 'Behavioral Insights', desc: 'Deep pet needs analysis', color: 'from-purple-400 to-pink-400' },
                { icon: Shield, title: 'Trusted Sitters', desc: '100% verified & reviewed', color: 'from-green-400 to-emerald-400' },
                { icon: Heart, title: 'Stress-free Booking', desc: 'One-click reservations', color: 'from-blue-400 to-cyan-400' }
              ].map((item, idx) => (
                <div key={idx} className="cozy-card hover:scale-105 transition-transform">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Premium AI Features 🌟
            </h2>
            <p className="text-xl text-gray-600">
              Technology that understands pets and people
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Match %',
                desc: '90%+ accuracy matching based on 7 compatibility factors',
                icon: Zap,
                color: 'from-yellow-100 to-orange-100',
                points: ['Location fit', 'Experience match', 'Pet type expertise']
              },
              {
                title: 'Alice Insights',
                desc: 'Deep reasoning about why each sitter is recommended',
                icon: Brain,
                color: 'from-blue-100 to-cyan-100',
                points: ['AI reasoning', 'Risk assessment', 'Compatibility score']
              },
              {
                title: 'Pet Needs Intelligence',
                desc: 'Behavioral & emotional profiling for your pet',
                icon: Heart,
                color: 'from-pink-100 to-rose-100',
                points: ['Personality match', 'Care requirements', 'Environment fit']
              },
              {
                title: 'Auto-Booking',
                desc: 'AI selects the best sitter and simplifies booking',
                icon: Sparkles,
                color: 'from-purple-100 to-pink-100',
                points: ['Confidence scoring', 'One-click booking', 'Smart recommendations']
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-xl`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-700 mb-4">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <LunaMascot variant="insight" size="medium" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pet Needs Intelligence
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get a deep behavioral & emotional profile for your pet. Luna analyzes personality, care needs, and finds the perfect environment match.
          </p>
          <button
            onClick={() => navigate('/pet-needs')}
            className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105"
          >
            Generate My Pet Profile ✨
          </button>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trust & Safety First
            </h2>
            <p className="text-xl text-gray-600">
              Your pet's well-being is our top priority
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Verified Sitters',
                desc: 'Every sitter goes through background checks, identity verification, and skill assessment.'
              },
              {
                icon: Lock,
                title: 'Safe Payments',
                desc: 'Secure payment processing with escrow protection until service is complete.'
              },
              {
                icon: Brain,
                title: 'Behavior-Based AI',
                desc: 'Our AI considers pet temperament, stress triggers, and emotional needs for perfect matches.'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -right-4">
                <CozyMascot variant="idle" size="small" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={mascotSectionRef} className="py-24 px-6 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-9xl">🐾</div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-8">
            <CozyMascot variant="celebrate" size="large" />
            <LunaMascot variant="idle" size="large" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ready to find the perfect match for your pet? 🐾
          </h2>

          <p className="text-xl text-gray-700 mb-10">
            Join thousands of happy pet owners who trust Cozy & Luna
          </p>

          <button
            onClick={() => navigate('/match')}
            className="cozy-button-primary text-2xl px-12 py-6 shadow-2xl"
          >
            Start Matching Now ✨
          </button>

          <p className="text-sm text-gray-600 mt-6">
            No signup required to explore • AI matching in 60 seconds
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
