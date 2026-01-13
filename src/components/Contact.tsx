import React from 'react';
import SectionHeading from './common/SectionHeading';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');

    // TODO: Integrate with email service (EmailJS или backend API)
    alert(`Благодарим ви, ${name}! Вашето съобщение е получено. Ще се свържем с вас скоро на ${email}`);
    e.currentTarget.reset();
  };

  return (
    <section id="contact" className="py-20 bg-white scroll-mt-16">
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
                <span>+359 895 363 601</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 mr-3" />
                <span>cozypetsbyalice@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-600 mr-3" />
                <span>Стара Загора, България</span>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Име
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="interactive-card w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
                  className="interactive-card w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
                  className="interactive-card w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="interactive-button neon-glow w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl"
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