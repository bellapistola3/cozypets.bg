import React from 'react';
import { Clock, CalendarDays, Star, Home, Heart, Shield } from 'lucide-react';
import ServiceCard from './common/ServiceCard';
import SectionHeading from './common/SectionHeading';

const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Ежедневни разходки с кучета',
      description: 'Редовни упражнения и почивки за вашия кучешки спътник, докато сте на работа или отсъстващи.',
      icon: <Clock className="h-6 w-6" />,
      price: 'От 25 лв. на разходка',
      features: ['30-минутни или 1-часови опции', 'Гъвкаво планиране', 'GPS проследени разходки', 'Подробен отчет след всяко посещение'],
      popular: false,
    },
    {
      id: 2,
      title: 'Домашно гледане на домашни любимци',
      description: 'Пълна грижа за вашите домашни любимци в комфорта на собствения им дом, докато сте на ваканция или служебни пътувания.',
      icon: <Home className="h-6 w-6" />,
      price: 'От 60 лв. на ден',
      features: ['Множество ежедневни посещения', 'Хранене и лекарства', 'Прясна вода и поддръжка на тоалетната', 'Проверки за домашна сигурност'],
      popular: true,
    },
    {
      id: 3,
      title: 'Нощна грижа',
      description: 'Нощни престои за осигуряване на компания, сигурност и грижа през вечерните и сутрешните часове.',
      icon: <CalendarDays className="h-6 w-6" />,
      price: 'От 95 лв. на нощ',
      features: ['12-часови нощни престои', 'Вечерни и сутрешни рутини', 'Постоянна компания', 'Редовни актуализации и снимки'],
      popular: false,
    },
    {
      id: 4,
      title: 'Такси услуги за домашни любимци',
      description: 'Безопасен транспорт до ветеринарни прегледи, груминг сесии или където и да трябва да отиде вашият домашен любимец.',
      icon: <Star className="h-6 w-6" />,
      price: 'От 35 лв. на пътуване',
      features: ['Осигурени безопасни преносими клетки', 'Климатизиран автомобил', 'Изчакване по време на прегледи', 'Директна услуга до дестинацията'],
      popular: false,
    },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Нашите услуги за грижа за домашни любимци"
          subtitle="Професионална грижа, адаптирана към нуждите на вашия домашен любимец"
          centered
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/90 shadow-lg hover:shadow-xl border border-green-200">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full mb-6 shadow-md">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Персонализирана грижа</h3>
            <p className="text-gray-600 leading-relaxed">
              Адаптираме нашите услуги към уникалната личност, нужди и рутини на вашия домашен любимец.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/90 shadow-lg hover:shadow-xl border border-green-200">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full mb-6 shadow-md">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Застраховани и гарантирани</h3>
            <p className="text-gray-600 leading-relaxed">
              Нашите услуги са напълно застраховани и гарантирани за вашето пълно спокойствие.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/90 shadow-lg hover:shadow-xl border border-green-200">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full mb-6 shadow-md">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">5-звездна услуга</h3>
            <p className="text-gray-600 leading-relaxed">
              Постоянно оценявани с 5 звезди от нашите клиенти за надеждност и качествена грижа.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;