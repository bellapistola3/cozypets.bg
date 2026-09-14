import React from 'react';
import { MessageCircle, Heart, Shield, Clock, CheckCircle, Stethoscope, Phone, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

const VeterinarySection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartConsultation = () => {
    if (user) {
      navigate('/vet-chat');
    } else {
      const headerBtn = document.querySelector('header button');
      if (headerBtn) {
        (headerBtn as HTMLElement).click();
      } else {
        navigate('/vet-chat');
      }
    }
  };

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Бърза помощ',
      description: 'Свържете се с ветеринар за минути',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '100% Безплатно',
      description: 'Само за PRO абонаменти',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Достъпност',
      description: 'Винаги на разположение за вас',
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: 'Професионални съвети',
      description: 'Експертни препоръки и грижа',
    },
  ];

  const benefits = [
    'Бързи отговори на вашите въпроси',
    'Професионални препоръки за грижа',
    'Помощ при спешни случаи',
    'Съвети за профилактика и здраве',
    'Персонализирана консултация',
    'История на всички консултации',
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Stethoscope className="h-10 w-10 text-green-600" />
            </div>

            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Безплатна консултация с ветеринар
              </h2>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg">
                PRO
              </span>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Грижите се за здравето на любимеца си? Свържете се с професионален ветеринарен лекар
              <span className="font-semibold text-green-600"> напълно безплатно</span> – само за PRO абонаменти!
            </p>

            {!user && (
              <div className="mt-6 inline-flex items-center gap-2 bg-yellow-50 border-2 border-yellow-200 px-6 py-3 rounded-xl">
                <Heart className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-800 font-medium">
                  Регистрирайте се с PRO абонамент, за да получите достъп до ветеринарна консултация
                </p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Как работи?
                    </h3>
                    <p className="text-gray-600">
                      Лесно и удобно от комфорта на вашия дом
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Регистрирайте се</h4>
                      <p className="text-gray-600">Създайте безплатен акаунт за секунди</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Започнете консултация</h4>
                      <p className="text-gray-600">Опишете проблема или въпроса си</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Получете експертен съвет</h4>
                      <p className="text-gray-600">Ветеринар ще се свърже с вас веднага</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Какво включва консултацията?
                </h3>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="h-8 w-8" />
                    <div>
                      <div className="text-2xl font-bold">100% Безплатно</div>
                      <div className="text-green-100">Само за PRO абонаменти</div>
                    </div>
                  </div>
                  <p className="text-green-50 text-sm">
                    Нашата мисия е да осигурим достъп до качествена ветеринарна грижа за всеки любимец.
                    Консултация с ветеринар се предоставя само при спешен случай.
                  </p>
                </div>

                <Button
                  onClick={handleStartConsultation}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {user ? (
                    <>
                      <MessageCircle className="h-6 w-6 mr-2" />
                      Започни консултация сега
                    </>
                  ) : (
                    <>
                      <Heart className="h-6 w-6 mr-2" />
                      Регистрирай се безплатно
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 text-green-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
};

export default VeterinarySection;