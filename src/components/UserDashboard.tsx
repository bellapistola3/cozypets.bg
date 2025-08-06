import React, { useState } from 'react';
import { 
  Calendar, 
  MessageCircle, 
  Heart, 
  Settings, 
  CreditCard,
  Bell,
  User,
  PlusCircle,
  Star,
  Clock,
  MapPin,
  Briefcase
} from 'lucide-react';
import { Booking, Pet, Message } from '../types';
import Button from './common/Button';
import BecomeASitter from './BecomeASitter';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [showBecomeASitter, setShowBecomeASitter] = useState(false);
  const { user } = useAuth();

  // Mock data
  const mockBookings: Booking[] = [
    {
      id: '1',
      userId: 'user1',
      sitterId: 'sitter1',
      petId: 'pet1',
      serviceType: 'daily-walks',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-25'),
      totalAmount: 150,
      platformFee: 37.5,
      reservationFee: 15,
      status: 'confirmed',
      specialInstructions: 'Макс обича да си играе в парка',
      emergencyContact: {
        name: 'Иван Петров',
        phone: '+359888123456',
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Потвърдена';
      case 'pending': return 'Чакаща';
      case 'in-progress': return 'В ход';
      case 'completed': return 'Завършена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  const getServiceLabel = (service: string) => {
    const labels: { [key: string]: string } = {
      'daily-walks': 'Ежедневни разходки',
      'home-visits': 'Домашно гледане',
      'overnight': 'Нощна грижа',
      'pet-taxi': 'Такси за домашни любимци',
      'grooming': 'Груминг',
    };
    return labels[service] || service;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Моят профил</h1>
          <p className="text-gray-600">Управлявайте резервациите и профила си</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                  alt="Профилна снимка"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900">Елена Димитрова</h3>
                <p className="text-gray-600 text-sm">elena@example.com</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'bookings' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Резервации
                </button>
                
                <button
                  onClick={() => setActiveTab('pets')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'pets' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Моите любимци
                </button>
                
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'messages' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Съобщения
                </button>
                
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'favorites' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Любими гледачи
                </button>
                
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'payments' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Плащания
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Настройки
                </button>
                
                <button
                  onClick={() => setShowBecomeASitter(true)}
                  className="w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  Стани гледач
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Моите резервации</h2>
                  <Button href="/search">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Нова резервация
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockBookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {getServiceLabel(booking.serviceType)}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {booking.startDate.toLocaleDateString('bg-BG')} - {booking.endDate.toLocaleDateString('bg-BG')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Гледач</p>
                          <div className="flex items-center">
                            <img
                              src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg"
                              alt="Мария Петкова"
                              className="w-8 h-8 rounded-full mr-2 object-cover"
                            />
                            <span className="font-medium">Мария Петкова</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Домашен любимец</p>
                          <p className="font-medium">Макс</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Обща сума</p>
                          <p className="font-bold text-green-600">{booking.totalAmount} лв.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="text-sm py-2 px-4">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Съобщение
                          </Button>
                          <Button className="text-sm py-2 px-4">
                            Детайли
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pets Tab */}
            {activeTab === 'pets' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Моите домашни любимци</h2>
                  <Button>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Добави любимец
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockPets.map(pet => (
                    <div key={pet.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{pet.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{pet.breed}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {pet.age} години
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              {pet.weight} кг
                            </span>
                            {pet.vaccinated && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                Ваксиниран
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="text-sm py-1 px-3">
                              Редактирай
                            </Button>
                            <Button className="text-sm py-1 px-3">
                              Детайли
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Съобщения</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg"
                        alt="Мария Петкова"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900">Мария Петкова</h4>
                          <span className="text-sm text-gray-500">10:15</span>
                        </div>
                        <p className="text-gray-600 text-sm">Благодаря за информацията! Звучи чудесно...</p>
                      </div>
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Любими гледачи</h2>
                <p className="text-gray-600">Все още нямате любими гледачи.</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Плащания</h2>
                <p className="text-gray-600">История на плащанията ще се появи тук.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки</h2>
                <p className="text-gray-600">Настройки на профила и известията.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showBecomeASitter && (
        <BecomeASitter onClose={() => setShowBecomeASitter(false)} />
      )}
    </div>
  );
};

export default UserDashboard;