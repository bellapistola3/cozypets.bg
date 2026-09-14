import React, { useState } from 'react';
import { X, MapPin, DollarSign, FileText, Star, Sparkles, CheckCircle, ShieldCheck, Heart, Mail, Lock, User, Phone } from 'lucide-react';
import Button from './common/Button';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/firebase';
import { supabase } from '../lib/supabaseClient';

interface BecomeASitterProps {
  onClose: () => void;
}

const BecomeASitter: React.FC<BecomeASitterProps> = ({ onClose }) => {
  const { user, signUp, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Registration fields for non-logged in users
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Sitter profile fields
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('София, Център');
  const [price24h, setPrice24h] = useState('45');
  const [qualifications, setQualifications] = useState('Опит с домашни любимци, първа помощ и разходки');

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google register error:', err);
      setError('Грешка при регистрация с Google: ' + (err.message || 'Опитайте отново'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let activeUid = user?.id;

      // 1. If user is not logged in, perform direct Sitter Account Sign-Up first!
      if (!activeUid) {
        if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
          setError('Моля, попълнете вашите три имена, имейл, парола и телефон');
          setLoading(false);
          return;
        }

        try {
          await signUp(email, password, name, phone, 'sitter');
          const { data: authData } = await supabase.auth.getUser();
          activeUid = authData.user?.id;
        } catch (signUpErr: any) {
          console.error('Sign up sitter error:', signUpErr);
          setError('Грешка при създаване на акаунт: ' + (signUpErr.message || 'Опитайте с друг имейл'));
          setLoading(false);
          return;
        }
      }

      if (!activeUid) {
        setError('Не може да се установи потребителска сесия. Моля, влезте отново.');
        setLoading(false);
        return;
      }

      // 2. Create User Profile with sitter role
      await dbHelpers.createUserProfile({
        auth_user_id: activeUid,
        name: user?.name || name || 'Гледач',
        email: user?.email || email,
        phone: phone || '',
        role: 'sitter'
      }).catch(err => console.log('Notice profile:', err.message));

      // 3. Create Sitter Profile Record at sitters table
      await dbHelpers.createOrUpdateSitter({
        id: activeUid,
        profile_title: `${user?.name || name} — Сертифициран Гледач`,
        bio: bio || 'Обичам животните и се отнасям към тях с много грижа, разходки и внимание!',
        address_line: location || 'София',
        price_24h: parseFloat(price24h) || 45,
        medical_training: qualifications,
        pet_types: ['kuche', 'kotka'],
        allow_small_dogs: true,
        allow_large_dogs: true,
        accept_in_heat: false,
        accept_unneutered: true,
        behavior_trainer: true,
        has_car: true
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = '/dashboard'; // Redirect directly to sitter dashboard!
      }, 2000);

    } catch (err: any) {
      console.error('Sitter registration error:', err);
      setError(`Възникна грешка при създаването на профила: ${err?.message || 'Опитайте отново'}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-2 border-emerald-200">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Честито! 🎉</h2>
          <p className="text-gray-600 mb-6 font-medium">
            Вашият профил на Гледач е създаден успешно! Пренасочваме ви към вашето Табло за ситъри...
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-spin" /> Зареждане на таблото...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border-2 border-purple-100 my-8">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Стани PRO Ситър
          </div>

          <h2 className="text-3xl font-black tracking-tight">Регистрация като Гледач</h2>
          <p className="text-purple-100 text-sm mt-1 font-medium">
            Печелете пари, като се грижите за кучета и котки в удобно за вас време!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON AT THE TOP */}
          {!user && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-200 space-y-3 text-center">
              <span className="text-xs font-black text-purple-800 uppercase tracking-wider block">
                ⚡ Бърза регистрация с 1 клик
              </span>
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 hover:border-purple-400 rounded-2xl font-black text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Влез и Регистрирай се като Гледач с Google
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-purple-200"></div>
                <span className="px-3 text-xs font-bold text-purple-600 uppercase">или попълнете формата</span>
                <div className="flex-1 border-t border-purple-200"></div>
              </div>
            </div>
          )}

          {/* USER ACCOUNT FIELDS (IF NOT LOGGED IN) */}
          {!user && (
            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Две Имена *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Мария Петкова"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Имейл *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@example.com"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Парола (мин. 6 симв.) *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-bold"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Телефонен Номер *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+359 888 123 456"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-bold"
                  required
                />
              </div>
            </div>
          )}

          {/* SITTER DETAILS */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Разкажете за себе си и опита си *
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-medium"
              placeholder="Опишете любовта си към животните, породите с които сте работили и защо собствениците могат да ви имат 100% доверие..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Град & Квартал *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-11 pr-4 p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-bold"
                  placeholder="София, Лозенец"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Вашата Цена за 24ч (лв.) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={price24h}
                  onChange={(e) => setPrice24h(e.target.value)}
                  className="w-full pl-11 pr-4 p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 font-black text-lg text-emerald-600"
                  placeholder="45"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-purple-900 text-xs font-bold leading-relaxed">
            <div className="flex items-center gap-2 mb-1 text-purple-800 text-sm">
              <ShieldCheck className="w-5 h-5 text-purple-600" /> 100% Гаранция & Проверен Профил
            </div>
            Всеки нов профил получава незабавно одобрение за видимост в платформената търсачка. 75% от всяка резервация постъпват директно по вашата сметка.
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3.5 font-bold border-2">
              Отказ
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 font-black text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl"
            >
              {loading ? 'Създаване...' : 'Потвърди & Стани Гледач 🚀'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeASitter;