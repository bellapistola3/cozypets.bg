import { supabase } from './supabase';

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

      // Then create user profile
      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            name,
            email,
            phone,
            password_hash: 'handled_by_supabase_auth',
            role: 'owner'
          }])
          .select()
          .single();

        if (userError) throw userError;
        return { user: authData.user, profile: userData };
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

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) return null;

      return {
        id: user.id,
        email: user.email!,
        name: profile.name,
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