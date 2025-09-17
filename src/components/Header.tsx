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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          
          {/* DESKTOP ВЕРСИЯ */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-4 items-center">
              
              {/* ЛОГО - 3 колони */}
              <div className="col-span-3">
                <a href="/" className="flex items-center">
                  <img 
                    src="/src/components/assets/logo8808.png" 
                    alt="CozyPets by Alice" 
                    className="h-12 w-12 mr-3"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">CozyPets</h1>
                    <p className="text-sm text-green-600">by Alice</p>
                  </div>
                </a>
              </div>

              {/* НАВИГАЦИЯ - 6 колони */}
              <div className="col-span-6">
                <nav className="flex justify-center space-x-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                      className="text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>

              {/* БУТОНИ - 3 колони */}
              <div className="col-span-3">
                <div className="flex items-center justify-end space-x-3">
                  
                  {/* Търси гледач */}
                  <a
                    href="/search"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Търси гледач
                  </a>

                  {/* Известия */}
                  <NotificationSystem />

                  {/* Потребител или Вход/Регистрация */}
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                      <button 
                        onClick={signOut} 
                        className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Изход
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setIsLoginOpen(true)} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                      >
                        Вход
                      </button>
                      <button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Регистрация
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* РЕЗЕРВИРАЙ СЕГА - отделен ред */}
            <div className="mt-3 text-center">
              <button 
                onClick={() => window.location.href = '/#booking'}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                🐾 Резервирай сега
              </button>
            </div>
          </div>

          {/* МОБИЛНА ВЕРСИЯ */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between">
              
              {/* Лого */}
              <a href="/" className="flex items-center">
                <img 
                  src="/src/components/assets/logo8808.png" 
                  alt="CozyPets by Alice" 
                  className="h-10 w-10 mr-2"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">CozyPets</h1>
                  <p className="text-xs text-green-600">by Alice</p>
                </div>
              </a>

              {/* Мобилно меню бутон */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* МОБИЛНО МЕНЮ */}
            {isMenuOpen && (
              <div className="mt-4 pb-4">
                <div className="bg-white rounded-lg shadow-lg border p-4">
                  <div className="space-y-3">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                        className="block text-base font-medium text-gray-700 hover:text-green-600 py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    ))}
                    
                    <div className="border-t pt-3 space-y-3">
                      <a
                        href="/search"
                        className="block text-base font-medium text-gray-700 hover:text-green-600 py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Търси гледачи
                      </a>
                      
                      <button
                        onClick={() => { setIsBecomeASitterOpen(true); setIsMenuOpen(false); }}
                        className="block text-base font-medium text-gray-700 hover:text-green-600 py-2 w-full text-left transition-colors"
                      >
                        Стани гледач
                      </button>
                    </div>

                    <div className="border-t pt-3 space-y-3">
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-base font-medium text-gray-800">Здравей, {user.name}</span>
                          </div>
                          <button 
                            onClick={() => { signOut(); setIsMenuOpen(false); }} 
                            className="w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                          >
                            Изход
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button 
                            onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                          >
                            Вход
                          </button>
                          <button 
                            onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors"
                          >
                            Регистрация
                          </button>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => { window.location.href = '/#booking'; setIsMenuOpen(false); }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
                      >
                        🐾 Резервирай сега
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} onOpenRegister={() => setIsRegisterOpen(true)} />}
      {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} onOpenLogin={() => setIsLoginOpen(true)} />}
      {isBecomeASitterOpen && <BecomeASitter onClose={() => setIsBecomeASitterOpen(false)} />}
    </>
  );
};

export default Header;