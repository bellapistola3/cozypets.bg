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
    { name: 'Начало', href: '/', icon: Home },
    { name: 'Услуги', href: '#services', icon: Heart },
    { name: 'Отзиви', href: '#testimonials', icon: User },
    { name: 'Галерия', href: '#gallery', icon: Search },
    { name: 'Екип', href: '#team', icon: User },
    { name: 'Контакти', href: '#contact', icon: Phone },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-2xl border-b-4 border-yellow-400 py-2' 
            : 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-4'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo Section - Много по-голям и ярък */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group transform hover:scale-110 transition-all duration-500">
                <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-4 rounded-2xl shadow-2xl mr-4">
                  <img 
                    src="/src/components/assets/logo8808.png" 
                    alt="CozyPets by Alice" 
                    className={`transition-all duration-500 filter drop-shadow-2xl ${
                      isScrolled ? 'h-16 w-auto' : 'h-20 w-auto'
                    }`}
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-black tracking-wider">COZYPETS</h1>
                  <p className="text-sm font-medium opacity-90">by Alice</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation - Нов стил с икони */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                      isScrolled 
                        ? 'text-white hover:bg-yellow-400 hover:text-black shadow-lg' 
                        : 'text-white hover:bg-white hover:text-purple-600 shadow-xl'
                    } border-2 border-transparent hover:border-yellow-300`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Action Buttons - Нов ярък дизайн */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Button */}
              <a
                href="/search"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
              >
                <Search className="h-5 w-5" />
                <span>ТЪРСИ</span>
              </a>

              {/* Become Sitter Button */}
              <button
                onClick={() => setIsBecomeASitterOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
              >
                <Heart className="h-5 w-5" />
                <span>ГЛЕДАЧ</span>
              </button>

              {/* Profile Link */}
              <a
                href="/become-sitter"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
              >
                <User className="h-5 w-5" />
                <span>ПРОФИЛ</span>
              </a>

              {/* Notifications */}
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-full shadow-2xl">
                  <NotificationSystem />
                </div>
              </div>

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-2xl border-2 border-white">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 text-lg font-black shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-white">{user.name}</span>
                  </div>
                  <button 
                    onClick={signOut} 
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
                  >
                    ИЗХОД
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsLoginOpen(true)} 
                    className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
                  >
                    ВХОД
                  </button>
                  <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
                  >
                    РЕГИСТРАЦИЯ
                  </button>
                </div>
              )}

              {/* CTA Button - Много по-ярък */}
              <button 
                onClick={() => window.location.href = '/#booking'}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black text-lg rounded-full shadow-2xl transform hover:scale-125 hover:-translate-y-2 transition-all duration-500 border-4 border-white animate-pulse"
              >
                🐾 РЕЗЕРВИРАЙ СЕГА 🐾
              </button>
            </div>

            {/* Mobile Menu Button - Нов стил */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
              >
                {isMenuOpen ? 
                  <X className="h-8 w-8 text-white font-bold" /> : 
                  <Menu className="h-8 w-8 text-white font-bold" />
                }
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu - Нов ярък дизайн */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-yellow-400 p-8">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <a
                        key={link.name}
                        href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                        className="flex items-center gap-4 text-white hover:text-yellow-300 transition-colors duration-300 font-bold text-lg py-4 px-6 rounded-2xl hover:bg-white/10 border-2 border-transparent hover:border-yellow-400 transform hover:scale-105"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent className="h-6 w-6" />
                        {link.name}
                      </a>
                    );
                  })}
                  
                  <div className="border-t-4 border-yellow-400 pt-6 mt-6">
                    <a
                      href="/search"
                      className="flex items-center gap-4 text-white hover:text-green-300 transition-colors duration-300 font-bold text-lg py-4 px-6 rounded-2xl hover:bg-green-500/20 border-2 border-transparent hover:border-green-400 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="h-6 w-6" />
                      Търси гледачи
                    </a>
                    
                    <button
                      onClick={() => { setIsBecomeASitterOpen(true); setIsMenuOpen(false); }}
                      className="flex items-center gap-4 text-white hover:text-pink-300 transition-colors duration-300 font-bold text-lg py-4 px-6 rounded-2xl hover:bg-pink-500/20 w-full text-left border-2 border-transparent hover:border-pink-400 transform hover:scale-105"
                    >
                      <Heart className="h-6 w-6" />
                      Стани гледач
                    </button>
                    
                    <a
                      href="/become-sitter"
                      className="flex items-center gap-4 text-white hover:text-purple-300 transition-colors duration-300 font-bold text-lg py-4 px-6 rounded-2xl hover:bg-purple-500/20 border-2 border-transparent hover:border-purple-400 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-6 w-6" />
                      Профил на гледач
                    </a>
                    
                    <a
                      href="/dashboard"
                      className="flex items-center gap-4 text-white hover:text-blue-300 transition-colors duration-300 font-bold text-lg py-4 px-6 rounded-2xl hover:bg-blue-500/20 border-2 border-transparent hover:border-blue-400 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-6 w-6" />
                      Моят профил
                    </a>
                  </div>

                  <div className="border-t-4 border-yellow-400 pt-6 mt-6 space-y-4">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl border-2 border-white">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 font-black text-xl shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-white text-lg">Здравей, {user.name}</span>
                        </div>
                        <button 
                          onClick={() => { signOut(); setIsMenuOpen(false); }} 
                          className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
                        >
                          ИЗХОД
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button 
                          onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} 
                          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
                        >
                          ВХОД
                        </button>
                        <button 
                          onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                          className="w-full px-6 py-4 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
                        >
                          РЕГИСТРАЦИЯ
                        </button>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => { window.location.href = '/#booking'; setIsMenuOpen(false); }}
                      className="w-full px-8 py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black text-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white animate-pulse"
                    >
                      🐾 РЕЗЕРВИРАЙ СЕГА 🐾
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