import React, { useState, useEffect } from 'react';
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
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Button from './common/Button';
import ChatApprovalAdmin from './ChatApprovalAdmin';
import { adminService, AdminStats, UserManagement, ReservationManagement, PaymentManagement } from '../lib/adminService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [reservations, setReservations] = useState<ReservationManagement[]>([]);
  const [payments, setPayments] = useState<PaymentManagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const statsData = await adminService.getStatistics();
      setStats(statsData);

      if (activeTab === 'users') {
        const usersData = await adminService.getAllUsers();
        setUsers(usersData);
      } else if (activeTab === 'bookings') {
        const reservationsData = await adminService.getAllReservations();
        setReservations(reservationsData);
      } else if (activeTab === 'payments') {
        const paymentsData = await adminService.getAllPayments();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await adminService.banUser(userId);
      await loadDashboardData();
      alert('User banned successfully');
    } catch (error) {
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await adminService.unbanUser(userId);
      await loadDashboardData();
      alert('User unbanned successfully');
    } catch (error) {
      alert('Failed to unban user');
    }
  };

  const handleUpdateReservationStatus = async (reservationId: string, status: string) => {
    try {
      await adminService.updateReservationStatus(reservationId, status);
      await loadDashboardData();
      alert('Reservation status updated');
    } catch (error) {
      alert('Failed to update reservation status');
    }
  };

  const handleReleasePayment = async (paymentId: string) => {
    try {
      await adminService.releasePayment(paymentId);
      await loadDashboardData();
      alert('Payment released successfully');
    } catch (error) {
      alert('Failed to release payment');
    }
  };

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
              <button
                onClick={() => setActiveTab('chat-approvals')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'chat-approvals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Chat Одобрения
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Плащания
              </button>
            </nav>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && !loading && (
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
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Общо резервации</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalReservations}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Общи приходи</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} лв.</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Platform печалби</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.platformEarnings.toFixed(2)} лв.</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Изчакващи изплащания</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingPayouts.toFixed(2)} лв.</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Активни абонаменти</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Завършени резервации</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedReservations}</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'bookings' && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Управление на резервации</h2>
              <Button onClick={loadDashboardData}>
                <Download className="h-5 w-5 mr-2" />
                Обнови
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Собственик</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Гледач</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Услуга</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Период</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Сума</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Статус</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Chat</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm font-mono">{reservation.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4">{reservation.owner_name}</td>
                      <td className="py-3 px-4">{reservation.sitter_name}</td>
                      <td className="py-3 px-4">{reservation.service_type}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold">{reservation.total_price.toFixed(2)} лв.</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {reservation.chat_approved ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                                className="text-green-600 hover:text-green-700"
                                title="Потвърди"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                                className="text-red-600 hover:text-red-700"
                                title="Откажи"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'completed')}
                              className="text-blue-600 hover:text-blue-700"
                              title="Завърши"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reservations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Няма намерени резервации</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Управление на потребители</h2>
              <Button onClick={loadDashboardData}>
                <Download className="h-5 w-5 mr-2" />
                Обнови
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Име</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Роля</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Създаден</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Нарушения</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Статус</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm font-mono">{user.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4">{user.full_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'sitter' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.violation_count && user.violation_count > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {user.violation_count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.is_banned ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                            <Ban className="h-3 w-3" />
                            Банован
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            Активен
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {user.is_banned ? (
                            <button
                              onClick={() => handleUnbanUser(user.id)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Разбанирай
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Банирай
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Няма намерени потребители</p>
              </div>
            )}
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

        {activeTab === 'payments' && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Управление на плащания</h2>
              <Button onClick={loadDashboardData}>
                <Download className="h-5 w-5 mr-2" />
                Обнови
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Резервация</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Сума</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Platform такса</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Sitter сума</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Статус плащане</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Escrow</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm font-mono">{payment.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4 text-sm font-mono">{payment.reservation_id.slice(0, 8)}...</td>
                      <td className="py-3 px-4 font-semibold">{payment.amount.toFixed(2)} лв.</td>
                      <td className="py-3 px-4 text-green-600">{payment.platform_fee.toFixed(2)} лв.</td>
                      <td className="py-3 px-4 text-blue-600">{payment.sitter_amount.toFixed(2)} лв.</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                          payment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          payment.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.escrow_status === 'released' ? 'bg-green-100 text-green-700' :
                          payment.escrow_status === 'held' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {payment.escrow_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {payment.escrow_status === 'held' && payment.payment_status === 'completed' && (
                          <button
                            onClick={() => handleReleasePayment(payment.id)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Освободи
                          </button>
                        )}
                        {payment.released_at && (
                          <span className="text-xs text-gray-500">
                            {new Date(payment.released_at).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {payments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Няма намерени плащания</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat-approvals' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chat одобрения</h2>
            <ChatApprovalAdmin />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;