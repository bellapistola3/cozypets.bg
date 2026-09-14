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
  AlertCircle,
  ShieldCheck,
  Award,
  Sparkles,
  Lock,
  RefreshCw
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
      alert('Потребителят е блокиран успешно');
    } catch (error) {
      alert('Грешка при блокиране на потребител');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await adminService.unbanUser(userId);
      await loadDashboardData();
      alert('Потребителят е деблокиран успешно');
    } catch (error) {
      alert('Грешка при деблокиране на потребител');
    }
  };

  const handleUpdateReservationStatus = async (reservationId: string, status: string) => {
    try {
      await adminService.updateReservationStatus(reservationId, status);
      await loadDashboardData();
      alert('Статусът на резервацията е обновен');
    } catch (error) {
      alert('Грешка при обновяване на статуса');
    }
  };

  const handleReleasePayment = async (paymentId: string) => {
    try {
      await adminService.releasePayment(paymentId);
      await loadDashboardData();
      alert('Ескроу плащането е освободено към гледача!');
    } catch (error) {
      alert('Грешка при освобождаване на плащането');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950 text-gray-100 py-10 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        
        {/* EXECUTIVE HEADER */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-emerald-900 rounded-3xl p-8 shadow-2xl mb-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center font-black text-2xl text-white shadow-lg">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  Административен Контролен Център
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-bold uppercase tracking-wider">
                    Super Admin
                  </span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Пълен контрол върху резервации, потребители, плащания и ескроу</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 bg-slate-900 border border-white/20 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="7">Последните 7 дни</option>
                <option value="30">Последните 30 дни</option>
                <option value="90">Последните 90 дни</option>
                <option value="365">Последната година</option>
              </select>

              <Button onClick={loadDashboardData} className="py-2.5 px-5 font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" />
                Обнови Данните
              </Button>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-2 mb-8 border border-white/10 shadow-xl">
          <nav className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: '📊 Общ Преглед' },
              { id: 'bookings', label: '📅 Резервации' },
              { id: 'users', label: '👥 Потребители' },
              { id: 'payments', label: '💳 Плащания & Ескроу' },
              { id: 'chat-approvals', label: '💬 Чат Модерация' },
              { id: 'reports', label: '📑 Отчети' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 rounded-2xl font-black text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-900/50 scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && !loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Общо Потребители</p>
                    <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30 text-blue-400">
                    <Users className="h-7 w-7" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Активни Гледачи</p>
                    <p className="text-3xl font-black text-white mt-1">{stats.totalSitters}</p>
                  </div>
                  <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/30 text-emerald-400">
                    <Users className="h-7 w-7" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Общо Резервации</p>
                    <p className="text-3xl font-black text-white mt-1">{stats.totalReservations}</p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-2xl border border-purple-500/30 text-purple-400">
                    <Calendar className="h-7 w-7" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Платформени Печалби</p>
                    <p className="text-3xl font-black text-emerald-400 mt-1">{stats.platformEarnings.toFixed(2)} лв.</p>
                  </div>
                  <div className="bg-green-500/20 p-4 rounded-2xl border border-green-500/30 text-green-400">
                    <DollarSign className="h-7 w-7" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && !loading && (
          <div className="bg-slate-800/90 rounded-3xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-6">Управление на Резервации</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4">Собственик</th>
                    <th className="py-4 px-4">Гледач</th>
                    <th className="py-4 px-4">Услуга</th>
                    <th className="py-4 px-4">Сума</th>
                    <th className="py-4 px-4">Статус</th>
                    <th className="py-4 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-sm">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-gray-400">{res.id.slice(0, 8)}...</td>
                      <td className="py-4 px-4 font-bold text-white">{res.owner_name}</td>
                      <td className="py-4 px-4 font-bold text-white">{res.sitter_name}</td>
                      <td className="py-4 px-4 text-emerald-400">{res.service_type}</td>
                      <td className="py-4 px-4 font-black text-white">{res.total_price.toFixed(2)} лв.</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${getStatusColor(res.status)}`}>
                          {getStatusLabel(res.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-xl transition-colors"
                        >
                          Завърши
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS & ESCROW TAB */}
        {activeTab === 'payments' && !loading && (
          <div className="bg-slate-800/90 rounded-3xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-6">Управление на Ескроу & Плащания</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4">Обща Сума</th>
                    <th className="py-4 px-4">Платформа Такса</th>
                    <th className="py-4 px-4">Към Гледача</th>
                    <th className="py-4 px-4">Статус Плащане</th>
                    <th className="py-4 px-4">Ескроу Статус</th>
                    <th className="py-4 px-4">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-sm">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-gray-400">{p.id.slice(0, 8)}...</td>
                      <td className="py-4 px-4 font-black text-white">{p.amount.toFixed(2)} лв.</td>
                      <td className="py-4 px-4 text-emerald-400 font-bold">{p.platform_fee.toFixed(2)} лв.</td>
                      <td className="py-4 px-4 text-blue-400 font-bold">{p.sitter_amount.toFixed(2)} лв.</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          p.escrow_status === 'released' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {p.escrow_status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {p.escrow_status === 'held' && (
                          <button
                            onClick={() => handleReleasePayment(p.id)}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs py-1.5 px-4 rounded-xl shadow-lg transition-all"
                          >
                            Освободи Ескроу
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CHAT APPROVALS TAB */}
        {activeTab === 'chat-approvals' && (
          <div className="bg-slate-800/90 rounded-3xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-6">Одобрения на Чатове & Контакти</h2>
            <ChatApprovalAdmin />
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;