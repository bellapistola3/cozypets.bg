import React, { useState } from 'react';
import { X, Upload, MapPin, DollarSign, FileText, Star } from 'lucide-react';
import Button from './common/Button';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/supabase';

interface BecomeASitterProps {
  onClose: () => void;
}

const BecomeASitter: React.FC<BecomeASitterProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    hourlyRate: '',
    qualifications: '',
    photoUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Моля, влезте в акаунта си');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await dbHelpers.createSitter({
        user_id: parseInt(user.id),
        bio: formData.bio,
        photo_url: formData.photoUrl || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
        hourly_rate: parseFloat(formData.hourlyRate),
        location: formData.location,
        qualifications: formData.qualifications
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to show new sitter status
      }, 2000);
    } catch (error) {
      console.error('Error creating sitter profile:', error);
      setError('Възникна грешка при създаването на профила. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Успешно!</h2>
          <p className="text-gray-600 mb-4">
            Вашият профил на гледач е създаден успешно. Сега можете да започнете да приемате резервации!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Станете гледач на домашни любимци</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Създайте своя профил и започнете да печелите, като се грижите за домашни любимци
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Разкажете за себе си *
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Опишете опита си с домашни любимци, какво ви мотивира и защо собствениците трябва да ви избират..."
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Местоположение *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="София, кв. Център"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
              Цена за час (лв.) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="10"
                max="200"
                step="0.50"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="25.00"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Препоръчваме цени между 15-50 лв. за час
            </p>
          </div>

          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
              Квалификации и опит
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Сертификати, курсове, години опит, специализации..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL на снимка (по избор)
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="photoUrl"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Ако не добавите снимка, ще използваме стандартна
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Какво следва?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Вашият профил ще бъде прегледан в рамките на 24 часа</li>
              <li>• Ще получите имейл с потвърждение</li>
              <li>• След одобрение можете да започнете да приемате резервации</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отказ
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Създаване...' : 'Създай профил'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeASitter;