import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import Button from './common/Button';
import SocialLogin from './SocialLogin';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onClose: () => void;
  onOpenRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    signIn(email, password)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        setError(error.message || 'Възникна грешка при влизане');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // OAuth redirect will happen automatically
    } catch (error) {
      console.error('Google login error:', error);
      setError('Грешка при влизане с Google');
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      await signInWithFacebook();
      // OAuth redirect will happen automatically
    } catch (error) {
      console.error('Facebook login error:', error);
      setError('Грешка при влизане с Facebook');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Влезте в акаунта си
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

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
              {loading ? 'Влизане...' : 'Влез'}
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