import React, { useState, useEffect, useRef, memo } from 'react';
import { Menu, X, User, Bell, Search, Calendar, ChevronDown, Sparkles, UserPlus, LogIn, LogOut, Heart } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import NotificationSystem from './NotificationSystem';
import BecomeASitter from './BecomeASitter';
import { useAuth } from '../contexts/AuthContext';

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
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBecomeASitterOpen, setIsBecomeASitterOpen] = useState(false);

  const { user, signOut } = useAuth();
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 shadow-xl h-24 border-b-2 border-green-300/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-full max-w-[1650px]">

          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex items-center justify-between h-full">

            {/* LOGO: Original logo image */}
            <a href="/" className="flex items-center flex-shrink-0 group transition-all duration-300 transform hover:scale-105">
              <img
                src="/logo.jpg"
                alt="CozyPets by Alice"
                className="h-20 w-auto mr-4 object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">CozyPets</h1>
                <p className="text-xl font-medium text-green-600">by Alice</p>
              </div>
            </a>

            {/* NAVIGATION LINKS - Enlarged Font Size */}
            <nav className="flex space-x-7 xl:space-x-10 justify-center items-center">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                  className="text-base xl:text-lg font-extrabold text-gray-800 hover:text-emerald-700 transition-all duration-200 whitespace-nowrap py-1 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-emerald-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ))}
            </nav>

            {/* SUPER MULTI-ACTION BUTTON */}
            <div className="flex items-center space-x-4 flex-shrink-0" ref={actionMenuRef}>
              
              {user && <NotificationSystem />}

              <div className="relative">
                <button
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                  className="group relative flex items-center gap-3.5 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-extrabold text-base xl:text-lg shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform active:scale-95 border-2 border-white/40"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md group-hover:rotate-12 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  </div>

                  <span>
                    {user ? `Здравей, ${user.name.split(' ')[0]}` : 'Услуги & Вход'}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isActionMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                  />

                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                  </span>
                </button>

                {/* MULTIFUNCTIONAL DROPDOWN MENU */}
                {isActionMenuOpen && (
                  <div className="absolute right-0 mt-3 w-84 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-emerald-100 p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    
                    <div className="px-3 py-2 border-b border-gray-100 mb-3 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Супер Меню Услуги
                      </span>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                        CozyPets
                      </span>
                    </div>

                    <div className="space-y-1.5">

                      <button
                        onClick={() => {
                          setIsActionMenuOpen(false);
                          window.location.href = '/#booking';
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-emerald-50 text-gray-800 hover:text-emerald-700 transition-all duration-200 text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-base">Резервирай сега</div>
                          <div className="text-xs text-gray-500">Бърза резервация на ситър</div>
                        </div>
                      </button>

                      <a
                        href="/search"
                        onClick={() => setIsActionMenuOpen(false)}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-blue-50 text-gray-800 hover:text-blue-700 transition-all duration-200 text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Search className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-base">Търси гледач</div>
                          <div className="text-xs text-gray-500">Намери проверен ситър близо до теб</div>
                        </div>
                      </a>

                      <button
                        onClick={() => {
                          setIsActionMenuOpen(false);
                          setIsBecomeASitterOpen(true);
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-purple-50 text-gray-800 hover:text-purple-700 transition-all duration-200 text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-base">Стани Гледач</div>
                          <div className="text-xs text-gray-500">Регистрирай се и печели с любимци</div>
                        </div>
                      </button>

                      <div className="my-2 border-t border-gray-100"></div>

                      {user ? (
                        <>
                          <a
                            href="/dashboard"
                            onClick={() => setIsActionMenuOpen(false)}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-green-50 text-gray-800 hover:text-green-700 transition-all duration-200 text-left group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-black text-base">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-base">Моето Табло</div>
                              <div className="text-xs text-gray-500">Профил & Моите резервации</div>
                            </div>
                          </a>

                          <button
                            onClick={() => {
                              setIsActionMenuOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-600 transition-all duration-200 text-left mt-1"
                          >
                            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                              <LogOut className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-base">Изход от профила</div>
                            </div>
                          </button>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => {
                              setIsActionMenuOpen(false);
                              setIsLoginOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-2xl text-sm transition-colors"
                          >
                            <LogIn className="w-4 h-4 text-gray-600" />
                            Вход
                          </button>

                          <button
                            onClick={() => {
                              setIsActionMenuOpen(false);
                              setIsRegisterOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold rounded-2xl text-sm transition-colors shadow-md"
                          >
                            <UserPlus className="w-4 h-4" />
                            Регистрация
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* MOBILE HEADER */}
          <div className="lg:hidden flex items-center justify-between h-24">
            <a href="/" className="flex items-center">
              <img
                src="/logo.jpg"
                alt="CozyPets by Alice"
                className="h-14 w-auto mr-3 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 leading-none">CozyPets</h1>
                <p className="text-sm font-medium text-green-600">by Alice</p>
              </div>
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-800 hover:text-emerald-600 transition-colors bg-white/80 rounded-xl border border-gray-200"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {isMenuOpen && (
            <div className="lg:hidden mt-2 pb-4">
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border p-5 space-y-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                    className="block text-lg font-bold text-gray-800 hover:text-emerald-600 py-1.5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}

                <div className="border-t pt-3 space-y-2.5">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.location.href = '/#booking';
                    }}
                    className="block w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold rounded-2xl text-center text-base shadow-md"
                  >
                    Резервирай сега
                  </button>

                  <a
                    href="/search"
                    className="block w-full py-3.5 bg-blue-600 text-white font-extrabold rounded-2xl text-center text-base shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Търси гледач
                  </a>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsBecomeASitterOpen(true);
                    }}
                    className="block w-full py-3.5 bg-purple-600 text-white font-extrabold rounded-2xl text-center text-base shadow-md"
                  >
                    Стани Гледач
                  </button>
                </div>

                <div className="border-t pt-3">
                  {user ? (
                    <div className="space-y-2">
                      <a
                        href="/dashboard"
                        className="block w-full py-3 bg-gray-100 font-extrabold text-gray-800 rounded-2xl text-center text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Табло ({user.name})
                      </a>
                      <button
                        onClick={() => { signOut(); setIsMenuOpen(false); }}
                        className="block w-full py-3 text-red-600 font-extrabold rounded-2xl text-center text-base border-2 border-red-200"
                      >
                        Изход
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
                        className="py-3.5 font-extrabold text-gray-800 bg-gray-100 rounded-2xl text-base"
                      >
                        Вход
                      </button>
                      <button
                        onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}
                        className="py-3.5 font-extrabold text-white bg-emerald-600 rounded-2xl text-base"
                      >
                        Регистрация
                      </button>
                    </div>
                  )}
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
});

export default Header;