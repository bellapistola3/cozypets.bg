import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    CreditCard,
    LogOut,
    DollarSign,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/firebase';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin, loading: authLoading, user } = useAdminAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check admin authentication with Supabase
        if (!authLoading) {
            if (!isAdmin || !user) {
                navigate('/admin/login');
                return;
            }
            loadData();
        }
    }, [isAdmin, authLoading, user, navigate]);

    const loadData = async () => {
        try {
            // Load payments with escrow status 'held'
            const { data: paymentsData } = await supabase
                .from('payments')
                .select('*, reservations(*, profiles(full_name), sitters:sitter_id(*))')
                .eq('escrow_status', 'held')
                .order('created_at', { ascending: false });

            setPayments(paymentsData || []);

            // Load all users
            const { data: usersData } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            setUsers(usersData || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminRole');
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const releasePayment = async (paymentId: string, reservationId: string) => {
        if (!confirm('Сигурни ли сте, че искате да пуснете това плащане?')) {
            return;
        }

        try {
            const now = new Date().toISOString();

            // Update payment
            await supabase
                .from('payments')
                .update({
                    escrow_status: 'released',
                    released_at: now
                })
                .eq('id', paymentId);

            // Update platform earnings
            await supabase
                .from('platform_earnings')
                .update({
                    status: 'paid_to_sitter',
                    paid_to_sitter_at: now
                })
                .eq('payment_id', paymentId);

            // Update reservation
            await supabase
                .from('reservations')
                .update({
                    payment_released: true
                })
                .eq('id', reservationId);

            alert('Плащането е пуснато успешно!');
            loadData();
        } catch (error: any) {
            alert('Грешка: ' + error.message);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Зареждане...</div>
            </div>
        );
    }

    if (!isAdmin || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start gap-2 max-w-md">
                    <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Няма достъп</p>
                        <p className="text-sm mt-1">Нямате администраторски права за достъп до тази страница.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 py-8">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-[1600px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/30">
                            A
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-none">Административен Панел</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">CozyPets Management Console</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-2xl font-bold text-sm transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Изход
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-[1600px]">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-emerald-800 text-xs font-black uppercase tracking-wider">Задържани плащания</p>
                                <p className="text-4xl font-black text-gray-900 mt-2">{payments.length}</p>
                                <p className="text-xs text-emerald-600 mt-1 font-semibold">Очакват административно одобрение</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                                <DollarSign className="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-blue-800 text-xs font-black uppercase tracking-wider">Регистрирани потребители</p>
                                <p className="text-4xl font-black text-gray-900 mt-2">{users.length}</p>
                                <p className="text-xs text-blue-600 mt-1 font-semibold">Общо в базата данни</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                <Users className="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-emerald-800 text-xs font-black uppercase tracking-wider">Обща задържана сума</p>
                                <p className="text-4xl font-black text-emerald-700 mt-2">
                                    {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)} лв
                                </p>
                                <p className="text-xs text-emerald-600 mt-1 font-semibold">Ескроу защита CozyPets</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                                <CreditCard className="h-7 w-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white via-amber-50/20 to-white">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Задържани Плащания (Ескроу)</h2>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">Преглед и освобождаване на средства към гледачите</p>
                        </div>
                        <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-amber-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            {payments.length} Задържани
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">ID Плащане</th>
                                    <th className="px-6 py-4">Резервация</th>
                                    <th className="px-6 py-4">Обща Сума</th>
                                    <th className="px-6 py-4">Платформа (25%)</th>
                                    <th className="px-6 py-4">За Гледача</th>
                                    <th className="px-6 py-4 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-semibold">
                                            Няма задържани плащания в момента.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-6 py-4 text-xs font-mono font-bold text-gray-700">{payment.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">{payment.reservation_id?.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 font-black text-gray-900">{payment.amount} лв</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{payment.platform_fee} лв</td>
                                            <td className="px-6 py-4 font-black text-emerald-600 text-base">{payment.sitter_amount} лв</td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => releasePayment(payment.id, payment.reservation_id)}
                                                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Пусни към гледача
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white via-blue-50/20 to-white">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Потребителски Профили</h2>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">Последно регистрирани потребители в платформата</p>
                        </div>
                        <span className="bg-blue-50 text-blue-800 font-bold text-xs px-3 py-1 rounded-full border border-blue-200">
                            {users.length} Акаунта
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Име</th>
                                    <th className="px-6 py-4">Имейл</th>
                                    <th className="px-6 py-4">Телефон</th>
                                    <th className="px-6 py-4">Роля</th>
                                    <th className="px-6 py-4 text-right">Регистриран</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {users.map((userItem) => (
                                    <tr key={userItem.id} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{userItem.full_name || userItem.name || 'Няма име'}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-emerald-700">{userItem.email}</td>
                                        <td className="px-6 py-4 text-xs text-gray-600 font-mono">{userItem.phone || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                userItem.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                userItem.role === 'sitter' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                                {userItem.role || 'owner'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                                            {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString('bg-BG') : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
