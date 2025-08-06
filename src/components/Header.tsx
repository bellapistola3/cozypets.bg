import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './common/Button';
import Login from './Login';
import Register from './Register';
import NotificationSystem from './NotificationSystem';
import BecomeASitter from './BecomeASitter';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBecomeASitterOpen, setIsBecomeASitterOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Услуги', href: '#services' },
    { name: 'Отзиви', href: '#testimonials' },
    { name: 'Галерия', href: '#gallery' },
    { name: 'Екип', href: '#team' },
    { name: 'ЧЗВ', href: '#faq' },
    { name: 'Контакти', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img 
                  src="/src/components/assets/logo8808.png" 
                  alt="CozyPets by Alice" 
                  className={`transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'h-16 w-auto' : 'h-20 w-auto'
                  }`}
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="/search"
                className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium"
              >
                Търси гледачи
              </a>
              <button
                onClick={() => setIsBecomeASitterOpen(true)}
                className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium"
              >
                Стани гледач
              </button>
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium"
              >
                Моят профил
              </a>
              <NotificationSystem />
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">Здравей, {user.name}</span>
                  <Button onClick={signOut} variant="outline">Изход</Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => setIsLoginOpen(true)} variant="outline">Вход</Button>
                  <Button onClick={() => setIsRegisterOpen(true)} variant="outline">Регистрация</Button>
                </>
              )}
              <Button href="/#booking">Резервирай сега</Button>
            </nav>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fadeIn">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                    className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href="/search"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Търси гледачи
                </a>
                <button
                  onClick={() => { setIsBecomeASitterOpen(true); setIsMenuOpen(false); }}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-2 text-left w-full"
                >
                  Стани гледач
                </button>
                <a
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Моят профил
                </a>
                <Button onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} variant="outline">
                  {user ? 'Изход' : 'Вход'}
                </Button>
                {!user && (
                  <Button onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }} variant="outline">
                    Регистрация
                  </Button>
                )}
                <Button href="/#booking" onClick={() => setIsMenuOpen(false)}>
                  Резервирай сега
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} onOpenRegister={() => setIsRegisterOpen(true)} />}
      {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} onOpenLogin={() => setIsLoginOpen(true)} />}
      {isBecomeASitterOpen && <BecomeASitter onClose={() => setIsBecomeASitterOpen(false)} />}
    </>
  );
};

export default Header;