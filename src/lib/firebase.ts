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
    Timestamp
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

// Export на Firebase types
export type { User, DocumentData };

/**
 * Firebase Database Helpers
 * Тези функции заменят старите Supabase dbHelpers
 */
export const dbHelpers = {
    // ============================================================================
    // USER OPERATIONS
    // ============================================================================

    /**
     * Създава потребителски профил в Firestore
     * Път: /users/{userId}
     */
    async createUserProfile(userData: {
        auth_user_id: string;
        name: string;
        email: string;
        phone?: string;
        role?: 'owner' | 'admin' | 'sitter';
    }) {
        try {
            const userRef = doc(db, 'users', userData.auth_user_id);
            const profileData = {
                name: userData.name,
                full_name: userData.name,
                email: userData.email,
                phone: userData.phone || '',
                role: userData.role || 'owner',
                created_at: Timestamp.now(),
            };

            await setDoc(userRef, profileData);
            return { id: userData.auth_user_id, ...profileData };
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    },

    /**
     * Взима потребителски профил по Auth ID
     */
    async getUserByAuthId(authUserId: string) {
        try {
            const userRef = doc(db, 'users', authUserId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return { id: userSnap.id, ...userSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user by auth ID:', error);
            return null;
        }
    },

    /**
     * Взима потребител по email
     */
    async getUserByEmail(email: string) {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                return { id: userDoc.id, ...userDoc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    },

    /**
     * Обновява потребителски профил
     */
    async updateUserProfile(authUserId: string, updates: {
        name?: string;
        phone?: string;
        role?: 'owner' | 'admin' | 'sitter';
    }) {
        try {
            const userRef = doc(db, 'users', authUserId);
            const updatesWithFullName = {
                ...updates,
                ...(updates.name && { full_name: updates.name }),
            };

            await updateDoc(userRef, updatesWithFullName);

            const updatedDoc = await getDoc(userRef);
            return { id: updatedDoc.id, ...updatedDoc.data() };
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    // ============================================================================
    // PET OPERATIONS
    // ============================================================================

    /**
     * Взима всички домашни любимци на потребител
     * Път: /users/{userId}/pets
     */
    async getUserPets(userId: string) {
        try {
            const petsRef = collection(db, 'users', userId, 'pets');
            const querySnapshot = await getDocs(petsRef);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user pets:', error);
            return [];
        }
    },

    /**
     * Създава нов домашен любимец
     */
    async createPet(petData: {
        user_id: string;
        name: string;
        breed?: string;
        age?: number;
        health_status?: string;
        photo_url?: string;
    }) {
        try {
            const petsRef = collection(db, 'users', petData.user_id, 'pets');
            const newPetRef = doc(petsRef);

            const petDoc = {
                name: petData.name,
                breed: petData.breed || '',
                age: petData.age || 0,
                medicalConditions: petData.health_status || '',
                photo_url: petData.photo_url || '',
                created_at: Timestamp.now(),
            };

            await setDoc(newPetRef, petDoc);
            return { id: newPetRef.id, ...petDoc };
        } catch (error) {
            console.error('Error creating pet:', error);
            throw error;
        }
    },

    /**
     * Изтрива домашен любимец
     */
    async deletePet(userId: string, petId: string) {
        try {
            const petRef = doc(db, 'users', userId, 'pets', petId);
            await deleteDoc(petRef);
        } catch (error) {
            console.error('Error deleting pet:', error);
            throw error;
        }
    },

    // ============================================================================
    // SITTER OPERATIONS
    // ============================================================================

    /**
     * Взима всички гледачи с филтри
     * Път: /sitters
     */
    async getSitters(filters?: {
        location?: string;
        min_rate?: number;
        max_rate?: number;
        min_rating?: number;
    }) {
        try {
            const sittersRef = collection(db, 'sitters');
            let q = query(sittersRef);

            // Забележка: Firestore има ограничения за сложни филтри
            // Може да се наложи да филтрирате на клиента

            const querySnapshot = await getDocs(q);
            let sitters = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Client-side filtering
            if (filters?.location) {
                sitters = sitters.filter(s =>
                    s.location?.toLowerCase().includes(filters.location!.toLowerCase())
                );
            }
            if (filters?.min_rate) {
                sitters = sitters.filter(s => s.hourly_rate >= filters.min_rate!);
            }
            if (filters?.max_rate) {
                sitters = sitters.filter(s => s.hourly_rate <= filters.max_rate!);
            }
            if (filters?.min_rating) {
                sitters = sitters.filter(s => (s.rating || 0) >= filters.min_rating!);
            }

            return sitters;
        } catch (error) {
            console.error('Error getting sitters:', error);
            return [];
        }
    },

    /**
     * Взима профил на гледач
     */
    async getSitterProfile(userId: string) {
        try {
            const sitterRef = doc(db, 'sitters', userId);
            const sitterSnap = await getDoc(sitterRef);

            if (sitterSnap.exists()) {
                return { id: sitterSnap.id, ...sitterSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting sitter profile:', error);
            return null;
        }
    },

    /**
     * Създава или обновява профил на гледач
     */
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
    }) {
        try {
            const sitterRef = doc(db, 'sitters', sitterData.id);
            await setDoc(sitterRef, sitterData, { merge: true });

            const updatedDoc = await getDoc(sitterRef);
            return { id: updatedDoc.id, ...updatedDoc.data() };
        } catch (error) {
            console.error('Error upserting sitter:', error);
            throw error;
        }
    },

    // ============================================================================
    // RESERVATION OPERATIONS
    // ============================================================================

    /**
     * Взима резервации на потребител
     */
    async getUserReservations(userId: string) {
        try {
            const reservationsRef = collection(db, 'reservations');
            const q = query(reservationsRef, where('ownerId', '==', userId));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user reservations:', error);
            return [];
        }
    },

    /**
     * Създава нова резервация
     */
    async createReservation(reservationData: {
        owner_id: string;
        sitter_id: string;
        pet_id: string;
        start_date: string;
        end_date: string;
        total_price: number;
    }) {
        try {
            const reservationsRef = collection(db, 'reservations');
            const newReservationRef = doc(reservationsRef);

            const reservation = {
                ownerId: reservationData.owner_id,
                sitterId: reservationData.sitter_id,
                petId: reservationData.pet_id,
                startDate: Timestamp.fromDate(new Date(reservationData.start_date)),
                endDate: Timestamp.fromDate(new Date(reservationData.end_date)),
                totalPrice: reservationData.total_price,
                status: 'pending',
                created_at: Timestamp.now(),
            };

            await setDoc(newReservationRef, reservation);
            return { id: newReservationRef.id, ...reservation };
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    },

    // ============================================================================
    // REVIEW OPERATIONS
    // ============================================================================

    /**
     * Взима отзиви за гледач
     */
    async getSitterReviews(sitterId: string) {
        try {
            const reviewsRef = collection(db, 'reviews');
            const q = query(
                reviewsRef,
                where('sitterId', '==', sitterId),
                orderBy('created_at', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting sitter reviews:', error);
            return [];
        }
    },

    /**
     * Създава нов отзив
     */
    async createReview(reviewData: {
        reservation_id: string;
        reviewer_id: string;
        sitter_id: string;
        rating: number;
        comment?: string;
    }) {
        try {
            const reviewsRef = collection(db, 'reviews');
            const newReviewRef = doc(reviewsRef);

            const review = {
                reservationId: reviewData.reservation_id,
                reviewerId: reviewData.reviewer_id,
                sitterId: reviewData.sitter_id,
                rating: reviewData.rating,
                comment: reviewData.comment || '',
                created_at: Timestamp.now(),
            };

            await setDoc(newReviewRef, review);
            return { id: newReviewRef.id, ...review };
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    // ============================================================================
    // PAYMENT OPERATIONS
    // ============================================================================

    /**
     * Създава ново плащане
     */
    async createPayment(paymentData: {
        reservation_id: string;
        amount: number;
        payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
        payment_status?: 'pending' | 'completed' | 'failed';
    }) {
        try {
            const paymentsRef = collection(db, 'payments');
            const newPaymentRef = doc(paymentsRef);

            const payment = {
                reservationId: paymentData.reservation_id,
                amount: paymentData.amount,
                paymentMethod: paymentData.payment_method,
                paymentStatus: paymentData.payment_status || 'pending',
                created_at: Timestamp.now(),
            };

            await setDoc(newPaymentRef, payment);
            return { id: newPaymentRef.id, ...payment };
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // ============================================================================
    // STATISTICS
    // ============================================================================

    /**
     * Взима статистики за платформата
     */
    async getPlatformStats() {
        try {
            const [usersSnap, sittersSnap, reservationsSnap, paymentsSnap] = await Promise.all([
                getDocs(collection(db, 'users')),
                getDocs(collection(db, 'sitters')),
                getDocs(collection(db, 'reservations')),
                getDocs(query(collection(db, 'payments'), where('paymentStatus', '==', 'completed'))),
            ]);

            const totalRevenue = paymentsSnap.docs.reduce((sum, doc) => {
                return sum + (doc.data().amount || 0);
            }, 0);

            return {
                totalUsers: usersSnap.size,
                totalSitters: sittersSnap.size,
                totalReservations: reservationsSnap.size,
                totalRevenue: totalRevenue,
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
 * Authentication Helpers
 */
export const authHelpers = {
    /**
     * Регистрация на нов потребител
     */
    async registerUser(email: string, password: string, name: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Създаване на потребителски профил
            await dbHelpers.createUserProfile({
                auth_user_id: user.uid,
                name: name,
                email: user.email!,
                role: email === 'methodman9090@gmail.com' ? 'admin' : 'owner',
            });

            return user;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    },

    /**
     * Вход на потребител
     */
    async loginUser(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    /**
     * Изход на потребител
     */
    async logoutUser() {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    },

    /**
     * Следене на auth state
     */
    onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    },
};
