import { supabase } from './supabase';
import { dbHelpers } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
}

export const authHelpers = {
  // Sign up new user
  async signUp(email: string, password: string, name: string, phone?: string) {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (authError) throw authError;

      // Then create user profile in both tables
      if (authData.user) {
        // Create in users table (legacy)
        try {
          await dbHelpers.createUser({
            name,
            email,
            phone,
            password_hash: 'supabase_auth',
            role: 'owner'
          });
        } catch (userError) {
          console.warn('Could not create user in legacy table:', userError);
        }

        // Create in profiles table (new)
        try {
          await dbHelpers.createOrUpdateProfile({
            id: authData.user.id,
            full_name: name,
            email,
            phone,
            role: 'owner'
          });
        } catch (profileError) {
          console.warn('Could not create profile:', profileError);
        }

        return { user: authData.user };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) return null;

      // Try to get profile from new profiles table first
      let profile = await dbHelpers.getProfile(user.id);
      
      // If not found, try legacy users table
      if (!profile) {
        profile = await dbHelpers.getUserByEmail(user.email || '');
      }

      // If still no profile, create one
      if (!profile && user.email) {
        try {
          profile = await dbHelpers.createOrUpdateProfile({
            id: user.id,
            full_name: user.user_metadata?.name || user.email.split('@')[0],
            email: user.email,
            phone: user.user_metadata?.phone,
            role: 'owner'
          });
        } catch (createError) {
          console.warn('Could not create profile for user:', createError);
        }
      }

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        name: profile.full_name || profile.name || user.email!.split('@')[0],
        role: profile.role
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    try {
      return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const user = await this.getCurrentUser();
          callback(user);
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error('Auth state change error:', error);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};