import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './common/Button';
import Login from './Login';
import Register from './Register';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Team', href: '#team' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
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
              <a href="#" className="flex items-center">
                <img 
                  src="/src/components/assets/лого.png" 
                  alt="CozyPets by Alice" 
                  className="h-12 w-auto mr-3 transition-all duration-300 hover:scale-105"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium"
                >
                  {link.name}
                </a>
              ))}
              <Button onClick={() => setIsLoginOpen(true)} variant="outline">Login</Button>
              <Button onClick={() => setIsRegisterOpen(true)} variant="outline">Register</Button>
              <Button href="#booking">Book Now</Button>
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
                    href={link.href}
                    className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <Button onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} variant="outline">
                  Login
                </Button>
                <Button onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }} variant="outline">
                  Register
                </Button>
                <Button href="#booking" onClick={() => setIsMenuOpen(false)}>
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} onOpenRegister={() => setIsRegisterOpen(true)} />}
      {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} onOpenLogin={() => setIsLoginOpen(true)} />}
    </>
  );
};

export default Header;