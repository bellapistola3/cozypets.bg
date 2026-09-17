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
  async signUp(email: string, password: string, name: string, phone?: string, role: AuthUser['role'] = 'owner') {
    const assignedRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : role;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, name } },
    });
    if (error) throw error;

    if (data.user) {
      await dbHelpers.createUserProfile({
        auth_user_id: data.user.id,
        name,
        email: data.user.email || email,
        phone,
        role: assignedRole,
      });
    }

    return { user: data.user };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return { data };
  },

  async signInWithFacebook() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return { data };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    let profile = await dbHelpers.getUserByAuthId(user.id);
    if (!profile && user.email) {
      profile = await dbHelpers.createUserProfile({
        auth_user_id: user.id,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        email: user.email,
        role: ADMIN_EMAILS.includes(user.email.toLowerCase()) ? 'admin' : 'owner',
      });
    }

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Потребител',
      role: profile?.role || 'owner',
    };
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      callback(session?.user ? await this.getCurrentUser() : null);
    });
    return { data: { subscription } };
  },
};
