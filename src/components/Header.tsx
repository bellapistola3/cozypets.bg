import React, { useState, useEffect } from 'react';
import { Menu, X, User, Bell, Search, Heart, Home, Phone, Mail } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Начало', href: '/' },
    { name: 'Услуги', href: '#services' },
    { name: 'Отзиви', href: '#testimonials' },
    { name: 'Галерия', href: '#gallery' },
    { name: 'Екип', href: '#team' },
    { name: 'Контакти', href: '#contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* LOGO - МНОГО ГОЛЯМО И ЗАБЕЛЕЖИМО */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="bg-green-500 p-4 rounded-2xl shadow-lg mr-4">
                  <img 
                    src="/src/components/assets/logo8808.png" 
                    alt="CozyPets by Alice" 
                    className="h-16 w-auto"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">CozyPets</h1>
                  <p className="text-xl text-green-600 font-semibold">by Alice</p>
                </div>
              </a>
            </div>

            {/* НАВИГАЦИЯ - САМО ЗА DESKTOP */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                  className="text-xl font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* БУТОНИ ВДЯСНО - ЯСНО РАЗДЕЛЕНИ */}
            <div className="hidden lg:flex items-center space-x-6">
              
              {/* ТЪРСИ ГЛЕДАЧ */}
              <a
                href="/search"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl transition-all"
              >
                <Search className="h-5 w-5" />
                Търси гледач
              </a>

              {/* ИЗВЕСТИЯ */}
              <div className="relative">
                <NotificationSystem />
              </div>

              {/* ПОТРЕБИТЕЛ ИЛИ ВХОД/РЕГИСТРАЦИЯ */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-lg font-semibold text-gray-800">{user.name}</span>
                  </div>
                  <button 
                    onClick={signOut} 
                    className="px-4 py-2 text-lg text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    Изход
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsLoginOpen(true)} 
                    className="px-6 py-3 text-lg font-semibold text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Вход
                  </button>
                  <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl transition-all"
                  >
                    Регистрация
                  </button>
                </div>
              )}

              {/* РЕЗЕРВИРАЙ СЕГА - СПЕЦИАЛЕН БУТОН */}
              <button 
                onClick={() => window.location.href = '/#booking'}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                🐾 Резервирай сега
              </button>
            </div>

            {/* МОБИЛНО МЕНЮ БУТОН */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>

          {/* МОБИЛНО МЕНЮ */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6">
              <div className="bg-white rounded-2xl shadow-xl border p-6">
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                      className="block text-xl font-medium text-gray-700 hover:text-green-600 py-3 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  
                  <div className="border-t pt-4 space-y-4">
                    <a
                      href="/search"
                      className="flex items-center gap-3 text-xl font-medium text-gray-700 hover:text-green-600 py-3 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="h-6 w-6" />
                      Търси гледачи
                    </a>
                    
                    <button
                      onClick={() => { setIsBecomeASitterOpen(true); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 text-xl font-medium text-gray-700 hover:text-green-600 py-3 w-full text-left transition-colors"
                    >
                      <Heart className="h-6 w-6" />
                      Стани гледач
                    </button>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xl font-semibold text-gray-800">Здравей, {user.name}</span>
                        </div>
                        <button 
                          onClick={() => { signOut(); setIsMenuOpen(false); }} 
                          className="w-full px-6 py-4 text-xl text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-all"
                        >
                          Изход
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button 
                          onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} 
                          className="w-full px-6 py-4 text-xl text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all"
                        >
                          Вход
                        </button>
                        <button 
                          onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                          className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-xl transition-all"
                        >
                          Регистрация
                        </button>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => { window.location.href = '/#booking'; setIsMenuOpen(false); }}
                      className="w-full px-8 py-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-bold rounded-xl shadow-lg transition-all"
                    >
                      🐾 Резервирай сега
                    </button>
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