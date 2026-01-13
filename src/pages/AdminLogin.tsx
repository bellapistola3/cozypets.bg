import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Sign in with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError('Грешен имейл или парола');
                setLoading(false);
                return;
            }

            if (!authData.user) {
                setError('Неуспешно влизане');
                setLoading(false);
                return;
            }

            // Check if user is an admin in profiles table
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('role, id')
                .eq('id', authData.user.id)
                .single();

            if (userError || !userData || userData.role !== 'admin') {
                // User is not an admin, log them out
                await supabase.auth.signOut();
                setError('Нямате администраторски права');
                setLoading(false);
                return;
            }

            // Store admin session info
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('adminRole', userData.role);

            // Navigate to dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Възникна грешка при влизане');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">CosyPetsByAlice</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Имейл
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="admin@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Парола
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Влизане...' : 'Вход'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Само за администратори</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
