import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, User, Mail, Phone, Heart, MapPin, Star, Sparkles, AlertCircle, PawPrint } from 'lucide-react';
import SectionHeading from './common/SectionHeading';
import Button from './common/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

const Booking: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    petName: '',
    petType: 'dog',
    service: 'daily-walks',
    date: '',
    time: '',
    notes: '',
  });

  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, phone')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            name: profile.full_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
          }));
        }
      };
      loadUserData();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone) {
          setError('Моля, попълнете всички задължителни полета.');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError('Моля, въведете валиден имейл адрес.');
          return false;
        }
        return true;
      case 2:
        if (!formData.petName || !formData.petType || !formData.service) {
          setError('Моля, попълнете всички полета за вашия домашен любимец.');
          return false;
        }
        return true;
      case 3:
        if (!formData.date || !formData.time) {
          setError('Моля, изберете дата и час за резервацията.');
          return false;
        }
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          setError('Моля, изберете бъдеща дата.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep((prev) => prev + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setFormStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!validateStep(3)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          owner_id: user.id,
          pet_name: formData.petName,
          pet_type: formData.petType,
          service_type: formData.service,
          start_date: formData.date,
          start_time: formData.time,
          notes: formData.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking error:', bookingError);
        setError('Възникна грешка при създаването на резервацията. Моля, опитайте отново.');
        setLoading(false);
        return;
      }

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'booking',
        title: 'Резервация изпратена',
        message: `Вашата резервация за ${formData.petName} е получена успешно!`,
        action_url: '/dashboard',
      });

      setIsSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Възникна грешка. Моля, опитайте отново.');
      setLoading(false);
    }
  };

  const services = [
    { value: 'daily-walks', label: 'Ежедневни разходки с кучета', icon: '🐕', price: '15-25 лв' },
    { value: 'home-visits', label: 'Домашно гледане на домашни любимци', icon: '🏠', price: '20-30 лв' },
    { value: 'overnight', label: 'Нощна грижа', icon: '🌙', price: '40-60 лв' },
    { value: 'pet-taxi', label: 'Такси услуги за домашни любимци', icon: '🚗', price: '25-35 лв' },
  ];

  const petTypes = [
    { value: 'dog', label: 'Куче', icon: '🐕' },
    { value: 'cat', label: 'Котка', icon: '🐈' },
    { value: 'bird', label: 'Птица', icon: '🦜' },
    { value: 'small-mammal', label: 'Дребен бозайник', icon: '🐹' },
    { value: 'reptile', label: 'Влечуго', icon: '🦎' },
    { value: 'other', label: 'Друг', icon: '🐾' },
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 scroll-mt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-6 animate-bounce">
            <Calendar className="h-10 w-10 text-green-600" />
          </div>

          <SectionHeading
            title="Резервирайте нашите услуги"
            subtitle="Планирайте грижа за вашия пухкав приятел бързо и лесно"
            centered
          />

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Бърза резервация</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">5-звездна грижа</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">С любов</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-green-100">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PawPrint className="h-8 w-8" />
                    <div>
                      <h3 className="text-2xl font-bold">Форма за резервация</h3>
                      <p className="text-green-50">Попълнете стъпка {formStep} от 3</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{Math.round((formStep / 3) * 100)}%</div>
                    <div className="text-green-50 text-sm">завършено</div>
                  </div>
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${
                      formStep === step
                        ? 'bg-green-50 text-green-600 border-b-4 border-green-600'
                        : formStep > step
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {formStep > step && <CheckCircle className="h-5 w-5" />}
                      <span className="hidden sm:inline">
                        {step === 1 && 'Вашата информация'}
                        {step === 2 && 'Детайли за любимеца'}
                        {step === 3 && 'График'}
                      </span>
                      <span className="sm:hidden">{step}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Грешка</h4>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {formStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <User className="h-6 w-6 text-green-600" />
                        Вашата информация
                      </h3>
                      <p className="text-gray-600">Разкажете ни малко за вас</p>
                    </div>

                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Пълно име *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                          placeholder="Въведете вашето име"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Имейл адрес *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Телефонен номер *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                          placeholder="+359 888 123 456"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Напред
                        <span className="ml-2">→</span>
                      </Button>
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Heart className="h-6 w-6 text-green-600" />
                        Детайли за домашния любимец
                      </h3>
                      <p className="text-gray-600">Разкажете ни за вашия пухкав приятел</p>
                    </div>

                    <div className="group">
                      <label htmlFor="petName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Име на домашния любимец *
                      </label>
                      <input
                        type="text"
                        id="petName"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                        placeholder="Например: Макс, Луна, Бъди..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Вид домашен любимец *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {petTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-lg ${
                              formData.petType === type.value
                                ? 'border-green-500 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="petType"
                              value={type.value}
                              checked={formData.petType === type.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className="text-4xl mb-2">{type.icon}</div>
                            <div className="font-medium text-gray-700">{type.label}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Необходима услуга *
                      </label>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <label
                            key={service.value}
                            className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg ${
                              formData.service === service.value
                                ? 'border-green-500 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="service"
                              value={service.value}
                              checked={formData.service === service.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className="text-3xl">{service.icon}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{service.label}</div>
                              <div className="text-sm text-gray-500">{service.price}</div>
                            </div>
                            {formData.service === service.value && (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3"
                      >
                        ← Назад
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Напред
                        <span className="ml-2">→</span>
                      </Button>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-green-600" />
                        График и потвърждение
                      </h3>
                      <p className="text-gray-600">Изберете кога искате да започне услугата</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                          Начална дата *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                          </div>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={getMinDate()}
                            required
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                          Предпочитано време *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                          </div>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Специални инструкции (по избор)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 resize-none"
                        placeholder="Всякакви специални изисквания, алергии, поведенчески особености или друга важна информация за вашия домашен любимец..."
                      ></textarea>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-green-600" />
                        Обобщение на резервацията
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Клиент:</span>
                          <span className="font-semibold text-gray-900">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Любимец:</span>
                          <span className="font-semibold text-gray-900">{formData.petName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Услуга:</span>
                          <span className="font-semibold text-gray-900">
                            {services.find((s) => s.value === formData.service)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Дата:</span>
                          <span className="font-semibold text-gray-900">
                            {formData.date ? new Date(formData.date).toLocaleDateString('bg-BG') : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Час:</span>
                          <span className="font-semibold text-gray-900">{formData.time || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3"
                      >
                        ← Назад
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            Изпращане...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Резервирай сега
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fadeIn border-2 border-green-200">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="h-14 w-14 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                🎉 Резервацията е успешна!
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                Благодарим ви, че избрахте CozyPets by Alice!
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  Ще се свържем с вас в рамките на <strong className="text-green-600">2 часа</strong>,
                  за да потвърдим резервацията и да обсъдим допълнителни детайли.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                  <Mail className="h-5 w-5" />
                  <span>
                    Имейл за потвърждение е изпратен на <strong>{formData.email}</strong>
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormStep(1);
                    setFormData({
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      petName: '',
                      petType: 'dog',
                      service: 'daily-walks',
                      date: '',
                      time: '',
                      notes: '',
                    });
                  }}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Нова резервация
                </Button>
                <Button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Към моите резервации
                </Button>
              </div>
            </div>
          )}

          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-fadeIn">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Необходима е регистрация</h3>
                <p className="text-gray-600 mb-6">
                  За да направите резервация, моля влезте в акаунта си или се регистрирайте безплатно.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1"
                  >
                    Отказ
                  </Button>
                  <Button
                    onClick={() => (window.location.href = '/#')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    Вход / Регистрация
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Booking;