import React from 'react';
import SectionHeading from './common/SectionHeading';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Свържете се с нас"
          subtitle="Пишете ни – ние сме тук за вас и вашите любимци"
          centered
        />
        
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Контакти</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-3" />
                <span>+359 XXX XXX XXX</span> {/* ← сложи реален номер */}
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 mr-3" />
                <span>contact@cozypetsbyalice.bg</span> {/* ← ако нямаш, остави празно */}
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-600 mr-3" />
                <span>София, България</span>
              </div>
            </div>
          </div>
          
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Име
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Имейл
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Съобщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Изпрати съобщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
