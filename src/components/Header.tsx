import React, { useState, useEffect } from 'react';
import { Menu, X, User, Bell, Search, Heart } from 'lucide-react';
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100 py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <img 
                  src="/src/components/assets/logo8808.png" 
                  alt="CozyPets by Alice" 
                  className={`transition-all duration-500 group-hover:scale-110 filter drop-shadow-lg ${
                    isScrolled ? 'h-14 w-auto' : 'h-18 w-auto'
                  }`}
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                  className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-green-600' 
                      : 'text-white hover:text-green-300'
                  } after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <a
                href="/search"
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    : 'text-white hover:text-green-300 hover:bg-white/10'
                }`}
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline">Търси гледачи</span>
              </a>

              {/* Become Sitter Button */}
              <button
                onClick={() => setIsBecomeASitterOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    : 'text-white hover:text-green-300 hover:bg-white/10'
                }`}
              >
                <Heart className="h-4 w-4" />
                <span className="hidden xl:inline">Стани гледач</span>
              </button>

              {/* Profile Link */}
              <a
                href="/become-sitter"
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    : 'text-white hover:text-green-300 hover:bg-white/10'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden xl:inline">Профил</span>
              </a>

              {/* Notifications */}
              <div className="relative">
                <NotificationSystem />
              </div>

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium hidden xl:inline">{user.name}</span>
                  </div>
                  <Button 
                    onClick={signOut} 
                    variant="outline"
                    className="text-sm px-4 py-2"
                  >
                    Изход
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => setIsLoginOpen(true)} 
                    variant="outline"
                    className="text-sm px-4 py-2"
                  >
                    Вход
                  </Button>
                  <Button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="text-sm px-4 py-2"
                  >
                    Регистрация
                  </Button>
                </div>
              )}

              {/* CTA Button */}
              <Button 
                href="/#booking"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Резервирай сега
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    : 'text-white hover:text-green-300 hover:bg-white/10'
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6 animate-fadeIn">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-green-100 p-6">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                      className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-green-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <a
                      href="/search"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-green-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="h-5 w-5" />
                      Търси гледачи
                    </a>
                    
                    <button
                      onClick={() => { setIsBecomeASitterOpen(true); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-green-50 w-full text-left"
                    >
                      <Heart className="h-5 w-5" />
                      Стани гледач
                    </button>
                    
                    <a
                      href="/become-sitter"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-green-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Профил на гледач
                    </a>
                    
                    <a
                      href="/dashboard"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-green-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Моят профил
                    </a>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">Здравей, {user.name}</span>
                        </div>
                        <Button 
                          onClick={() => { signOut(); setIsMenuOpen(false); }} 
                          variant="outline"
                          className="w-full"
                        >
                          Изход
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} 
                          variant="outline"
                          className="w-full"
                        >
                          Вход
                        </Button>
                        <Button 
                          onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                          className="w-full"
                        >
                          Регистрация
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      href="/#booking" 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      Резервирай сега
                    </Button>
                  </div>
                </div>
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