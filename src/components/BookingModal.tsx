import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, Shield, Info } from 'lucide-react';
import { Sitter, ServiceType, Pet } from '../types';
import Button from './common/Button';

interface BookingModalProps {
  sitter: Sitter;
  onClose: () => void;
  onBookingComplete: (bookingId: string) => void;
}

interface BookingForm {
  serviceType: ServiceType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  petId: string;
  specialInstructions: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ sitter, onClose, onBookingComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingForm>({
    serviceType: sitter.services[0],
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    petId: '',
    specialInstructions: '',
    emergencyContact: {
      name: '',
      phone: '',
    },
  });

  // Mock pets data
  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Макс',
      type: 'dog',
      breed: 'Голдън ретрийвър',
      age: 3,
      weight: 30,
      photos: ['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'],
      vaccinated: true,
      spayedNeutered: true,
      microchipped: true,
      temperament: ['Дружелюбен', 'Енергичен'],
      emergencyVet: {
        name: 'Ветеринарна клиника София',
        phone: '+359888123456',
        address: 'ул. Витоша 1, София',
      },
    },
  ];

  const getServiceLabel = (service: ServiceType) => {
    const labels: { [key in ServiceType]: string } = {
      'daily-walks': 'Ежедневни разходки',
      'home-visits': 'Домашно гледане',
      'overnight': 'Нощна грижа',
      'pet-taxi': 'Такси за домашни любимци',
      'grooming': 'Груминг',
    };
    return labels[service];
  };

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const servicePrice = sitter.pricing[formData.serviceType];
    const subtotal = servicePrice * days;
    const reservationFee = subtotal * 0.25; // 25% reservation fee
    const serviceFee = subtotal * 0.10; // 10% service fee
    const insurance = 15; // Fixed insurance fee
    
    return {
      subtotal,
      reservationFee,
      serviceFee,
      insurance,
      total: subtotal + reservationFee + serviceFee + insurance,
      days,
    };
  };

  const handleSubmit = async () => {
    // Simulate booking creation
    const bookingId = 'booking_' + Date.now();
    setTimeout(() => {
      onBookingComplete(bookingId);
    }, 2000);
  };

  const pricing = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Резервация при {sitter.firstName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
              </div>
            </div>

            {/* Step 1: Service & Dates */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изберете услуга
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value as ServiceType }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    {sitter.services.map(service => (
                      <option key={service} value={service}>
                        {getServiceLabel(service)} - {sitter.pricing[service]} лв.
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Начална дата
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Крайна дата
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {formData.serviceType === 'daily-walks' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Начален час
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Краен час
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!formData.startDate || !formData.endDate}
                  >
                    Напред
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Pet & Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изберете домашен любимец
                  </label>
                  <select
                    value={formData.petId}
                    onChange={(e) => setFormData(prev => ({ ...prev, petId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Изберете домашен любимец</option>
                    {mockPets.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Специални инструкции
                  </label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Споделете всякакви специални нужди, рутини или инструкции за вашия домашен любимец..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Име за спешен контакт
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон за спешен контакт
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Назад
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    disabled={!formData.petId || !formData.emergencyContact.name || !formData.emergencyContact.phone}
                  >
                    Напред
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment & Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Резюме на резервацията</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Услуга:</span>
                      <span>{getServiceLabel(formData.serviceType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Период:</span>
                      <span>{formData.startDate} - {formData.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Дни:</span>
                      <span>{pricing.days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Домашен любимец:</span>
                      <span>{mockPets.find(p => p.id === formData.petId)?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Разбивка на цената</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Цена за услугата ({pricing.days} дни)</span>
                      <span>{pricing.subtotal.toFixed(2)} лв.</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Резервационна такса (25%)</span>
                      <span>{pricing.reservationFee.toFixed(2)} лв.</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Сервизна такса (10%)</span>
                      <span>{pricing.serviceFee.toFixed(2)} лв.</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Застраховка</span>
                      <span>{pricing.insurance.toFixed(2)} лв.</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Общо</span>
                        <span className="text-green-600">{pricing.total.toFixed(2)} лв.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance Info */}
                <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Застраховка включена</p>
                    <p className="text-blue-700">
                      Покритие на ветеринарни разходи до 5,000 лв. и отговорност до 10,000 лв.
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Начин на плащане
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Кредитна/дебитна карта</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Сигурно плащане чрез Stripe. Вашите данни са защитени.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Назад
                  </Button>
                  <Button onClick={handleSubmit}>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Потвърди и плати {(pricing.subtotal + pricing.reservationFee + pricing.serviceFee).toFixed(2)} лв.
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;