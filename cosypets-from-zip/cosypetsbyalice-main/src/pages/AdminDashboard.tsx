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
import { db } from '../lib/firebase';
import { authHelpers } from '../lib/auth';
import { collection, query, getDocs, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin, loading: authLoading, user } = useAdminAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check admin authentication with Firebase
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
            setLoading(true);
            // Load payments with status 'pending' or 'held' (Firebase names might differ, using 'pending')
            const paymentsRef = collection(db, 'payments');
            const qPayments = query(paymentsRef, orderBy('created_at', 'desc'));
            const paymentsSnap = await getDocs(qPayments);
            const paymentsData = paymentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter for held payments on client side if necessary, or use where()
            setPayments(paymentsData.filter((p: any) => p.paymentStatus === 'pending' || p.paymentStatus === 'held'));

            // Load all users
            const usersRef = collection(db, 'users');
            const qUsers = query(usersRef, orderBy('created_at', 'desc'), limit(50));
            const usersSnap = await getDocs(qUsers);
            const usersData = usersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setUsers(usersData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authHelpers.signOut();
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

            // Update payment in Firestore
            const paymentRef = doc(db, 'payments', paymentId);
            await updateDoc(paymentRef, {
                paymentStatus: 'completed',
                released_at: now
            });

            // Update reservation
            const reservationRef = doc(db, 'reservations', reservationId);
            await updateDoc(reservationRef, {
                payment_released: true,
                status: 'completed'
            });

            alert('Плащането е пуснато успешно!');
            loadData();
        } catch (error: any) {
            alert('Грешка: ' + error.message);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-medium text-green-600 animate-pulse">Зареждане...</div>
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
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="Logo" className="h-8" onError={(e) => (e.target as any).style.display = 'none'} />
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Изход
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{payments.length}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <DollarSign className="h-8 w-8 text-yellow-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Held Amount</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)} лв
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CreditCard className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Задържани плащания (за одобрение)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Дата</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Сума</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Гледач</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Действие</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                            Няма активни плащания за преглед
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{payment.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {payment.created_at?.seconds
                                                    ? new Date(payment.created_at.seconds * 1000).toLocaleDateString('bg-BG')
                                                    : 'Няма дата'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{payment.amount} лв</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{payment.sitterId?.slice(0, 8) || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => releasePayment(payment.id, payment.reservationId)}
                                                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Одобри
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
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Списък Потребители</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Име</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Имейл</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Роля</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Създаден на</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{user.full_name || user.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.email}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'sitter' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {user.role || 'owner'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.created_at?.seconds
                                                ? new Date(user.created_at.seconds * 1000).toLocaleDateString('bg-BG')
                                                : 'N/A'}
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
