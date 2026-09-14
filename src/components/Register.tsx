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

        {!showEmailForm ? (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <SocialLogin
              onGoogleLogin={handleGoogleLogin}
              onFacebookLogin={handleFacebookLogin}
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

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

            <Button type="submit" className="w-full mt-6">
              {loading ? 'Създаване...' : 'Създай акаунт'}
            </Button>

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