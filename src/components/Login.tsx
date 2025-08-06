import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import Button from './common/Button';
import SocialLogin from './SocialLogin';

interface LoginProps {
  onClose: () => void;
  onOpenRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Handle social login logic
  };

  return (
        {!showEmailForm ? (
          <div className="space-y-6">
            <SocialLogin
              onGoogleLogin={() => handleSocialLogin('Google')}
              onFacebookLogin={() => handleSocialLogin('Facebook')}
              onEmailLogin={() => setShowEmailForm(true)}
            />
            
            <div className="text-center text-sm text-gray-600">
              Нямате акаунт?{' '}
              <button 
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Регистрирайте се
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Въведете вашия имейл"
                  required
                />
              </div>
            </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Въведете вашата парола"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
            <Button type="submit" className="w-full">
              Влез
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
                  onOpenRegister();
                }}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Регистрирайте се
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;