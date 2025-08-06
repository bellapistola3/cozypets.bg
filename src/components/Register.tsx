import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import Button from './common/Button';
import SocialLogin from './SocialLogin';

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
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Register attempt:', formData);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Register with ${provider}`);
    // Handle social registration logic
  };

        {!showEmailForm ? (
          <div className="space-y-6">
            <SocialLogin
              onGoogleLogin={() => handleSocialLogin('Google')}
              onFacebookLogin={() => handleSocialLogin('Facebook')}
              onEmailLogin={() => setShowEmailForm(true)}
            />
            
            <div className="text-center text-sm text-gray-600">
              Вече имате акаунт?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Влезте
              </button>
            </div>
          </div>
        ) : (
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
            <Button type="submit" className="w-full mt-6">
              Създай акаунт
            </Button>
            <div className="text-center text-sm text-gray-600">
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-green-600 hover:text-green-500"
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Влезте
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
        )
        }
}