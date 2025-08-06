import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Button from './common/Button';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');

  // Mock data for statistics
  const stats = {
    totalUsers: 1247,
    totalSitters: 89,
    totalBookings: 456,
    totalRevenue: 12450,
    monthlyGrowth: 15.3,
    averageBookingValue: 85,
  };

  const recentBookings = [
    {
      id: '1',
      customerName: 'Елена Димитрова',
      sitterName: 'Мария Петкова',
      service: 'Ежедневни разходки',
      amount: 150,
      status: 'confirmed',
      date: '2024-01-20',
    },
    {
      id: '2',
      customerName: 'Иван Петров',
      sitterName: 'Георги Стоянов',
      service: 'Домашно гледане',
      amount: 280,
      status: 'completed',
      date: '2024-01-19',
    },
  ];

  const topSitters = [
    {
      id: '1',
      name: 'Мария Петкова',
      bookings: 23,
      revenue: 2340,
      rating: 4.9,
    },
    {
      id: '2',
      name: 'Георги Стоянов',
      bookings: 18,
      revenue: 1890,
      rating: 5.0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Потвърдена';
      case 'completed': return 'Завършена';
      case 'pending': return 'Чакаща';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Административен панел</h1>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="7">Последните 7 дни</option>
                <option value="30">Последните 30 дни</option>
                <option value="90">Последните 90 дни</option>
                <option value="365">Последната година</option>
              </select>
              <Button>
                <Download className="h-5 w-5 mr-2" />
                Експорт
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Общ преглед
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Резервации
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Потребители
              </button>
              <button
                onClick={() => setActiveTab('sitters')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'sitters'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Гледачи
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Отчети
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Общо потребители</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% от миналия месец</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Активни гледачи</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSitters}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8% от миналия месец</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Общо резервации</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats.monthlyGrowth}% от миналия месец</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Общи приходи</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue} лв.</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+18% от миналия месец</span>
                </div>
              </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Приходи по месеци</h3>
                <div className="h-64 bg-gradient-to-t from-green-100 to-transparent rounded-lg flex items-end justify-center">
                  <div className="text-gray-500">Графика ще бъде тук</div>
                </div>
              </div>

              {/* Top Sitters */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ гледачи</h3>
                <div className="space-y-4">
                  {topSitters.map((sitter, index) => (
                    <div key={sitter.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{sitter.name}</p>
                          <p className="text-sm text-gray-600">{sitter.bookings} резервации</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{sitter.revenue} лв.</p>
                        <p className="text-sm text-gray-600">★ {sitter.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Последни резервации</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Клиент</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Гледач</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Услуга</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Сума</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Статус</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{booking.customerName}</td>
                        <td className="py-3 px-4">{booking.sitterName}</td>
                        <td className="py-3 px-4">{booking.service}</td>
                        <td className="py-3 px-4 font-semibold">{booking.amount} лв.</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{booking.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Управление на резервации</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Търси резервации..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-5 w-5 mr-2" />
                  Филтри
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Детайлно управление на резервации ще бъде тук.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление на потребители</h2>
            <p className="text-gray-600">Управление на потребителски профили ще бъде тук.</p>
          </div>
        )}

        {activeTab === 'sitters' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление на гледачи</h2>
            <p className="text-gray-600">Управление на профили на гледачи ще бъде тук.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Отчети и анализи</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Месечен отчет</h3>
                <p className="text-gray-600 text-sm mb-4">Резервации, приходи и статистики</p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Изтегли
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Годишен отчет</h3>
                <p className="text-gray-600 text-sm mb-4">Пълна статистика за годината</p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Изтегли
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Финансов отчет</h3>
                <p className="text-gray-600 text-sm mb-4">Приходи, разходи и печалби</p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Изтегли
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;