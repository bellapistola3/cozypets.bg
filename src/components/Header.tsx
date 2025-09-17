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
    { name: 'Начало', href: '/' },
    { name: 'Услуги', href: '#services' },
    { name: 'Отзиви', href: '#testimonials' },
    { name: 'Галерия', href: '#gallery' },
    { name: 'Екип', href: '#team' },
    { name: 'Контакти', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white shadow-lg py-3' 
            : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl shadow-md mr-4">
                  <img 
                    src="/src/components/assets/logo8808.png" 
                    alt="CozyPets by Alice" 
                    className="h-10 w-auto"
                  />
                </div>
                <div className="text-gray-800">
                  <h1 className="text-2xl font-bold">CozyPets</h1>
                  <p className="text-sm text-green-600 font-medium">by Alice</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                  className="text-gray-700 hover:text-green-600 font-medium text-base transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <a
                href="/search"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Search className="h-4 w-4" />
                <span>Търси гледач</span>
              </a>

              {/* Notifications */}
              <div className="relative">
                <NotificationSystem />
              </div>

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </div>
                  <button 
                    onClick={signOut} 
                    className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-300"
                  >
                    Изход
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsLoginOpen(true)} 
                    className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
                  >
                    Вход
                  </button>
                  <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    Регистрация
                  </button>
                </div>
              )}

              {/* CTA Button */}
              <button 
                onClick={() => window.location.href = '/#booking'}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                🐾 Резервирай сега
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors duration-300"
              >
                {isMenuOpen ? 
                  <X className="h-6 w-6" /> : 
                  <Menu className="h-6 w-6" />
                }
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4">
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                      className="text-gray-700 hover:text-green-600 font-medium text-lg py-2 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <a
                      href="/search"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg py-2 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="h-5 w-5" />
                      Търси гледачи
                    </a>
                    
                    <button
                      onClick={() => { setIsBecomeASitterOpen(true); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg py-2 w-full text-left transition-colors duration-300"
                    >
                      <Heart className="h-5 w-5" />
                      Стани гледач
                    </button>
                    
                    <a
                      href="/become-sitter"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg py-2 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Профил на гледач
                    </a>
                    
                    <a
                      href="/dashboard"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg py-2 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Моят профил
                    </a>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">Здравей, {user.name}</span>
                        </div>
                        <button 
                          onClick={() => { signOut(); setIsMenuOpen(false); }} 
                          className="w-full px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-300"
                        >
                          Изход
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button 
                          onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} 
                          className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all duration-300"
                        >
                          Вход
                        </button>
                        <button 
                          onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300"
                        >
                          Регистрация
                        </button>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => { window.location.href = '/#booking'; setIsMenuOpen(false); }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
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