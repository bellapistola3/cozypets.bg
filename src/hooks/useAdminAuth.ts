import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

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
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            setLoading(true);

            // Get current user
            const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !currentUser) {
                setIsAdmin(false);
                setUser(null);
                setRole(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);

            // Check if user has admin role in profiles table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentUser.id)
                .single();

            if (profileError || !profileData) {
                console.warn('User profile not found in profiles table or error occurred:', profileError);
                setIsAdmin(false);
                setRole(null);
                setLoading(false);
                return;
            }

            // Check if user has admin role
            const isUserAdmin = profileData.role === 'admin';
            setIsAdmin(isUserAdmin);
            setRole(profileData.role); // Set the role regardless, even if not 'admin'

            if (!isUserAdmin) {
                console.warn('User does not have admin role');
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    return { isAdmin, loading, user, role };
};

// Helper function to check if user is admin (can be used anywhere)
export const checkIsAdmin = async (): Promise<boolean> => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return false;
        }

        // Check if user has admin role in profiles table by id
        const { data, error } = await supabase
            .from('profiles')
            .select('role, id')
            .eq('id', user.id)
            .single();

        return !error && data?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};
