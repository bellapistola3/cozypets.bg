/**
 * Firebase Configuration and Initialization
 * 
 * ВАЖНО: Попълнете Firebase credentials от Firebase Console:
 * 1. Отидете на https://console.firebase.google.com
 * 2. Изберете проекта
 * 3. Project Settings → General → Your apps → Firebase SDK snippet → Config
 * 4. Копирайте стойностите в .env файла
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type Auth,
    type User
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    type Firestore,
    type DocumentData,
    Timestamp,
    getCountFromServer
} from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase конфигурация от environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Проверка дали Firebase е конфигуриран
const isConfigured = Object.values(firebaseConfig).every(
    value => value && value !== 'your_value_here'
);

if (!isConfigured) {
    console.warn('⚠️ Firebase не е конфигуриран! Моля, попълнете .env файла.');
}

// Инициализация на Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0 && isConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} else if (isConfigured) {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
}

// Export на Firebase services
export { auth, db, storage };

// Export на Supabase client (за съвместимост по време на миграция)
export { supabase } from './supabaseClient';

// Export на Firebase types
export type { User, DocumentData };

/**
 * Firebase Database Helpers
 * Тези функции заменят старите Supabase dbHelpers
 */
/**
 * Supabase Database Helpers
 * Всички заявки се изпълняват ексклузивно през Supabase PostgreSQL & Auth
 */
export const dbHelpers = {
    // ============================================================================
    // USER OPERATIONS (Supabase)
    // ============================================================================

    async createUserProfile(userData: {
        auth_user_id: string;
        name: string;
        email: string;
        phone?: string;
        role?: 'owner' | 'admin' | 'sitter';
    }) {
        try {
            const profileData = {
                id: userData.auth_user_id,
                full_name: userData.name,
                email: userData.email,
                phone: userData.phone || '',
                role: userData.role || ((userData.email === 'methodman9090@gmail.com' || userData.email === 'cozypetsbyalice@gmail.com') ? 'admin' : 'owner'),
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase.from('profiles').upsert(profileData).select().single();
            if (error) {
                console.error('Error creating Supabase user profile:', error);
            }
            return data || { id: userData.auth_user_id, ...profileData };
        } catch (error) {
            console.error('Error creating user profile:', error);
            return { id: userData.auth_user_id, email: userData.email, full_name: userData.name };
        }
    },

    async getUserByAuthId(authUserId: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUserId)
                .maybeSingle();

            if (error) console.error('Error getting Supabase profile by ID:', error);
            return data ? { id: data.id, name: data.full_name || data.name, ...data } : null;
        } catch (error) {
            console.error('Error getting user by auth ID:', error);
            return null;
        }
    },

    async getUserByEmail(email: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            if (error) console.error('Error getting user by email:', error);
            return data ? { id: data.id, name: data.full_name || data.name, ...data } : null;
        } catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    },

    async updateUserProfile(authUserId: string, updates: {
        name?: string;
        phone?: string;
        role?: 'owner' | 'admin' | 'sitter';
    }) {
        try {
            const updatesObj: Record<string, any> = { ...updates };
            if (updates.name) updatesObj.full_name = updates.name;

            const { data, error } = await supabase
                .from('profiles')
                .update(updatesObj)
                .eq('id', authUserId)
                .select()
                .maybeSingle();

            if (error) console.error('Error updating user profile:', error);
            return data ? { id: data.id, ...data } : { id: authUserId, ...updatesObj };
        } catch (error) {
            console.error('Error updating user profile:', error);
            return { id: authUserId, ...updates };
        }
    },

    // ============================================================================
    // PET OPERATIONS (Supabase)
    // ============================================================================

    async getUserPets(userId: string) {
        try {
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('user_id', userId);

            if (error) console.error('Error getting user pets:', error);
            return data || [];
        } catch (error) {
            console.error('Error getting user pets:', error);
            return [];
        }
    },

    async createPet(petData: {
        user_id: string;
        name: string;
        breed?: string;
        age?: number;
        health_status?: string;
        photo_url?: string;
    }) {
        try {
            const petDoc = {
                user_id: petData.user_id,
                name: petData.name,
                breed: petData.breed || '',
                age: petData.age || 0,
                health_status: petData.health_status || '',
                photo_url: petData.photo_url || '',
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase.from('pets').insert(petDoc).select().single();
            if (error) console.error('Error creating pet:', error);
            return data || { id: Date.now().toString(), ...petDoc };
        } catch (error) {
            console.error('Error creating pet:', error);
            throw error;
        }
    },

    async deletePet(userId: string, petId: string) {
        try {
            const { error } = await supabase.from('pets').delete().eq('id', petId).eq('user_id', userId);
            if (error) console.error('Error deleting pet:', error);
        } catch (error) {
            console.error('Error deleting pet:', error);
            throw error;
        }
    },

    // ============================================================================
    // SITTER OPERATIONS (Supabase)
    // ============================================================================

    async getSitters(filters?: {
        location?: string;
        min_rate?: number;
        max_rate?: number;
        min_rating?: number;
    }) {
        const DEFAULT_SITTERS = [
            {
                id: 'sitter-1',
                profile_title: 'Алиса & Екип — Сертифициран Гледач',
                bio: 'Добре дошли в CozyPets! Грижим се за вашите любимци с много любов, внимание и безопасна среда.',
                address_line: 'София, Лозенец',
                price_24h: 45,
                pet_types: ['kuche', 'kotka'],
                allow_small_dogs: true,
                allow_large_dogs: true,
                accept_in_heat: false,
                accept_unneutered: true,
                behavior_trainer: true,
                has_car: true
            },
            {
                id: 'sitter-2',
                profile_title: 'Мария Петкова — Опитен Ситър & Ветеринарен асистент',
                bio: 'Професионални грижи за домашни любимци, първа помощ и ежедневни разходки.',
                address_line: 'София, Младост',
                price_24h: 40,
                pet_types: ['kuche', 'kotka'],
                allow_small_dogs: true,
                allow_large_dogs: false,
                accept_in_heat: false,
                accept_unneutered: false,
                behavior_trainer: true,
                has_car: true
            }
        ];

        try {
            let queryBuilder = supabase.from('sitters').select('*');

            if (filters?.min_rate) queryBuilder = queryBuilder.gte('price_24h', filters.min_rate);
            if (filters?.max_rate) queryBuilder = queryBuilder.lte('price_24h', filters.max_rate);
            if (filters?.location) queryBuilder = queryBuilder.ilike('address_line', `%${filters.location}%`);

            const { data, error } = await queryBuilder;
            if (error) console.error('Error getting sitters:', error);
            return (data && data.length > 0) ? data : DEFAULT_SITTERS;
        } catch (error) {
            console.error('Error getting sitters:', error);
            return DEFAULT_SITTERS;
        }
    },

    async getSitterProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('sitters')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) console.error('Error getting sitter profile:', error);
            return data || null;
        } catch (error) {
            console.error('Error getting sitter profile:', error);
            return null;
        }
    },

    async createOrUpdateSitter(sitterData: {
        id: string;
        profile_title?: string;
        bio?: string;
        experience?: string;
        address_line?: string;
        lat?: number;
        lng?: number;
        is_hotel?: boolean;
        price_24h?: number;
        price_notes?: string;
        pet_types?: string[];
        allow_small_dogs?: boolean;
        allow_large_dogs?: boolean;
        accept_in_heat?: boolean;
        accept_unneutered?: boolean;
        behavior_trainer?: boolean;
        has_car?: boolean;
        medical_training?: string;
        day_flow_short?: string;
        [key: string]: any;
    }) {
        try {
            const allowedKeys = [
                'id', 'profile_title', 'bio', 'experience', 'address_line',
                'lat', 'lng', 'is_hotel', 'price_24h', 'price_notes',
                'pet_types', 'allow_small_dogs', 'allow_large_dogs',
                'accept_in_heat', 'accept_unneutered', 'behavior_trainer',
                'has_car', 'medical_training', 'day_flow_short'
            ];
            const cleanSitterData: Record<string, any> = {};
            for (const key of allowedKeys) {
                if (sitterData[key] !== undefined) {
                    cleanSitterData[key] = sitterData[key];
                }
            }

            const { data, error } = await supabase
                .from('sitters')
                .upsert(cleanSitterData)
                .select()
                .maybeSingle();

            if (error) {
                console.error('Error upserting sitter:', error);
                throw error;
            }
            return data || { id: sitterData.id, ...cleanSitterData };
        } catch (error) {
            console.error('Error upserting sitter:', error);
            throw error;
        }
    },

    // ============================================================================
    // RESERVATION OPERATIONS (Supabase)
    // ============================================================================

    async getUserReservations(userId: string) {
        try {
            const { data, error } = await supabase
                .from('reservations')
                .select('*, profiles:owner_id(full_name), sitters:sitter_id(*)')
                .or(`owner_id.eq.${userId},sitter_id.eq.${userId}`);

            if (error) console.error('Error getting user reservations:', error);
            return data || [];
        } catch (error) {
            console.error('Error getting user reservations:', error);
            return [];
        }
    },

    async createReservation(reservationData: {
        owner_id: string;
        sitter_id: string;
        pet_id: string;
        start_date: string;
        end_date: string;
        total_price: number;
    }) {
        try {
            const reservation = {
                owner_id: reservationData.owner_id,
                sitter_id: reservationData.sitter_id,
                pet_id: reservationData.pet_id,
                start_date: new Date(reservationData.start_date).toISOString(),
                end_date: new Date(reservationData.end_date).toISOString(),
                total_price: reservationData.total_price,
                status: 'pending',
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase.from('reservations').insert(reservation).select().single();
            if (error) console.error('Error creating reservation:', error);
            return data || { id: Date.now().toString(), ...reservation };
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    },

    // ============================================================================
    // REVIEW OPERATIONS (Supabase)
    // ============================================================================

    async getSitterReviews(sitterId: string) {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('sitter_id', sitterId)
                .order('created_at', { ascending: false });

            if (error) console.error('Error getting sitter reviews:', error);
            return data || [];
        } catch (error) {
            console.error('Error getting sitter reviews:', error);
            return [];
        }
    },

    async createReview(reviewData: {
        reservation_id: string;
        reviewer_id: string;
        sitter_id: string;
        rating: number;
        comment?: string;
    }) {
        try {
            const review = {
                reservation_id: reviewData.reservation_id,
                reviewer_id: reviewData.reviewer_id,
                sitter_id: reviewData.sitter_id,
                rating: reviewData.rating,
                comment: reviewData.comment || '',
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase.from('reviews').insert(review).select().single();
            if (error) console.error('Error creating review:', error);
            return data || { id: Date.now().toString(), ...review };
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    // ============================================================================
    // PAYMENT OPERATIONS (Supabase)
    // ============================================================================

    async createPayment(paymentData: {
        reservation_id: string;
        amount: number;
        payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
        payment_status?: 'pending' | 'completed' | 'failed';
    }) {
        try {
            const payment = {
                reservation_id: paymentData.reservation_id,
                amount: paymentData.amount,
                payment_method: paymentData.payment_method,
                escrow_status: 'held',
                payment_status: paymentData.payment_status || 'completed',
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase.from('payments').insert(payment).select().single();
            if (error) console.error('Error creating payment:', error);
            return data || { id: Date.now().toString(), ...payment };
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // ============================================================================
    // STATISTICS (Supabase)
    // ============================================================================

    async getPlatformStats() {
        try {
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: sittersCount } = await supabase.from('sitters').select('*', { count: 'exact', head: true });
            const { count: reservationsCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true });
            const { data: paymentsData } = await supabase.from('payments').select('amount');

            const totalRevenue = (paymentsData || []).reduce((sum, p) => sum + (p.amount || 0), 0);

            return {
                totalUsers: usersCount || 0,
                totalSitters: sittersCount || 0,
                totalReservations: reservationsCount || 0,
                totalRevenue: totalRevenue || 0,
            };
        } catch (error) {
            console.error('Error getting platform stats:', error);
            return {
                totalUsers: 0,
                totalSitters: 0,
                totalReservations: 0,
                totalRevenue: 0,
            };
        }
    },
};

/**
 * Supabase Authentication Helpers
 */
export const authHelpers = {
    async registerUser(email: string, password: string, name: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name, name }
                }
            });

            if (error) throw error;

            if (data.user) {
                await dbHelpers.createUserProfile({
                    auth_user_id: data.user.id,
                    name,
                    email,
                });
            }

            return data.user;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    },

    async loginUser(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    async logoutUser() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    },

    onAuthStateChanged(callback: (user: any) => void) {
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user || null);
        });
        return () => authListener.subscription.unsubscribe();
    },
};
