import React, { useState, useEffect, memo, useCallback } from 'react';
import { Menu, X, User, Bell, Search, Heart, Home, Phone, Mail } from 'lucide-react';
import Button from './common/Button';
import Login from './Login';
import Register from './Register';
import NotificationSystem from './NotificationSystem';
import BecomeASitter from './BecomeASitter';
import { useAuth } from '../contexts/AuthContext';

// Move navLinks outside component to prevent recreation on each render
const NAV_LINKS = [
  { name: 'Начало', href: '/' },
  { name: 'Услуги', href: '/services' },
  { name: 'Отзиви', href: '#testimonials' },
  { name: 'Галерия', href: '#gallery' },
  { name: 'Екип', href: '#team' },
  { name: 'Ветеринар', href: '/vet-chat' },
  { name: 'Контакти', href: '#contact' },
];

const Header: React.FC = memo(() => {
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



  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-200 to-green-300 shadow-lg h-24">
        <div className="container mx-auto px-8 h-full max-w-[1600px]">

          {/* DESKTOP ВЕРСИЯ */}
          <div className="hidden lg:flex items-center justify-between h-full">

            {/* ЛОГО */}
            <div className="flex items-center flex-shrink-0 mr-8">
              <img
                src="/logo.jpg"
                alt="CozyPets by Alice"
                className="h-20 w-auto mr-4 object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">CozyPets</h1>
                <p className="text-xl font-medium text-green-600">by Alice</p>
              </div>
            </div>

            {/* НАВИГАЦИЯ */}
            <nav className="flex space-x-10 flex-1 justify-center items-center">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                  className="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors duration-200 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* БУТОНИ */}
            <div className="flex items-center space-x-5 flex-shrink-0 ml-8">

              {/* Резервирай сега */}
              <button
                onClick={() => {
                  window.location.href = '/#booking';
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base whitespace-nowrap"
              >
                Резервирай сега
              </button>

              {/* Търси гледач */}
              <a
                href="/search"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base whitespace-nowrap"
              >
                Търси гледач
              </a>

              {/* Стани Гледач - NEW!! */}
              <button
                onClick={() => setIsBecomeASitterOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base whitespace-nowrap"
              >
                Стани Гледач
              </button>

              {/* Потребител или Вход/Регистрация */}
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Известия */}
                  <NotificationSystem />

                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800 text-base">{user.name}</span>
                  </button>

                  <button
                    onClick={signOut}
                    className="px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 text-base font-semibold border-2 border-red-200 hover:border-red-400"
                  >
                    Изход
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-5 py-2.5 font-semibold text-gray-700 bg-white hover:bg-green-50 hover:text-green-600 transition-all duration-300 text-base border-2 border-gray-300 hover:border-green-600 rounded-xl shadow-sm"
                  >
                    Вход
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base"
                  >
                    Регистрация
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* МОБИЛНА ВЕРСИЯ */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between h-24">

              {/* Лого */}
              <a href="/" className="flex items-center">
                <img
                  src="/logo.jpg"
                  alt="CozyPets by Alice"
                  className="h-16 w-auto object-contain mr-3"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">CozyPets</h1>
                  <p className="text-base font-medium text-green-600">by Alice</p>
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
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.name}
                        href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                        className="block text-lg font-medium text-gray-700 hover:text-green-600 py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    ))}

                    <div className="border-t pt-3 space-y-3">
                      <a
                        href="/search"
                        className="block w-full px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center text-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Търси гледач
                      </a>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsBecomeASitterOpen(true);
                        }}
                        className="block w-full px-5 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center text-lg"
                      >
                        Стани Гледач
                      </button>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.location.href = '/#booking';
                        }}
                        className="block w-full px-5 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center text-lg"
                      >
                        Резервирай сега
                      </button>
                    </div>

                    <div className="border-t pt-3 space-y-3">
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-lg font-medium text-gray-800">Здравей, {user.name}</span>
                          </div>
                          <button
                            onClick={() => { signOut(); setIsMenuOpen(false); }}
                            className="w-full px-4 py-3 text-lg text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                          >
                            Изход
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
                            className="w-full px-5 py-4 text-lg text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-green-600"
                          >
                            Вход
                          </button>
                          <button
                            onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                            className="w-full px-5 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            Регистрация
                          </button>
                        </div>
                      )}
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
});

export default Header;