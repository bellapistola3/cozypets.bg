import { auth, dbHelpers } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'sitter';
}

export const authHelpers = {
  // Sign up new user
  async signUp(email: string, password: string, name: string, phone?: string) {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      if (user) {
        try {
          await dbHelpers.createUserProfile({
            auth_user_id: user.uid,
            name,
            email: user.email!,
            phone,
            role: email === 'methodman9090@gmail.com' ? 'admin' : 'owner'
          });
        } catch (userError) {
          console.error('Error creating user profile:', userError);
          console.warn('User authenticated but profile creation failed');
        }

        return { user };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create profile if doesn't exist
      if (user) {
        const existingProfile = await dbHelpers.getUserByAuthId(user.uid);

        if (!existingProfile) {
          await dbHelpers.createUserProfile({
            auth_user_id: user.uid,
            name: user.displayName || user.email!.split('@')[0],
            email: user.email!,
            role: 'owner'
          });
        }
      }

      return { user };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  // Sign in with Facebook
  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create profile if doesn't exist
      if (user) {
        const existingProfile = await dbHelpers.getUserByAuthId(user.uid);

        if (!existingProfile) {
          await dbHelpers.createUserProfile({
            auth_user_id: user.uid,
            name: user.displayName || user.email!.split('@')[0],
            email: user.email!,
            role: 'owner'
          });
        }
      }

      return { user };
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = auth.currentUser;

      if (!user) return null;

      // Get user profile from Firestore
      let profile = await dbHelpers.getUserByAuthId(user.uid);

      // If no profile exists, create one (handles OAuth users)
      if (!profile && user.email) {
        try {
          profile = await dbHelpers.createUserProfile({
            auth_user_id: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: 'owner'
          });
        } catch (createError) {
          console.error('Could not create user profile:', createError);
          return null;
        }
      }

      if (!profile) return null;

      return {
        id: user.uid,
        email: user.email!,
        name: profile.name || user.email!.split('@')[0],
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
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          const user = await this.getCurrentUser();
          callback(user);
        } else {
          callback(null);
        }
      });

      // Return in Supabase-compatible format for AuthContext
      return {
        data: {
          subscription: {
            unsubscribe
          }
        }
      };
    } catch (error) {
      console.error('Auth state change error:', error);
      return {
        data: {
          subscription: {
            unsubscribe: () => { }
          }
        }
      };
    }
  }
};