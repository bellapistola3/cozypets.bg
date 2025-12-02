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
              Намерете перфектната грижа за вашия любимец —{' '}
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                с AI технология
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
              Интелигентно съвпадение. Емоционални прозрения. Истински грижовни гледачи.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/match')}
                className="cozy-button-primary text-xl px-10 py-5 flex items-center justify-center gap-2 group"
              >
                <span>Стартирай AI Център за Съвпадения</span>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>

              <button
                onClick={scrollToMascots}
                className="cozy-button-secondary text-xl px-10 py-5"
              >
                Запознай се с Cozy & Luna
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Без кредитна карта</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Моментално AI съвпадение</span>
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
                  Вашите AI Спътници 🐾
                </h3>
                <p className="text-gray-600">
                  Cozy & Luna ще ви насочат към перфектния гледач
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">90%</div>
                  <div className="text-xs text-gray-600">AI Точност</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">60s</div>
                  <div className="text-xs text-gray-600">Време за съвпадение</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5000+</div>
                  <div className="text-xs text-gray-600">Гледачи</div>
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
                Защо съществува Cozy Pets
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Домашните любимци са семейство. Създадохме Cozy Pets, за да помогнем на всеки стопанин да се чувства уверен и подкрепен — с интелигентно съвпадение, поведенчески анализ и персонализирани препоръки.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Нашият AI не просто съвпада по локация. Той разбира личността, нуждите и емоционалните изисквания на вашия любимец, за да намери перфектния гледач.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Sparkles, title: 'AI Съвпадение', desc: 'Интелигентно оценяване на съвместимост', color: 'from-yellow-400 to-orange-400' },
                { icon: Brain, title: 'Поведенчески Анализ', desc: 'Задълбочен анализ на нуждите', color: 'from-purple-400 to-pink-400' },
                { icon: Shield, title: 'Проверени Гледачи', desc: '100% проверени и оценени', color: 'from-green-400 to-emerald-400' },
                { icon: Heart, title: 'Лесна Резервация', desc: 'Резервация с 1 клик', color: 'from-blue-400 to-cyan-400' }
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
              Премиум AI Функции 🌟
            </h2>
            <p className="text-xl text-gray-600">
              Технология, която разбира животните и хората
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Съвпадение %',
                desc: '90%+ точност въз основа на 7 фактора за съвместимост',
                icon: Zap,
                color: 'from-yellow-100 to-orange-100',
                points: ['Локация', 'Опит', 'Експертност']
              },
              {
                title: 'Alice Прозрения',
                desc: 'Задълбочени обяснения за всеки гледач',
                icon: Brain,
                color: 'from-blue-100 to-cyan-100',
                points: ['AI обосновка', 'Оценка на риск', 'Съвместимост']
              },
              {
                title: 'Интелигенция за Нуждите',
                desc: 'Поведенческо и емоционално профилиране',
                icon: Heart,
                color: 'from-pink-100 to-rose-100',
                points: ['Личностно съвпадение', 'Грижи', 'Среда']
              },
              {
                title: 'Авто-Резервация',
                desc: 'AI избира най-добрия гледач и опростява резервацията',
                icon: Sparkles,
                color: 'from-purple-100 to-pink-100',
                points: ['Оценка на увереност', 'Резервация с 1 клик', 'Интелигентни препоръки']
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
            Интелигенция за Нуждите на Любимците
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Получете задълбочен поведенчески и емоционален профил на вашия любимец. Luna анализира личността, нуждите и намира перфектната среда.
          </p>
          <button
            onClick={() => navigate('/pet-needs')}
            className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105"
          >
            Създай Профил на Любимец ✨
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
              Доверие и Безопасност на Първо Място
            </h2>
            <p className="text-xl text-gray-600">
              Благополучието на вашия любимец е наш първи приоритет
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Проверени Гледачи',
                desc: 'Всеки гледач преминава проверки, верификация на самоличност и оценка на уменията.'
              },
              {
                icon: Lock,
                title: 'Безопасни Плащания',
                desc: 'Сигурно процесиране с escrow защита до завършване на услугата.'
              },
              {
                icon: Brain,
                title: 'AI Базиран на Поведение',
                desc: 'Нашият AI отчита темперамента, стресовите фактори и емоционалните нужди за перфектни съвпадения.'
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
            Готови ли сте да намерите перфектното съвпадение? 🐾
          </h2>

          <p className="text-xl text-gray-700 mb-10">
            Присъединете се към хиляди щастливи стопани на домашни любимци
          </p>

          <button
            onClick={() => navigate('/match')}
            className="cozy-button-primary text-2xl px-12 py-6 shadow-2xl"
          >
            Започнете Сега ✨
          </button>

          <p className="text-sm text-gray-600 mt-6">
            Без регистрация • AI съвпадение за 60 секунди
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
