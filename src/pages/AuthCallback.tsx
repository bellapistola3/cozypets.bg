import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, dbHelpers } from '../lib/supabase';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                // Get current session
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // Check if user profile exists
                    const profile = await dbHelpers.getUserByAuthId(session.user.id);

                    // If no profile, create one (for OAuth users)
                    if (!profile) {
                        await dbHelpers.createUserProfile({
                            auth_user_id: session.user.id,
                            name: session.user.user_metadata?.name ||
                                session.user.user_metadata?.full_name ||
                                session.user.email?.split('@')[0] || 'User',
                            email: session.user.email || '',
                            phone: session.user.user_metadata?.phone,
                            role: 'owner'
                        });
                    }
                }

                // Redirect to home after successful auth
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } catch (err) {
                console.error('OAuth callback error:', err);
                setError('Грешка при вход. Моля, опитайте отново.');
            }
        };

        handleOAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="text-center">
                {error ? (
                    <>
                        <div className="text-red-600 text-xl font-semibold mb-2">{error}</div>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                            Върнете се към началната страница
                        </button>
                    </>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Влизане...</h2>
                        <p className="text-gray-600 mt-2">Моля, изчакайте</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
