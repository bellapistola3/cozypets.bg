import React from 'react';
import SectionHeading from './common/SectionHeading';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Contact Us"
          subtitle="Get in touch with our pet care team"
          centered
        />
        
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-3" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <span>contact@pawkeeper.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                <span>123 Pet Care Lane, Pet City, PC 12345</span>
              </div>
            </div>
          </div>
          
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;