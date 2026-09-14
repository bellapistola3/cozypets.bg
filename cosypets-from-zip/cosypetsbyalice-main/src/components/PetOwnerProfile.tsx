import React, { useState } from 'react';
import { Plus, Edit, Trash2, Camera, Star, MapPin, Calendar } from 'lucide-react';
import { Pet, Review } from '../types';
import Button from './common/Button';

interface PetOwnerProfileProps {
  userId: string;
}

const PetOwnerProfile: React.FC<PetOwnerProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('pets');
  const [showAddPet, setShowAddPet] = useState(false);

  // Mock data
  const ownerInfo = {
    id: userId,
    firstName: 'Елена',
    lastName: 'Димитрова',
    email: 'elena@example.com',
    phone: '+359888123456',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    location: 'София, България',
    memberSince: new Date('2023-01-15'),
    totalBookings: 12,
    averageRating: 4.8,
  };

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
      temperament: ['Дружелюбен', 'Енергичен', 'Послушен'],
      medicalInfo: 'Алергичен към пилешко месо',
      specialNeeds: 'Нуждае се от ежедневни разходки поне 2 часа',
      emergencyVet: {
        name: 'Ветеринарна клиника София',
        phone: '+359888123456',
        address: 'ул. Витоша 1, София',
      },
    },
    {
      id: '2',
      name: 'Луна',
      type: 'cat',
      breed: 'Персийска котка',
      age: 2,
      weight: 4,
      photos: ['https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg'],
      vaccinated: true,
      spayedNeutered: true,
      microchipped: true,
      temperament: ['Спокойна', 'Независима'],
      medicalInfo: 'Здрава',
      specialNeeds: 'Обича тихи места',
      emergencyVet: {
        name: 'Ветеринарна клиника София',
        phone: '+359888123456',
        address: 'ул. Витоша 1, София',
      },
    },
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      userId: userId,
      userName: 'Елена Димитрова',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rating: 5,
      comment: 'Мария беше невероятна с Макс! Той се върна щастлив и уморен. Определено ще резервираме отново.',
      createdAt: new Date('2024-01-15'),
      petName: 'Макс',
      petType: 'dog',
      serviceType: 'daily-walks',
    },
  ];

  const getPetTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'dog': 'Куче',
      'cat': 'Котка',
      'bird': 'Птица',
      'small-mammal': 'Дребен бозайник',
      'reptile': 'Влечуго',
      'other': 'Друг',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={ownerInfo.avatar}
                alt={`${ownerInfo.firstName} ${ownerInfo.lastName}`}
                className="w-32 h-32 rounded-full object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ownerInfo.firstName} {ownerInfo.lastName}
              </h1>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{ownerInfo.location}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Член от {ownerInfo.memberSince.toLocaleDateString('bg-BG')}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{ownerInfo.totalBookings}</div>
                  <div className="text-sm text-gray-600">Резервации</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{mockPets.length}</div>
                  <div className="text-sm text-gray-600">Домашни любимци</div>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-2xl font-bold text-green-600">{ownerInfo.averageRating}</span>
                  </div>
                  <div className="text-sm text-gray-600">Рейтинг</div>
                </div>
              </div>
            </div>
            
            <Button>
              <Edit className="h-5 w-5 mr-2" />
              Редактирай профил
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('pets')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'pets'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Моите домашни любимци
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Моите отзиви
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Предпочитания
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Pets Tab */}
            {activeTab === 'pets' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Моите домашни любимци</h2>
                  <Button onClick={() => setShowAddPet(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Добави домашен любимец
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockPets.map(pet => (
                    <div key={pet.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex gap-2">
                          <button className="text-gray-600 hover:text-green-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{pet.name}</h3>
                      <p className="text-gray-600 mb-2">{pet.breed}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Вид:</span>
                          <span className="ml-2 font-medium">{getPetTypeLabel(pet.type)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Възраст:</span>
                          <span className="ml-2 font-medium">{pet.age} г.</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Тегло:</span>
                          <span className="ml-2 font-medium">{pet.weight} кг</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pet.vaccinated && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            Ваксиниран
                          </span>
                        )}
                        {pet.spayedNeutered && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            Кастриран
                          </span>
                        )}
                        {pet.microchipped && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Чипиран
                          </span>
                        )}
                      </div>
                      
                      {pet.temperament && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Темперамент:</p>
                          <div className="flex flex-wrap gap-1">
                            {pet.temperament.map((trait, index) => (
                              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {pet.medicalInfo && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">Медицинска информация:</p>
                          <p className="text-sm text-gray-800">{pet.medicalInfo}</p>
                        </div>
                      )}
                      
                      {pet.specialNeeds && (
                        <div>
                          <p className="text-sm text-gray-600">Специални нужди:</p>
                          <p className="text-sm text-gray-800">{pet.specialNeeds}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Моите отзиви за гледачи</h2>
                
                <div className="space-y-6">
                  {mockReviews.map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Отзив за услуга: {review.serviceType === 'daily-walks' ? 'Разходки' : review.serviceType}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            За {review.petName} • {review.createdAt.toLocaleDateString('bg-BG')}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Предпочитания</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Предпочитани услуги</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Ежедневни разходки</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Домашно гледане</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Нощна грижа</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Такси услуги</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Ценови диапазон</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Минимална цена (лв.)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Максимална цена (лв.)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Известия</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Известия за нови съобщения</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Напомняния за резервации</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Промоционални оферти</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Напомняния за отзиви</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button>
                    Запази предпочитанията
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

export default PetOwnerProfile;