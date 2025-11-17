import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Heart, CheckCircle, TrendingUp } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

interface Testimonial {
  id: number;
  name: string;
  petName: string;
  petType: string;
  content: string;
  image: string;
  rating: number;
  location: string;
  date: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Мария Петкова',
      petName: 'Макс',
      petType: 'Голдън ретрийвър',
      content: 'CozyPets by Alice беше спасение за нас! Нашето куче Макс винаги се радва да види своя разходчик и получаваме подробни актуализации след всяко посещение. Силно препоръчвам за заетите собственици на домашни любимци!',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
      rating: 5,
      location: 'София',
      date: 'Преди 2 седмици',
    },
    {
      id: 2,
      name: 'Георги Стоянов',
      petName: 'Луна',
      petType: 'Мейн кун',
      content: 'Бях нервен да оставя котката си сама за служебно пътуване, но нощната грижа от CozyPets беше невероятна. Луна беше спокойна и щастлива, когато се върнах, а гледачът ми изпращаше ежедневни актуализации със снимки.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      rating: 5,
      location: 'Пловдив',
      date: 'Преди 1 месец',
    },
    {
      id: 3,
      name: 'Елена Димитрова',
      petName: 'Бела и Купър',
      petType: 'Бийгъл микс и домашна котка',
      content: 'Намирането на някой, който може да се справи и с нашето куче, и с котката беше предизвикателство, докато не открихме CozyPets. Тяхната услуга за множество домашни любимци е фантастична, и нашите любимци всъщност изглеждат разочаровани, когато се прибираме вкъщи!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rating: 5,
      location: 'Варна',
      date: 'Преди 3 седмици',
    },
    {
      id: 4,
      name: 'Иван Николов',
      petName: 'Оливър',
      petType: 'Френски булдог',
      content: 'Услугата за домашно гледане е перфектна за нашия тревожен френски булдог. Той остава в познатата си среда, а гледачът следва точно неговата рутина. Струва всеки лев за спокойствието.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      rating: 5,
      location: 'Бургас',
      date: 'Преди 1 седмица',
    },
    {
      id: 5,
      name: 'Анна Георгиева',
      petName: 'Чарли',
      petType: 'Лабрадор',
      content: 'Професионално отношение и истинска любов към животните! Чарли обича всяка минута с екипа на CozyPets. Получаваме снимки и видеа след всяка разходка. Благодаря ви за грижата!',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      rating: 5,
      location: 'София',
      date: 'Преди 4 дни',
    },
    {
      id: 6,
      name: 'Петър Иванов',
      petName: 'Мило',
      petType: 'Персийска котка',
      content: 'Търсихме грижа за нашата капризна персийска котка и CozyPets надмина всички очаквания. Мило е видимо по-щастлива и спокойна. Абсолютно препоръчваме!',
      image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      rating: 5,
      location: 'Пловдив',
      date: 'Преди 5 дни',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevTestimonial = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const stats = [
    { icon: <Heart className="h-6 w-6" />, value: '500+', label: 'Щастливи клиенти' },
    { icon: <Star className="h-6 w-6" />, value: '4.9/5', label: 'Средна оценка' },
    { icon: <CheckCircle className="h-6 w-6" />, value: '1000+', label: 'Завършени резервации' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '98%', label: 'Препоръчват ни' },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 scroll-mt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2Y1OTcyMCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-6">
            <Quote className="h-10 w-10 text-orange-600" />
          </div>

          <SectionHeading
            title="Какво казват нашите клиенти"
            subtitle="Доверени от стотици щастливи собственици на домашни любимци"
            centered
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-3 text-green-600">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 relative">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden">
              <div
                key={currentIndex}
                className={`bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-green-100 ${
                  direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft'
                }`}
              >
                <div className="absolute top-6 right-6 text-green-100">
                  <Quote className="h-24 w-24 opacity-20" />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
                  <div className="lg:w-1/3">
                    <div className="relative w-32 h-32 mx-auto lg:mx-0 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="relative w-full h-full object-cover rounded-full shadow-xl border-4 border-white"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-3 rounded-full shadow-lg">
                        <Star className="h-5 w-5 fill-current" />
                      </div>
                    </div>

                    <div className="text-center lg:text-left">
                      <h4 className="text-2xl font-bold mb-2 text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-600 mb-1 font-medium">
                        {testimonials[currentIndex].petName}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {testimonials[currentIndex].petType}
                      </p>

                      <div className="flex items-center justify-center lg:justify-start gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonials[currentIndex].rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {testimonials[currentIndex].location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {testimonials[currentIndex].date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-2/3 lg:pl-8 lg:border-l-2 lg:border-green-100">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="h-8 w-8 text-green-600 flex-shrink-0" />
                      <blockquote className="text-gray-700 text-lg leading-relaxed">
                        {testimonials[currentIndex].content}
                      </blockquote>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mt-6">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Верифициран клиент</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-10 gap-4">
            <button
              onClick={prevTestimonial}
              className="bg-white shadow-lg rounded-full p-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Предишен отзив"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-12 h-3 bg-gradient-to-r from-green-600 to-blue-600'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Отиди на отзив ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="bg-white shadow-lg rounded-full p-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Следващ отзив"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isAutoPlaying ? 'Автоматично плъзгане активно' : 'Автоматично плъзгане на пауза'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">Искате да споделите вашия опит?</h3>
          <p className="text-lg mb-6 text-green-50 max-w-2xl mx-auto">
            Вашето мнение е важно за нас! Помогнете на други собственици на домашни любимци да вземат правилното решение.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Напишете отзив
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;