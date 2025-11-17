import React, { useState } from 'react';
import { Star, Quote, Heart, CheckCircle, TrendingUp, X, Send } from 'lucide-react';
import SectionHeading from './common/SectionHeading';
import { supabase } from '../lib/supabaseClient';

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
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    petName: '',
    petType: '',
    location: '',
    content: '',
  });

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Мария Петкова',
      petName: 'Макс',
      petType: 'Голдън ретрийвър',
      content: 'CozyPets by Alice беше спасение за нас! Нашето куче Макс винаги се радва да види своя разходчик и получаваме подробни актуализации след всяко посещение.',
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
      content: 'Бях нервен да оставя котката си сама за служебно пътуване, но нощната грижа от CozyPets беше невероятна. Луна беше спокойна и щастлива!',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      rating: 5,
      location: 'Пловдив',
      date: 'Преди 1 месец',
    },
    {
      id: 3,
      name: 'Елена Димитрова',
      petName: 'Бела и Купър',
      petType: 'Бийгъл и котка',
      content: 'Намирането на някой, който може да се справи и с нашето куче, и с котката беше предизвикателство, докато не открихме CozyPets. Фантастична услуга!',
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
      content: 'Услугата за домашно гледане е перфектна за нашия тревожен френски булдог. Той остава в познатата си среда. Струва всеки лев!',
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
      content: 'Професионално отношение и истинска любов към животните! Чарли обича всяка минута с екипа на CozyPets. Получаваме снимки след всяка разходка!',
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
      content: 'Търсихме грижа за нашата капризна персийска котка и CozyPets надмина всички очаквания. Мило е видимо по-щастлива и спокойна!',
      image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      rating: 5,
      location: 'Пловдив',
      date: 'Преди 5 дни',
    },
  ];

  const allTestimonials = [...testimonials, ...testimonials];

  const stats = [
    { icon: <Heart className="h-6 w-6" />, value: '500+', label: 'Щастливи клиенти' },
    { icon: <Star className="h-6 w-6" />, value: '4.9/5', label: 'Средна оценка' },
    { icon: <CheckCircle className="h-6 w-6" />, value: '1000+', label: 'Завършени резервации' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '98%', label: 'Препоръчват ни' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          owner_name: formData.name,
          pet_name: formData.petName,
          pet_type: formData.petType,
          location: formData.location,
          content: formData.content,
          rating: rating,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setFormData({ name: '', petName: '', petType: '', location: '', content: '' });
        setRating(0);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Грешка при изпращане на отзива. Моля опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 scroll-mt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2Y1OTcyMCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-6 animate-bounce">
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

        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex animate-scroll hover:pause-animation">
              {allTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-[400px] mx-4"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 h-full border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl transform hover:scale-105">
                    <div className="absolute top-4 right-4 text-green-100">
                      <Quote className="h-16 w-16 opacity-20" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="relative w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-2 rounded-full shadow-lg">
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 font-medium text-sm">
                            {testimonial.petName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {testimonial.petType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      <blockquote className="text-gray-700 leading-relaxed mb-6 min-h-[120px]">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {testimonial.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {testimonial.date}
                        </span>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 mt-4">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-semibold">Верифициран клиент</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-green-50 via-green-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-purple-50 via-purple-50 to-transparent z-10 pointer-events-none"></div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Отзивите се движат автоматично
            </span>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">Искате да споделите вашия опит?</h3>
          <p className="text-lg mb-6 text-green-50 max-w-2xl mx-auto">
            Вашето мнение е важно за нас! Помогнете на други собственици на домашни любимци да вземат правилното решение.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Напишете отзив
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">Напишете отзив</h3>
                <p className="text-green-50">Споделете вашето мнение с нас</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Благодарим ви!</h4>
                <p className="text-gray-600">
                  Вашият отзив беше изпратен успешно и ще бъде прегледан от нашия екип.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Вашето име *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Вашето име"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Име на домашния любимец *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Макс"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Вид на домашния любимец *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.petType}
                      onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Голдън ретрийвър"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Локация *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="София"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Оценка *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Вашият отзив *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                    placeholder="Споделете вашето мнение за нашите услуги..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Изпращане...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Изпрати отзив
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;