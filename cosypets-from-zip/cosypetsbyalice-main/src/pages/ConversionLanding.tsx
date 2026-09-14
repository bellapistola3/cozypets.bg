import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CozyMascot from '../components/mascots/CozyMascot';
import PetOnboarding from '../components/funnel/PetOnboarding';
import SocialProof from '../components/funnel/SocialProof';
import { Sparkles, Shield, Heart, Zap, ArrowRight } from 'lucide-react';

const ConversionLanding: React.FC = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartJourney = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (petData: any) => {
    localStorage.setItem('cozyPetData', JSON.stringify(petData));
    navigate('/ai-match');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {showOnboarding && (
        <PetOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={() => navigate('/ai-match')}
        />
      )}

      <section className="relative overflow-hidden py-20 px-6 min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 text-6xl opacity-5 animate-float-slow">🐾</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-float-particles">🐾</div>
          <div className="absolute top-40 right-20 text-4xl opacity-5 animate-idle">🐾</div>
        </div>

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideUp">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-semibold text-gray-700">
                  AI-Управлявана платформа
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Намерете перфектната грижа за вашето животинче —{' '}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  моментално
                </span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Интелигентно AI съвпадение. Любящи гледачи. Щастливи животинчета.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleStartJourney}
                  className="cozy-button-primary text-xl px-8 py-5 flex items-center justify-center gap-2 group"
                >
                  <span>Започнете сега</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/brand')}
                  className="cozy-button-secondary text-xl px-8 py-5"
                >
                  Научете повече
                </button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Безопасни плащания</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span>Проверени гледачи</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span>AI подбор</span>
                </div>
              </div>
            </div>

            <div className="relative animate-scaleIn">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                  <CozyMascot variant="celebrate" size="large" />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Запознайте се с Cozy! 🐶
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Вашият AI асистент, който ще намери най-добрия гледач за вашия любимец за по-малко от 60 секунди.
                  </p>

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-left">
                        <div className="text-3xl font-bold text-pink-600">90%+</div>
                        <div className="text-sm text-gray-600">Точност на AI</div>
                      </div>
                      <div className="text-left">
                        <div className="text-3xl font-bold text-purple-600">60s</div>
                        <div className="text-sm text-gray-600">Време за намиране</div>
                      </div>
                      <div className="text-left">
                        <div className="text-3xl font-bold text-blue-600">100%</div>
                        <div className="text-sm text-gray-600">Проверени</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 top-10 -right-10 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -z-10 bottom-10 -left-10 w-72 h-72 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <SocialProof />

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Как работи? 🐾
            </h2>
            <p className="text-xl text-gray-600">
              Намерете идеалния гледач в 3 прости стъпки
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Разкажете за любимеца си',
                desc: 'Споделете основна информация за вашето животинче за 20 секунди',
                icon: '🐕',
                color: 'from-pink-400 to-rose-400'
              },
              {
                step: '2',
                title: 'AI анализира съвпаденията',
                desc: 'Alice интелигентно подбира най-подходящите гледачи за вас',
                icon: '🤖',
                color: 'from-purple-400 to-indigo-400'
              },
              {
                step: '3',
                title: 'Резервирайте с 1 клик',
                desc: 'Потвърдете вашия избор и готово! Лесно като никога',
                icon: '✨',
                color: 'from-blue-400 to-cyan-400'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4`}>
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-8">
            <CozyMascot variant="idle" size="large" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Готови ли сте да намерите идеалния гледач? 🎉
          </h2>

          <p className="text-xl text-gray-700 mb-10">
            Присъединете се към хиляди щастливи собственици на животинчета
          </p>

          <button
            onClick={handleStartJourney}
            className="cozy-button-primary text-2xl px-12 py-6 shadow-2xl"
          >
            Започнете безплатно ✨
          </button>

          <p className="text-sm text-gray-600 mt-6">
            Без кредитна карта • Моментален достъп • AI-подбор
          </p>
        </div>
      </section>
    </div>
  );
};

export default ConversionLanding;
