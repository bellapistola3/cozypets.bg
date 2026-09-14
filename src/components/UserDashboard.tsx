import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  MessageCircle,
  Heart,
  Settings,
  CreditCard,
  PlusCircle,
  Star,
  Briefcase,
  X,
  TrendingUp,
  ShieldCheck,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  UserCheck,
  DollarSign,
  Camera,
  Search,
  Upload,
  Loader2
} from 'lucide-react';
import { Pet } from '../types';
import Button from './common/Button';
import BecomeASitter from './BecomeASitter';
import ReviewForm from './ReviewForm';
import { useAuth } from '../contexts/AuthContext';
import CozyMascot from './mascots/CozyMascot';

interface Booking {
  id: string;
  userId: string;
  sitterId: string;
  petId: string;
  serviceType: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  platformFee: number;
  reservationFee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'in-progress' | 'cancelled';
  specialInstructions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [viewMode, setViewMode] = useState<'owner' | 'sitter'>('owner');

  useEffect(() => {
    if (user?.role === 'sitter') {
      setViewMode('sitter');
      setActiveTab('sitter-settings');
    }
  }, [user?.role]);
  const [showBecomeASitter, setShowBecomeASitter] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Profile photo upload state
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sitter dashboard states
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [rate24h, setRate24h] = useState(45);
  const [acceptSmallDogs, setAcceptSmallDogs] = useState(true);
  const [acceptLargeDogs, setAcceptLargeDogs] = useState(true);
  const [acceptCats, setAcceptCats] = useState(true);

  // Mock data
  const mockBookings: Booking[] = [
    {
      id: '1',
      userId: 'user1',
      sitterId: 'sitter1',
      petId: 'pet1',
      serviceType: 'daily-walks',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-15'),
      totalAmount: 180,
      platformFee: 36,
      reservationFee: 15,
      status: 'confirmed',
      specialInstructions: 'Макс обича игра с топка в парка сутрин.',
      emergencyContact: {
        name: 'Иван Петров',
        phone: '+359888123456',
      },
      createdAt: new Date('2026-09-01'),
      updatedAt: new Date('2026-09-01'),
    },
    {
      id: '2',
      userId: 'user1',
      sitterId: 'sitter2',
      petId: 'pet2',
      serviceType: 'home-visits',
      startDate: new Date('2026-08-20'),
      endDate: new Date('2026-08-25'),
      totalAmount: 220,
      platformFee: 44,
      reservationFee: 20,
      status: 'completed',
      specialInstructions: 'Луна обича спокойна музика и лакомства.',
      emergencyContact: {
        name: 'Мария Иванова',
        phone: '+359888654321',
      },
      createdAt: new Date('2026-08-15'),
      updatedAt: new Date('2026-08-25'),
    },
  ];

  const mockPets: Pet[] = [
    {
      pet_id: 1,
      user_id: 1,
      name: 'Макс',
      breed: 'Голдън Ретривър',
      age: 3,
      health_status: 'Здрав, всички ваксини са актуални',
      photo_url: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      pet_id: 2,
      user_id: 1,
      name: 'Луна',
      breed: 'Персийска Котка',
      age: 2,
      health_status: 'Отлично здраве',
      photo_url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      created_at: new Date(),
      updated_at: new Date(),
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
      'overnight': 'Нощна грижа (Хотел)',
      'pet-taxi': 'Такси за домашни любимци',
      'grooming': 'Груминг & Козметика',
    };
    return labels[service] || service;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setPhotoError('Моля, изберете изображение (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Снимката трябва да е под 5MB.');
      return;
    }

    setPhotoError('');
    setPhotoUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `profile-photos/${user.id}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setPhotoError('Грешка при качване. Опитайте пак.');
          setPhotoUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfilePhotoUrl(downloadURL);
          setPhotoUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setPhotoError('Грешка при качване. Опитайте пак.');
      setPhotoUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50 py-10 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1550px]">
        
        {/* TOP DASHBOARD HERO CARD */}
        <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 rounded-3xl p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {/* Clickable Profile Photo Avatar */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-inner relative focus:outline-none focus:ring-2 focus:ring-white"
                  title="Смени профилна снимка"
                >
                  {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt="Профилна снимка" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-3xl text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {photoUploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-white" />
                        <span className="text-white text-[10px] font-bold mt-1">Смени</span>
                      </>
                    )}
                  </div>
                </button>
                {/* Upload progress */}
                {photoUploading && (
                  <div className="absolute -bottom-3 left-0 right-0">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black">{user?.name || 'Елена Димитрова'}</h1>
                  <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Проверен Профил 🐾
                  </span>
                </div>
                <p className="text-emerald-100 text-sm font-medium">Добре дошли във вашия уютен CozyPets панел! • София, България</p>
                {photoError && <p className="text-rose-200 text-xs font-bold mt-1 bg-rose-900/40 px-2.5 py-1 rounded-lg border border-rose-400/30">{photoError}</p>}
              </div>
            </div>

            {/* Cozy Mascot Greeting */}
            <div className="hidden xl:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <CozyMascot variant="waving" size="small" />
              <div className="text-left text-xs font-bold text-emerald-100">
                <span className="text-white font-extrabold block">Алис казва:</span>
                Радвам се да ви видя отново! 🐶
              </div>
            </div>

            {/* VIEW MODE TOGGLE (Owner View vs Sitter Dashboard) */}
            <div className="flex items-center bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
              <button
                onClick={() => setViewMode('owner')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'owner' ? 'bg-white text-emerald-800 shadow-lg scale-105' : 'text-white/80 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" /> Стопанин
              </button>
              <button
                onClick={() => setViewMode('sitter')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'sitter' ? 'bg-white text-emerald-800 shadow-lg scale-105' : 'text-white/80 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Моето Табло на Гледач
              </button>
            </div>
          </div>

          {/* KEY METRICS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Резервации</div>
              <div className="text-3xl font-black mt-1">12</div>
              <div className="text-xs text-emerald-300 mt-0.5">2 активни този месец</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Домашни Любимци</div>
              <div className="text-3xl font-black mt-1">{mockPets.length}</div>
              <div className="text-xs text-emerald-300 mt-0.5">Макс & Луна</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
                {viewMode === 'sitter' ? 'Обща Печалба' : 'Общо Инвестирано'}
              </div>
              <div className="text-3xl font-black mt-1">400 лв.</div>
              <div className="text-xs text-emerald-300 mt-0.5">100% Защитено с Ескроу</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Среден Рейтинг</div>
              <div className="text-3xl font-black mt-1 flex items-center gap-1">
                4.9 <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 inline" />
              </div>
              <div className="text-xs text-emerald-300 mt-0.5">24 Отзива</div>
            </div>
          </div>
        </div>

        {/* DASHBOARD LAYOUT */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100 sticky top-28">
              
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
                {viewMode === 'owner' ? 'Меню на Стопанина' : 'Меню на Ситъра'}
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl font-bold transition-all duration-200 ${
                    activeTab === 'bookings'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    Резервации
                  </span>
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-black">2</span>
                </button>

                {viewMode === 'owner' && (
                  <button
                    onClick={() => setActiveTab('pets')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl font-bold transition-all duration-200 ${
                      activeTab === 'pets'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="h-5 w-5" />
                      Моите Любимци
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-black">2</span>
                  </button>
                )}

                {viewMode === 'sitter' && (
                  <button
                    onClick={() => setActiveTab('sitter-settings')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl font-bold transition-all duration-200 ${
                      activeTab === 'sitter-settings'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      Цени & Услуги Ситър
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl font-bold transition-all duration-200 ${
                    activeTab === 'messages'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5" />
                    Съобщения
                  </span>
                  <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-black">Ново</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl font-bold transition-all duration-200 ${
                    activeTab === 'payments'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    Плащания
                  </span>
                </button>

                <button
                  onClick={() => setShowBecomeASitter(true)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-200 mt-4 border border-purple-200"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Стани Гледач
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">

            {/* SITTER DASHBOARD VIEW */}
            {viewMode === 'sitter' && activeTab === 'sitter-settings' && (
              <div className="space-y-6">
                
                {/* SITTER LIVE AVAILABILITY CONTROL */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-5">
                      <div className="relative group">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-md relative focus:outline-none"
                        >
                          {profilePhotoUrl ? (
                            <img src={profilePhotoUrl} alt="Снимка на гледача" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-black text-2xl">
                              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                        </button>
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900">Профил на Гледач</h2>
                        <p className="text-xs text-gray-600 font-medium">Кликнете върху снимката, за да я промените</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          <Upload className="w-3.5 h-3.5" /> Смени профилна снимка на гледач
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-sm">
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Статус: Достъпен Днес</span>
                      <button
                        onClick={() => setIsAvailableToday(!isAvailableToday)}
                        className={`w-12 h-6 rounded-full transition-colors p-1 ${isAvailableToday ? 'bg-emerald-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAvailableToday ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>

                  {/* PRICING & REVENUE WIDGET */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200">
                      <label className="text-xs font-black text-emerald-800 uppercase tracking-wider">Цена за 24ч (Дневна)</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          value={rate24h}
                          onChange={(e) => setRate24h(Number(e.target.value))}
                          className="w-24 p-2 font-black text-2xl text-gray-900 border-2 border-emerald-300 rounded-xl"
                        />
                        <span className="font-bold text-gray-700 text-lg">лв. / ден</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-2xl border-2 border-blue-200">
                      <label className="text-xs font-black text-blue-800 uppercase tracking-wider">Чиста ваша печалба (75%)</label>
                      <div className="text-3xl font-black text-blue-900 mt-2">
                        {(rate24h * 0.75).toFixed(2)} лв.
                      </div>
                      <div className="text-xs text-blue-700 mt-1">След 25% платформина комисионна</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                      <label className="text-xs font-black text-purple-800 uppercase tracking-wider">Верификация</label>
                      <div className="flex items-center gap-2 mt-2 text-purple-900 font-bold text-lg">
                        <ShieldCheck className="w-6 h-6 text-purple-600" /> PRO Ситър
                      </div>
                      <div className="text-xs text-purple-700 mt-1">Всички документи са потвърдени</div>
                    </div>
                  </div>

                  {/* PET PREFERENCES TOGGLES */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Какви домашни любимци приемате?</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setAcceptSmallDogs(!acceptSmallDogs)}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                          acceptSmallDogs ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> Малки кучета (&lt;10 кг)
                      </button>

                      <button
                        onClick={() => setAcceptLargeDogs(!acceptLargeDogs)}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                          acceptLargeDogs ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> Големи кучета (&gt;10 кг)
                      </button>

                      <button
                        onClick={() => setAcceptCats(!acceptCats)}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                          acceptCats ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> Котки
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="py-3 px-8 font-black text-base bg-emerald-600 hover:bg-emerald-700 shadow-xl">
                      Запази Настройките на Гледач
                    </Button>
                  </div>

                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-emerald-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Моите Резервации</h2>
                    <p className="text-gray-600 text-sm">Управление и статистика на вашите текущи иминали услуги</p>
                  </div>
                  <Button href="/search" className="py-2.5 px-5 font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center gap-2 text-sm">
                    <PlusCircle className="h-4 w-4" />
                    Нова резервация
                  </Button>
                </div>

                {/* Table Filters & Stats */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    <span className="text-xs font-bold text-gray-500 uppercase px-2">Филтър:</span>
                    <button className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-sm">Всички (2)</button>
                    <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-white transition-colors">Потвърдени (1)</button>
                    <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-white transition-colors">Завършени (1)</button>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Търси по име или услуга..."
                      className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Modern Data Table */}
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-100/80 text-xs font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-4">Услуга</th>
                        <th className="px-5 py-4">Гледач</th>
                        <th className="px-5 py-4">Любимец</th>
                        <th className="px-5 py-4">Дати</th>
                        <th className="px-5 py-4">Сума</th>
                        <th className="px-5 py-4">Статус</th>
                        <th className="px-5 py-4 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {mockBookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                              {getServiceLabel(booking.serviceType)}
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <img
                                src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg"
                                alt="Мария Петкова"
                                className="w-8 h-8 rounded-full object-cover border border-emerald-400"
                              />
                              <div>
                                <div className="font-bold text-gray-900 text-xs">Мария Петкова</div>
                                <div className="text-[11px] text-gray-400">София, Център</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-bold">
                              Макс (Голдън)
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              {booking.startDate.toLocaleDateString('bg-BG')} - {booking.endDate.toLocaleDateString('bg-BG')}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-black text-emerald-700 text-base whitespace-nowrap">
                            {booking.totalAmount} лв.
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" /> Чат
                              </button>
                              {booking.status === 'completed' && (
                                <button
                                  onClick={() => setReviewBooking(booking)}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                                >
                                  <Star className="w-3.5 h-3.5" /> Отзив
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PETS TAB */}
            {activeTab === 'pets' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Моите Любимци</h2>
                    <p className="text-gray-600 text-sm">Профили и здравен дневник на вашите животни</p>
                  </div>
                  <Button className="py-3 px-6 font-bold shadow-lg">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Добави любимец
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockPets.map(pet => (
                    <div key={pet.pet_id} className="border-2 border-gray-100 hover:border-emerald-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl bg-white">
                      <div className="flex items-start gap-5">
                        {pet.photo_url && (
                          <img
                            src={pet.photo_url}
                            alt={pet.name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-200 shadow-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-black text-xl text-gray-900 mb-1">{pet.name}</h3>
                          <p className="text-emerald-700 font-bold text-sm mb-3">{pet.breed}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                              {pet.age} години
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                              {pet.health_status}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" className="text-xs py-2 px-4 font-bold border-2">
                              Редактирай
                            </Button>
                            <Button className="text-xs py-2 px-4 font-bold">
                              Здравен дневник
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Чат Съобщения</h2>
                <p className="text-gray-600 text-sm mb-6">Директна връзка с вашите гледачи и ветеринари</p>

                <div className="space-y-4">
                  <div className="border-2 border-gray-100 hover:border-emerald-300 rounded-2xl p-5 hover:bg-emerald-50/40 cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg"
                        alt="Мария Петкова"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-black text-gray-900 text-base">Мария Петкова (Гледач)</h4>
                          <span className="text-xs font-bold text-gray-400">10:15 ч.</span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Макс харесва новата разходка! Изпращам ви снимка...</p>
                      </div>
                      <div className="w-3.5 h-3.5 bg-emerald-600 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                <h2 className="text-2xl font-black text-gray-900 mb-2">История на Плащанията</h2>
                <p className="text-gray-600 text-sm mb-6">Безопасни транзакции чрез Ескроу гаранция</p>

                <div className="space-y-4">
                  <div className="border-2 border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">Плащане за Ежедневни разходки</div>
                      <div className="text-xs text-gray-500">15 Септември 2026 • Карта **** 4821</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-600 text-lg">180.00 лв.</div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">Успешно</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {showBecomeASitter && (
        <BecomeASitter onClose={() => setShowBecomeASitter(false)} />
      )}

      {reviewBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen py-8 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full relative">
              <button
                onClick={() => setReviewBooking(null)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-xl hover:bg-gray-100 transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>
              <ReviewForm
                reservationId={reviewBooking.id}
                sitterId={reviewBooking.sitterId}
                sitterName="Мария Петкова"
                onSuccess={() => {
                  setReviewBooking(null);
                  alert('Отзивът ви беше изпратен успешно!');
                }}
                onCancel={() => setReviewBooking(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;