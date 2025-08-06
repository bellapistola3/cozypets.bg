import React from 'react';
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <img 
                src="/src/components/assets/logo8808.png" 
                alt="CozyPets by Alice" 
                className="h-16 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Професионални услуги за грижа за домашни любимци, на които можете да се доверите. Поддържаме вашите домашни любимци щастливи, здрави и в безопасност.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Бързи връзки</h3>
            <ul className="space-y-2">
              <li><a href="/#services" className="text-gray-400 hover:text-white transition-colors">Услуги</a></li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  За нас
                </Link>
              </li>
              <li><a href="/#team" className="text-gray-400 hover:text-white transition-colors">Нашият екип</a></li>
              <li><a href="/#booking" className="text-gray-400 hover:text-white transition-colors">Резервирай сега</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li><a href="/#services" className="text-gray-400 hover:text-white transition-colors">Разходки с кучета</a></li>
              <li><a href="/#services" className="text-gray-400 hover:text-white transition-colors">Гледане на домашни любимци</a></li>
              <li><a href="/#services" className="text-gray-400 hover:text-white transition-colors">Нощна грижа</a></li>
              <li><a href="/#services" className="text-gray-400 hover:text-white transition-colors">Такси за домашни любимци</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Свържете се с нас</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <a href="mailto:cozypetsbyalis@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  cozypetsbyalis@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <a href="tel:+359895888260" className="text-gray-400 hover:text-white transition-colors">
                  +359 895 888 260
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">
                  Стара Загора, България
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CozyPets by Alice. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;