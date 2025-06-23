import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import Button from './common/Button';

interface RegisterProps {
  onClose: () => void;
  onOpenLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    familyName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Register attempt:', formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Затвори регистрация"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          {/* Logo in Register Modal - Bigger */}
          <div className="text-center mb-8">
            <img 
              src="/src/components/assets/лого.png" 
              alt="CozyPets by Alice" 
              className="h-24 w-auto mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-900">Създайте акаунт</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Име
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Въведете вашето име"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="familyName"
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Въведете вашата фамилия"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Имейл адрес
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Въведете вашия имейл"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Парола
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Създайте парола"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Телефонен номер
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Въведете вашия телефонен номер"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Създай акаунт
            </Button>

            <div className="text-center text-sm text-gray-600">
              Вече имате акаунт?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();        // close the Register modal
                  onOpenLogin();    // open the Login modal
                }}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Влезте
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;