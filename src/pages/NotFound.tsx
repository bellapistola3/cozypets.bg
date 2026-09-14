import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-emerald-100 relative overflow-hidden">
        
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
          <AlertCircle className="w-12 h-12 text-emerald-600" />
        </div>

        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Страницата не е намерена 🐾</h2>
        
        <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium">
          Изглежда, че тази страница е отишла на разходка в парка или адресът е грешен!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5" /> Към Началото
          </Link>
          <Link
            to="/sitters"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-base rounded-2xl border border-emerald-200 transition-all duration-300"
          >
            <Search className="w-5 h-5" /> Търсене на Гледачи
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
