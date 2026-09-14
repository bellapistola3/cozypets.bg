import { useState, useEffect } from 'react';
import { auth, dbHelpers } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AdminAuthResult {
    isAdmin: boolean;
    loading: boolean;
    user: User | null;
    role: string | null;
}

export const useAdminAuth = (): AdminAuthResult => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setIsAdmin(false);
                setUser(null);
                setRole(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);

            try {
                // Check if user has admin role in users collection
                const profileData = await dbHelpers.getUserByAuthId(currentUser.uid);

                if (!profileData) {
                    console.warn('User profile not found in users collection');
                    setIsAdmin(false);
                    setRole(null);
                } else {
                    const isUserAdmin = (profileData as any).role === 'admin';
                    setIsAdmin(isUserAdmin);
                    setRole((profileData as any).role);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
                setRole(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { isAdmin, loading, user, role };
};

// Helper function to check if user is admin (can be used anywhere)
export const checkIsAdmin = async (): Promise<boolean> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            return false;
        }

        // Check if user has admin role in users collection
        const profileData = await dbHelpers.getUserByAuthId(currentUser.uid);
        return (profileData as any)?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};
