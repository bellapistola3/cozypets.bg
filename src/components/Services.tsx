import React from 'react';
import { Clock, CalendarDays, Star, Home, Heart, Shield } from 'lucide-react';
import ServiceCard from './common/ServiceCard';
import SectionHeading from './common/SectionHeading';

const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Daily Dog Walks',
      description: 'Regular exercise and bathroom breaks for your canine companion while you\'re at work or away.',
      icon: <Clock className="h-6 w-6" />,
      price: 'From $25 per walk',
      features: ['30-minute or 1-hour options', 'Flexible scheduling', 'GPS tracked walks', 'Detailed report after each visit'],
      popular: false,
    },
    {
      id: 2,
      title: 'In-Home Pet Sitting',
      description: 'Complete care for your pets in the comfort of their own home while you\'re on vacation or business trips.',
      icon: <Home className="h-6 w-6" />,
      price: 'From $60 per day',
      features: ['Multiple daily visits', 'Feeding and medication', 'Fresh water and litter maintenance', 'Home security checks'],
      popular: true,
    },
    {
      id: 3,
      title: 'Overnight Care',
      description: 'Overnight stays to provide companionship, security, and care during evening and morning hours.',
      icon: <CalendarDays className="h-6 w-6" />,
      price: 'From $95 per night',
      features: ['12-hour overnight stays', 'Evening and morning routines', 'Constant companionship', 'Regular updates and photos'],
      popular: false,
    },
    {
      id: 4,
      title: 'Pet Taxi Services',
      description: 'Safe transportation to vet appointments, grooming sessions, or wherever your pet needs to go.',
      icon: <Star className="h-6 w-6" />,
      price: 'From $35 per trip',
      features: ['Secure pet carriers provided', 'Climate-controlled vehicle', 'Waiting during appointments', 'Direct-to-destination service'],
      popular: false,
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Pet Care Services"
          subtitle="Professional care tailored to your pet's needs"
          centered
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Care</h3>
            <p className="text-gray-600">
              We tailor our services to your pet\'s unique personality, needs, and routines.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Insured & Bonded</h3>
            <p className="text-gray-600">
              Our services are fully insured and bonded for your complete peace of mind.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">5-Star Service</h3>
            <p className="text-gray-600">
              Consistently rated 5 stars by our clients for reliability and quality care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;