import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, dbHelpers } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Check if user profile exists
                    const profile = await dbHelpers.getUserByAuthId(user.uid);

                    // If no profile, create one (for OAuth users)
                    if (!profile) {
                        await dbHelpers.createUserProfile({
                            auth_user_id: user.uid,
                            name: user.displayName || user.email?.split('@')[0] || 'User',
                            email: user.email || '',
                            phone: user.phoneNumber || '',
                            role: 'owner'
                        });
                    }

                    // Redirect to home after successful auth
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } catch (err) {
                    console.error('Profile creation error:', err);
                    setError('Грешка при обработка на профила.');
                }
            } else {
                // No user after callback, redirect to login or home
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300/20 via-blue-200/20 to-green-300/20">
            <div className="text-center bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/50 max-w-sm w-full mx-4">
                {error ? (
                    <>
                        <div className="text-red-500 text-xl font-bold mb-4">Упс!</div>
                        <div className="text-gray-700 font-medium mb-6">{error}</div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-all"
                        >
                            Към началната страница
                        </button>
                    </>
                ) : (
                    <>
                        <div className="relative mb-8">
                            <div className="w-20 h-20 border-4 border-green-100 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Успешен вход!</h2>
                        <p className="text-gray-500 font-medium tracking-tight">Настройваме финалните детайли...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
