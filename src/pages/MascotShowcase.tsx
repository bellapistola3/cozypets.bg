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
            Запознайте се с Cozy & Luna 🐾
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Вашите AI спътници, които ви водят през грижата за домашните любимци с топлина, интелигентност и личност.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 text-center">
            <CozyMascot variant="celebrate" size="large" />
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Cozy 🐶</h2>
            <p className="text-lg text-gray-700 mb-6">
              Приятелският, енергичен водач, който празнува съвпаденията ви и ви поддържа мотивирани
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="cozy-tag">Полезен</span>
              <span className="cozy-tag">Ентусиазиран</span>
              <span className="cozy-tag">Надежден</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-lavender-100 rounded-3xl p-8 text-center">
            <LunaMascot variant="insight" size="large" />
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Luna 🐱</h2>
            <p className="text-lg text-gray-700 mb-6">
              Спокойният, интелигентен анализатор, който предоставя задълбочени прозрения и премислени препоръки
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="cozy-tag">Спокоен</span>
              <span className="cozy-tag">Умен</span>
              <span className="cozy-tag">Проницателен</span>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Емоционални Състояния ✨
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { variant: 'idle' as const, label: 'Спокоен', desc: 'Нежно дишане' },
              { variant: 'thinking' as const, label: 'Мисли', desc: 'AI обработка' },
              { variant: 'celebrate' as const, label: 'Празнува', desc: 'Перфектно!' },
              { variant: 'warning' as const, label: 'Предупреждение', desc: 'Ниска съвместимост' }
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
            Вирусни UX Моменти 🎬
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Cozy Щастлив Скок',
                desc: 'Когато AI намери перфектно съвпадение (90%+), Cozy скача от радост и сърца летят наоколо',
                trigger: 'Намерено перфектно съвпадение',
                icon: Heart
              },
              {
                title: 'Luna Наклон на Глава',
                desc: 'Когато AI увереността е под 60%, Luna наклонява глава с любопитство',
                trigger: 'Ниска увереност',
                icon: Sparkles
              },
              {
                title: 'Анимация с Лапа',
                desc: 'Меко наслоение с лапа, което изчезва и разкрива Центъра',
                trigger: 'Зареждане на страница',
                icon: Sparkles
              },
              {
                title: 'Магическо Плъзгане',
                desc: 'Панелът за авто-резервация излиза нагоре с блясъци',
                trigger: 'Авто-резервация',
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
                  Активира: {moment.trigger}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Бранд Идентичност</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Cozy & Luna са повече от маскоти — те са емоционалният център на платформата. Те изграждат доверие, създават запомнящи се моменти и правят грижата за домашните любимци лична и магическа.
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
