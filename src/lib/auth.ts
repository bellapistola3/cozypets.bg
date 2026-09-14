import { supabase } from './supabaseClient';
import { dbHelpers } from './firebase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'sitter';
}

const ADMIN_EMAILS = ['cozypetsbyalice@gmail.com', 'methodman9090@gmail.com'];

export const authHelpers = {
  // Sign up new user via Supabase Auth
  async signUp(email: string, password: string, name: string, phone?: string, role: 'owner' | 'admin' | 'sitter' = 'owner') {
    try {
      const assignedRole = ADMIN_EMAILS.includes(email) ? 'admin' : role;

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const user = data.user;
      if (user) {
        try {
          await dbHelpers.createUserProfile({
            auth_user_id: user.id,
            name,
            email: user.email!,
            phone,
            role: assignedRole
          });
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          console.warn('User authenticated but profile creation failed');
        }
      }

      return { user };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user via Supabase Auth
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign in with Google via Supabase OAuth
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  // Sign in with Facebook via Supabase OAuth
  async signInWithFacebook() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Facebook sign in error:', error);
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

  // Get current user with profile from Supabase
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;

      // Get user profile from Supabase DB
      let profile = await dbHelpers.getUserByAuthId(user.id);

      // If no profile exists, create one (handles OAuth users)
      if (!profile && user.email) {
        try {
          profile = await dbHelpers.createUserProfile({
            auth_user_id: user.id,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email,
            role: ADMIN_EMAILS.includes(user.email) ? 'admin' : 'owner'
          });
        } catch (createError) {
          console.error('Could not create user profile:', createError);
          return null;
        }
      }

      if (!profile) {
        const fallbackRole = (user.email && ADMIN_EMAILS.includes(user.email)) ? 'admin' : 'owner';
        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Потребител',
          role: fallbackRole
        };
      }

      return {
        id: user.id,
        email: user.email!,
        name: profile.name || user.email!.split('@')[0],
        role: profile.role || 'owner'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Listen to Supabase auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });

    return {
      data: {
        subscription: {
          unsubscribe: () => subscription.unsubscribe()
        }
      }
    };
  }
};