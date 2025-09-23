import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

interface Testimonial {
  id: number;
  name: string;
  petName: string;
  petType: string;
  content: string;
  image: string;
  rating: number;
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
    },
    {
      id: 2,
      name: 'Георги Стоянов',
      petName: 'Луна',
      petType: 'Мейн кун',
      content: 'Бях нервен да оставя котката си сама за служебно пътуване, но нощната грижа от CozyPets беше невероятна. Луна беше спокойна и щастлива, когато се върнах, а гледачът ми изпращаше ежедневни актуализации със снимки.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      rating: 5,
    },
    {
      id: 3,
      name: 'Елена Димитрова',
      petName: 'Бела и Купър',
      petType: 'Бийгъл микс и домашна котка',
      content: 'Намирането на някой, който може да се справи и с нашето куче, и с котката беше предизвикателство, докато не открихме CozyPets. Тяхната услуга за множество домашни любимци е фантастична, и нашите любимци всъщност изглеждат разочаровани, когато се прибираме вкъщи!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rating: 5,
    },
    {
      id: 4,
      name: 'Иван Николов',
      petName: 'Оливър',
      petType: 'Френски булдог',
      content: 'Услугата за домашно гледане е перфектна за нашия тревожен френски булдог. Той остава в познатата си среда, а гледачът следва точно неговата рутина. Струва всеки лев за спокойствието.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-green-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Какво казват нашите клиенти"
          subtitle="Доверени от стотици щастливи собственици на домашни любимци"
          centered
        />
        
        <div className="mt-12 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="relative w-28 h-28 mx-auto md:mx-0 mb-4">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover rounded-full shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-semibold mb-1">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-600 mb-2">
                      Собственик на {testimonials[currentIndex].petName} ({testimonials[currentIndex].petType})
                    </p>
                    <div className="flex items-center justify-center md:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <blockquote className="text-gray-700 text-lg italic leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                } transition-all duration-300`}
                aria-label={`Отиди на отзив ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 bg-white shadow-md rounded-full p-2 text-gray-700 hover:text-green-600 transition-colors duration-300"
            aria-label="Предишен отзив"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 bg-white shadow-md rounded-full p-2 text-gray-700 hover:text-green-600 transition-colors duration-300"
            aria-label="Следващ отзив"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;