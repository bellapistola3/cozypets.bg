import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import Button from './common/Button';
import SocialLogin from './SocialLogin';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { dbHelpers } from '../lib/firebase';

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
    phoneNumber: '',
    role: 'owner' as 'owner' | 'sitter'
  });
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullName = `${formData.firstName} ${formData.familyName}`;

    if (!formData.firstName.trim() || !formData.familyName.trim()) {
      setError('Моля, въведете име и фамилия');
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Моля, въведете имейл и парола');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Паролата трябва да е поне 6 символа');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, fullName, formData.phoneNumber, formData.role);
      
      // If user chose to register as a sitter, create default sitter entry
      if (formData.role === 'sitter') {
        const { data: authData } = await supabase.auth.getUser();
        if (authData.user?.id) {
          await dbHelpers.createOrUpdateSitter({
            id: authData.user.id,
            profile_title: `${fullName} — Сертифициран Гледач`,
            bio: 'Нов гледач в CozyPets! Готов да помага с грижата за вашите домашни любимци.',
            address_line: 'София',
            price_24h: 40,
            pet_types: ['kuche', 'kotka'],
            allow_small_dogs: true,
            allow_large_dogs: true,
            accept_in_heat: false,
            accept_unneutered: true,
            behavior_trainer: false,
            has_car: false
          }).catch(err => console.error('Sitter auto-creation note:', err));
        }
      }

      onClose();
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Възникна грешка при регистрация. Моля, опитайте отново.';

      if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
        errorMessage = 'Този имейл вече е регистриран. Моля, влезте в акаунта си.';
      } else if (error.message?.includes('invalid email') || error.message?.includes('Invalid email')) {
        errorMessage = 'Невалиден имейл адрес.';
      } else if (error.message?.includes('weak password') || error.message?.includes('Password')) {
        errorMessage = 'Паролата е твърде слаба. Използвайте поне 6 символа.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // OAuth redirect will happen automatically
    } catch (error: any) {
      console.error('Google login error:', error);
      const msg = error?.message?.includes('provider is not enabled')
        ? 'Google входът все още не е активиран в Supabase настройките.'
        : 'Грешка при регистрация с Google. Моля, попълнете формата по-долу.';
      setError(msg);
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      await signInWithFacebook();
      // OAuth redirect will happen automatically
    } catch (error: any) {
      console.error('Facebook login error:', error);
      const msg = error?.message?.includes('provider is not enabled')
        ? 'Facebook входът все още не е активиран в Supabase настройките.'
        : 'Грешка при регистрация с Facebook. Моля, попълнете формата по-долу.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Създайте акаунт
        </h2>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

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
                  placeholder="Създайте парола (мин. 6 символа)"
                  required
                  minLength={6}
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

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Искам да се регистрирам като:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 font-medium bg-white"
              >
                <option value="owner">🐾 Собственик на домашен любимец</option>
                <option value="sitter">🏡 Гледач на домашни любимци (Ситър)</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-4">
              {loading ? 'Създаване...' : 'Създай акаунт'}
            </Button>
          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">или с профил</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Регистрация с Google
            </button>
            <button
              onClick={handleFacebookLogin}
              type="button"
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Регистрация с Facebook
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 pt-2">
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
      </div>
    </div>
  );
};

export default Register;