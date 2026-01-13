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
import { supabase } from '../lib/supabase';
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        <LogOut className="h-5 w-5" />
                        Изход
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Задържани плащания</p>
                                <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
                            </div>
                            <DollarSign className="h-12 w-12 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Общо потребители</p>
                                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <Users className="h-12 w-12 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Общо сума (задържана)</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)} лв
                                </p>
                            </div>
                            <CreditCard className="h-12 w-12 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Задържани плащания (за одобрение)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Резервация</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сума</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Комисионна (25%)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">За гледача</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Няма задържани плащания
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{payment.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{payment.reservation_id?.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.amount} лв</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{payment.platform_fee} лв</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-green-600">{payment.sitter_amount} лв</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => releasePayment(payment.id, payment.reservation_id)}
                                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Пусни плащане
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
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Потребители</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Име</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имейл</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Създаден</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.full_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('bg-BG')}
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
