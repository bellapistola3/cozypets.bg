import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    CreditCard,
    LogOut,
    DollarSign,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    UserCheck,
    Calendar,
    Star,
    Settings,
    BarChart3,
    FileText,
    Shield
} from 'lucide-react';
import { auth, dbHelpers } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Stats {
    totalUsers: number;
    totalSitters: number;
    totalReservations: number;
    totalRevenue: number;
}

interface TabType {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const TABS: TabType[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'users', name: 'Потребители', icon: <Users className="h-5 w-5" /> },
    { id: 'sitters', name: 'Гледачи', icon: <UserCheck className="h-5 w-5" /> },
    { id: 'bookings', name: 'Резервации', icon: <Calendar className="h-5 w-5" /> },
    { id: 'payments', name: 'Плащания', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'reviews', name: 'Отзиви', icon: <Star className="h-5 w-5" /> },
    { id: 'content', name: 'Съдържание', icon: <FileText className="h-5 w-5" /> },
];

const AdminDashboardEnhanced: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalSitters: 0,
        totalReservations: 0,
        totalRevenue: 0,
    });
    const [users, setUsers] = useState<any[]>([]);
    const [sitters, setSitters] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check if user is admin
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'methodman9090@gmail.com';
                if (user.email === adminEmail) {
                    setIsAdmin(true);
                    await loadAllData();
                } else {
                    setIsAdmin(false);
                    navigate('/');
                }
            } else {
                navigate('/admin/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const loadAllData = async () => {
        try {
            // Load stats
            const statsData = await dbHelpers.getPlatformStats();
            setStats(statsData);

            // Load users (to be implemented with proper Firebase query)
            // For now using placeholder
            setUsers([]);
            setSitters([]);
            setBookings([]);
        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-700">Зареждане на God Mode...</div>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-8 py-6 rounded-xl flex items-start gap-3 max-w-md shadow-lg">
                    <Shield className="h-8 w-8 flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-bold text-lg mb-2">🔒 Няма достъп</p>
                        <p className="text-sm">Нямате администраторски права за достъп до God Mode панела.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-xl">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <Shield className="h-8 w-8" />
                                God Mode Admin Panel
                            </h1>
                            <p className="text-green-100 mt-1">Пълен контрол над Cozy Pets платформата</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
                        >
                            <LogOut className="h-5 w-5" />
                            Изход
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-md border-b">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-1 overflow-x-auto">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-green-500 text-green-600 bg-green-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {activeTab === 'dashboard' && (
                    <DashboardTab stats={stats} />
                )}
                {activeTab === 'users' && (
                    <UsersTab users={users} onRefresh={loadAllData} />
                )}
                {activeTab === 'sitters' && (
                    <SittersTab sitters={sitters} onRefresh={loadAllData} />
                )}
                {activeTab === 'bookings' && (
                    <BookingsTab bookings={bookings} onRefresh={loadAllData} />
                )}
                {activeTab === 'payments' && (
                    <PaymentsTab onRefresh={loadAllData} />
                )}
                {activeTab === 'reviews' && (
                    <ReviewsTab />
                )}
                {activeTab === 'content' && (
                    <ContentTab />
                )}
            </div>
        </div>
    );
};

// Dashboard Tab Component
const DashboardTab: React.FC<{ stats: Stats }> = ({ stats }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Platform Overview</h2>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Потребители"
                    value={stats.totalUsers}
                    icon={<Users className="h-8 w-8" />}
                    color="blue"
                    trend="+12%"
                />
                <StatCard
                    title="Гледачи"
                    value={stats.totalSitters}
                    icon={<UserCheck className="h-8 w-8" />}
                    color="green"
                    trend="+8%"
                />
                <StatCard
                    title="Резервации"
                    value={stats.totalReservations}
                    icon={<Calendar className="h-8 w-8" />}
                    color="purple"
                    trend="+24%"
                />
                <StatCard
                    title="Приходи"
                    value={`${stats.totalRevenue.toFixed(2)} лв`}
                    icon={<DollarSign className="h-8 w-8" />}
                    color="yellow"
                    trend="+18%"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Последна активност</h3>
                <p className="text-gray-500">Activity feed coming soon...</p>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'yellow';
    trend?: string;
}> = ({ title, value, icon, color, trend }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        yellow: 'from-yellow-500 to-yellow-600',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-md">
                        <TrendingUp className="h-4 w-4" />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-white/80 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    );
};

// Users Tab Component (Placeholder)
const UsersTab: React.FC<{ users: any[]; onRefresh: () => void }> = ({ users, onRefresh }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Управление на потребители</h2>
            <p className="text-gray-500">User management interface coming soon...</p>
        </div>
    );
};

// Sitters Tab Component (Placeholder)
const SittersTab: React.FC<{ sitters: any[]; onRefresh: () => void }> = ({ sitters, onRefresh }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Управление на гледачи</h2>
            <p className="text-gray-500">Sitter management interface coming soon...</p>
        </div>
    );
};

// Bookings Tab Component (Placeholder)
const BookingsTab: React.FC<{ bookings: any[]; onRefresh: () => void }> = ({ bookings, onRefresh }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Управление на резервации</h2>
            <p className="text-gray-500">Booking management interface coming soon...</p>
        </div>
    );
};

// Payments Tab Component (Placeholder)
const PaymentsTab: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Управление на плащания</h2>
            <p className="text-gray-500">Payment management interface coming soon...</p>
        </div>
    );
};

// Reviews Tab Component (Placeholder)
const ReviewsTab: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Управление на отзиви</h2>
            <p className="text-gray-500">Review management interface coming soon...</p>
        </div>
    );
};

// Content Tab Component (Placeholder)
const ContentTab: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Управление на съдържание</h2>
            <p className="text gray-500">Content management interface coming soon...</p>
        </div>
    );
};

export default AdminDashboardEnhanced;
