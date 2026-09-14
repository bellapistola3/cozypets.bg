import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Star,
  MapPin,
  Phone,
  Clock,
  Heart,
  Award,
  Sparkles,
  Lock,
  CheckCircle,
  ShoppingBag,
  Scissors,
  GraduationCap,
  Building,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/firebase';
import Button from './common/Button';

interface MagazineIssue {
  id: string;
  issue_number: number;
  title: string;
  cover_image_url?: string;
  description: string;
  publication_date: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  reading_time: number;
  is_premium: boolean;
}

interface VeterinaryClinic {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  services: string[];
  emergency_available: boolean;
  rating: number;
}

const PremiumMagazine: React.FC = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isProExpanded, setIsProExpanded] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<MagazineIssue | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [clinics, setClinics] = useState<VeterinaryClinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);

    if (user) {
      const { data: sitterData } = await supabase
        .from('sitters')
        .select('is_premium, featured_until')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (sitterData && sitterData.is_premium && new Date(sitterData.featured_until) > new Date()) {
        setIsPremium(true);
      }
    }

    const { data: issueData } = await supabase
      .from('magazine_issues')
      .select('*')
      .eq('is_published', true)
      .order('publication_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (issueData) {
      setCurrentIssue(issueData);

      const { data: articlesData } = await supabase
        .from('magazine_articles')
        .select('*')
        .eq('issue_id', issueData.id)
        .limit(6);

      setArticles(articlesData || []);
    }

    const { data: clinicsData } = await supabase
      .from('veterinary_clinics')
      .select('*')
      .limit(3);

    setClinics(clinicsData || []);
    setLoading(false);
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      nutrition: 'Хранене',
      diseases: 'Болести',
      breeds: 'Породи',
      training: 'Обучение',
      prevention: 'Профилактика',
      psychology: 'Психология',
      legislation: 'Законодателство',
      grooming: 'Груминг',
      general: 'Общи',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Heart className="h-5 w-5" />;
      case 'training':
        return <GraduationCap className="h-5 w-5" />;
      case 'grooming':
        return <Scissors className="h-5 w-5" />;
      case 'breeds':
        return <Award className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Експертни статии',
      description: 'Съвети от ветеринари и специалисти',
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: 'Директория на услуги',
      description: 'Клиники, салони и магазини',
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: 'Обучителни материали',
      description: 'Дресировка и възпитание',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Актуални теми',
      description: 'Нови тенденции и изследвания',
    },
  ];

  const benefits = [
    'Месечно издание с нови статии',
    'Съвети за хранене и диети',
    'Информация за болести и профилактика',
    'Особености на различни породи',
    'Техники за обучение и дресировка',
    'Директория на ветеринарни клиники',
    'Груминг салони в цялата страна',
    'Препоръчани зоо магазини',
    'Контакти със специалисти',
    'Полезни ресурси и препратки',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2Y1OTcyMCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-orange-600" />
            </div>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">PRO Функция</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Месечно издание за PRO потребители
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Получете достъп до експертни съвети, директория на услуги и полезна информация
              за грижата за вашия домашен любимец
            </p>


          </div>

          {currentIssue && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border-2 border-orange-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold">
                  Издание #{currentIssue.issue_number}
                </div>
                <div className="text-gray-600">
                  {new Date(currentIssue.publication_date).toLocaleDateString('bg-BG', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">{currentIssue.title}</h3>
              <p className="text-lg text-gray-600 mb-8">{currentIssue.description}</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-orange-600">
                        {getCategoryIcon(article.category)}
                        <span className="text-sm font-semibold">
                          {getCategoryLabel(article.category)}
                        </span>
                      </div>
                      {article.is_premium && (
                        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          PRO
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h4>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{article.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.reading_time} мин
                      </span>
                    </div>

                    {article.is_premium && !isPremium && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                          <Lock className="h-4 w-4" />
                          <span>Достъпно само за PRO членове</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPER PRO TOGGLE BUTTON (Collapses 2 large columns into 1 interactive trigger) */}
          <div className="mb-12 text-center">
            <button
              onClick={() => setIsProExpanded(!isProExpanded)}
              className="group mx-auto inline-flex items-center justify-center gap-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xl px-10 py-5 rounded-3xl shadow-2xl hover:shadow-amber-500/40 border-2 border-amber-300/40 transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-7 h-7 text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
              <span>✨ Станете PRO за 9.99€ / месец — Виж офертата & предимствата</span>
              <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${isProExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* COLLAPSIBLE 2-COLUMN PRICING & DIRECTORY SECTION */}
          {isProExpanded && (
            <div className="grid lg:grid-cols-2 gap-12 mb-16 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="rounded-2xl shadow-xl overflow-hidden border-2 border-orange-100">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Building className="h-8 w-8 text-white" />
                    Директория на услуги
                  </h3>

                  <div className="space-y-4 mb-6">
                    {clinics.map((clinic) => (
                      <div
                        key={clinic.id}
                        className="interactive-card neon-glow bg-white rounded-xl p-4 border-2 border-white/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{clinic.name}</h4>
                          <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded">
                            <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                            <span className="text-sm font-bold text-amber-700">{clinic.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{clinic.city} - {clinic.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{clinic.phone}</span>
                          </div>
                          {clinic.emergency_available && (
                            <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                              <Clock className="h-3 w-3" />
                              24/7 Спешна помощ
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {clinic.services.slice(0, 3).map((service, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle className="h-5 w-5 text-white" />
                      <span>Ветеринарни клиники в цяла България</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle className="h-5 w-5 text-white" />
                      <span>Груминг салони и козметични процедури</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle className="h-5 w-5 text-white" />
                      <span>Зоо магазини с доставка</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-orange-500" />
                    <h3 className="text-2xl font-bold text-gray-900">Сигурен избор за вашия любимец</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Всички партньори в директорията преминават проверка за качество и безопасност.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Какво включва PRO абонаментът?
                </h3>

                <div className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-8 w-8" />
                    <div>
                      <div className="text-3xl font-bold">9,99€ / месец</div>
                      <div className="text-amber-100">Пълен достъп до всички материали</div>
                    </div>
                  </div>
                </div>

                {!isPremium && (
                  <Button className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Star className="h-6 w-6 mr-2" />
                    Активирай PRO за 9.99€ сега
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4 text-orange-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12 text-center border-2 border-orange-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Инвестирайте в здравето на любимеца си
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              За само 9,99€ на месец получавате достъп до експертни знания, полезни ресурси
              и цялостна подкрепа за грижата за вашия домашен любимец.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isPremium ? (
                <>
                  <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl">
                    <Star className="h-5 w-5 mr-2" />
                    Станете PRO член
                  </Button>
                  <a
                    href="#services"
                    className="px-8 py-4 text-lg font-semibold text-orange-600 hover:text-orange-700 underline"
                  >
                    Научи повече
                  </a>
                </>
              ) : (
                <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Прочетете най-новото издание
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumMagazine;