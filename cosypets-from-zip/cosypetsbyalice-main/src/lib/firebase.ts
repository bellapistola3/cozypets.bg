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
    onSnapshot,
    addDoc,
    serverTimestamp
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

    // ============================================================================
    // PET OPERATIONS
    // ============================================================================

    /**
     * Взима всички домашни любимци на потребител
     */
    async getUserPets(userId: string) {
        try {
            const petsRef = collection(db, 'pets');
            const q = query(petsRef, where('owner_id', '==', userId));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user pets:', error);
            return [];
        }
    },

    async getPetsByOwnerId(userId: string) {
        return this.getUserPets(userId);
    },

    async getPetByName(ownerId: string, name: string) {
        try {
            const petsRef = collection(db, 'pets');
            const q = query(petsRef, where('owner_id', '==', ownerId), where('name', '==', name), limit(1));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        } catch (error) {
            console.error('Error getting pet by name:', error);
            return null;
        }
    },

    /**
     * Създава нов домашен любимец
     */
    async createPet(petData: any) {
        try {
            const petsRef = collection(db, 'pets');
            const docRef = await addDoc(petsRef, {
                ...petData,
                created_at: serverTimestamp()
            });
            return { id: docRef.id, ...petData };
        } catch (error) {
            console.error('Error creating pet:', error);
            throw error;
        }
    },

    /**
     * Изтрива домашен любимец
     */
    async deletePet(petId: string) {
        try {
            const petRef = doc(db, 'pets', petId);
            await deleteDoc(petRef);
        } catch (error) {
            console.error('Error deleting pet:', error);
            throw error;
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

    /**
     * Създава или обновява профил (Shim за стария код)
     */
    async createOrUpdateProfile(userData: any) {
        try {
            const userId = userData.id || userData.auth_user_id;
            if (!userId) throw new Error('User ID is required');

            const userRef = doc(db, 'users', userId);
            const data = {
                ...userData,
                updated_at: serverTimestamp()
            };
            if (!data.created_at) data.created_at = serverTimestamp();

            await setDoc(userRef, data, { merge: true });
            return { id: userId, ...data };
        } catch (error) {
            console.error('Error in createOrUpdateProfile:', error);
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
            } as any));

            // Client-side filtering
            if (filters?.location) {
                sitters = sitters.filter(s =>
                    s.location?.toLowerCase().includes(filters.location!.toLowerCase())
                );
            }
            if (filters?.min_rate) {
                sitters = sitters.filter(s => (s.hourly_rate || 0) >= filters.min_rate!);
            }
            if (filters?.max_rate) {
                sitters = sitters.filter(s => (s.hourly_rate || 0) <= filters.max_rate!);
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
            const q = query(reservationsRef, where('owner_id', '==', userId), orderBy('created_at', 'desc'));
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

    async getSitterReservations(sitterId: string) {
        try {
            const resRef = collection(db, 'reservations');
            const q = query(resRef, where('sitter_id', '==', sitterId), orderBy('created_at', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching sitter reservations:', error);
            return [];
        }
    },

    async checkSitterAvailability(sitterId: string, startDate: string, endDate: string) {
        const resRef = collection(db, 'reservations');
        const q = query(
            resRef,
            where('sitter_id', '==', sitterId),
            where('status', 'in', ['pending', 'confirmed'])
        );
        const snapshot = await getDocs(q);
        const reservations = snapshot.docs.map(doc => doc.data());

        const start = new Date(startDate);
        const end = new Date(endDate);

        const conflicts = reservations.filter((res: any) => {
            const resStart = new Date(res.start_date);
            const resEnd = new Date(res.end_date);
            return (start <= resEnd && end >= resStart);
        });

        return {
            available: conflicts.length === 0,
            conflicts
        };
    },

    /**
     * Създава нова резервация
     */
    async createReservation(data: any) {
        try {
            const resRef = collection(db, 'reservations');
            const docRef = await addDoc(resRef, {
                ...data,
                created_at: serverTimestamp()
            });
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    },

    async updateReservationStatus(reservationId: string, status: string) {
        try {
            const docRef = doc(db, 'reservations', reservationId);
            await updateDoc(docRef, { status, updated_at: serverTimestamp() });
        } catch (error) {
            console.error('Error updating reservation status:', error);
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
                where('sitter_id', '==', sitterId),
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

    async getReviewsBySitter(sitterId: string) {
        return this.getSitterReviews(sitterId);
    },

    /**
     * Създава нов отзив
     */
    async createReview(data: any) {
        try {
            const revRef = collection(db, 'reviews');
            const docRef = await addDoc(revRef, {
                ...data,
                created_at: serverTimestamp()
            });
            return { id: docRef.id, ...data };
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
    async createPayment(data: any) {
        try {
            const payRef = collection(db, 'payments');
            const docRef = await addDoc(payRef, {
                ...data,
                created_at: serverTimestamp()
            });
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // ============================================================================
    // MAGAZINE & CONTENT OPERATIONS
    // ============================================================================

    /**
     * Взима последното публикувано издание
     */
    async getLatestMagazineIssue() {
        try {
            const issuesRef = collection(db, 'magazine_issues');
            const q = query(
                issuesRef,
                where('is_published', '==', true),
                orderBy('publication_date', 'desc'),
                limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting latest magazine issue:', error);
            return null;
        }
    },

    /**
     * Взима статии за дадено издание
     */
    async getMagazineArticles(issueId: string, limitCount: number = 6) {
        try {
            const articlesRef = collection(db, 'magazine_articles');
            const q = query(
                articlesRef,
                where('issue_id', '==', issueId),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting magazine articles:', error);
            return [];
        }
    },

    /**
     * Взима ветеринарни клиники
     */
    async getVeterinaryClinics(limitCount: number = 3) {
        try {
            const clinicsRef = collection(db, 'veterinary_clinics');
            const q = query(clinicsRef, limit(limitCount));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting veterinary clinics:', error);
            return [];
        }
    },

    // ============================================================================
    // VETERINARY CHAT OPERATIONS
    // ============================================================================

    /**
     * Взима чат стаи на потребител
     */
    async getVetChatRooms(userId: string) {
        try {
            const roomsRef = collection(db, 'vet_chat_rooms');
            const q = query(
                roomsRef,
                where('user_id', '==', userId),
                orderBy('started_at', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting vet chat rooms:', error);
            return [];
        }
    },

    /**
     * Взима ветеринари
     */
    async getVeterinarians() {
        try {
            const vetsRef = collection(db, 'veterinarians');
            const q = query(vetsRef, where('is_available', '==', true));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting veterinarians:', error);
            return [];
        }
    },

    /**
     * Взима съобщения за чат стая
     */
    async getChatMessages(chatRoomId: string) {
        try {
            const messagesRef = collection(db, 'vet_chat_messages');
            const q = query(
                messagesRef,
                where('chat_room_id', '==', chatRoomId),
                orderBy('created_at', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting chat messages:', error);
            return [];
        }
    },

    /**
     * Създава нова чат стая
     */
    async createVetChatRoom(data: {
        user_id: string;
        subject: string;
        urgency_level: string;
        pet_id?: string;
    }) {
        try {
            const roomsRef = collection(db, 'vet_chat_rooms');
            const newRoomRef = doc(roomsRef);
            const roomData = {
                ...data,
                status: 'open',
                started_at: Timestamp.now(),
            };
            await setDoc(newRoomRef, roomData);
            return { id: newRoomRef.id, ...roomData };
        } catch (error) {
            console.error('Error creating vet chat room:', error);
            throw error;
        }
    },

    /**
     * Изпраща съобщение в чата
     */
    async sendChatChatMessage(data: {
        chat_room_id: string;
        sender_id: string;
        sender_type: 'user' | 'veterinarian';
        message: string;
        message_type: 'text' | 'image' | 'file';
    }) {
        try {
            const messagesRef = collection(db, 'vet_chat_messages');
            const newMessageRef = doc(messagesRef);
            const messageData = {
                ...data,
                is_read: false,
                created_at: Timestamp.now(),
            };
            await setDoc(newMessageRef, messageData);

            // Update room status if needed
            const roomRef = doc(db, 'vet_chat_rooms', data.chat_room_id);
            await updateDoc(roomRef, { status: 'in_progress' });

            return { id: newMessageRef.id, ...messageData };
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    },

    /**
     * Следене на съобщения в реално време
     */
    subscribeToChatMessages(chatRoomId: string, callback: (messages: any[]) => void) {
        const messagesRef = collection(db, 'vet_chat_messages');
        const q = query(
            messagesRef,
            where('chat_room_id', '==', chatRoomId),
            orderBy('created_at', 'asc')
        );

        return onSnapshot(q, (snapshot: any) => {
            const messages = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
            }));
            callback(messages);
        });
    },

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

    async getSitterRating(sitterId: string) {
        const ratingsRef = collection(db, 'sitter_ratings');
        const q = query(ratingsRef, where('sitter_id', '==', sitterId), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    async updateReviewResponse(reviewId: string, response: string) {
        const docRef = doc(db, 'reviews', reviewId);
        await updateDoc(docRef, {
            response,
            response_at: serverTimestamp(),
            updated_at: serverTimestamp()
        });
    },

    // ============================================================================
    // PAYMENTS & ESCROW
    // ============================================================================

    async getPaymentByReservation(reservationId: string) {
        const payRef = collection(db, 'payments');
        const q = query(payRef, where('reservation_id', '==', reservationId), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    async updatePaymentEscrow(paymentId: string, status: string) {
        const docRef = doc(db, 'payments', paymentId);
        await updateDoc(docRef, {
            escrow_status: status,
            released_at: status === 'released' ? serverTimestamp() : null,
            updated_at: serverTimestamp()
        });
    },

    async addPlatformEarning(data: any) {
        const earnRef = collection(db, 'platform_earnings');
        const docRef = await addDoc(earnRef, {
            ...data,
            created_at: serverTimestamp()
        });
        return { id: docRef.id, ...data };
    },

    async updatePlatformEarningStatus(paymentId: string, status: string) {
        const earnRef = collection(db, 'platform_earnings');
        const q = query(earnRef, where('payment_id', '==', paymentId), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const docId = snapshot.docs[0].id;
            const docRef = doc(db, 'platform_earnings', docId);
            await updateDoc(docRef, {
                status,
                paid_to_sitter_at: status === 'paid_to_sitter' ? serverTimestamp() : null,
                updated_at: serverTimestamp()
            });
        }
    },

    // ============================================================================
    // ADMIN OPERATIONS
    // ============================================================================

    async getAllUsers(limitCount: number = 50) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('created_at', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async banUser(userId: string, durationDays: number = 7) {
        const docRef = doc(db, 'users', userId);
        const banExpiresAt = new Date();
        banExpiresAt.setDate(banExpiresAt.getDate() + durationDays);
        await updateDoc(docRef, {
            is_banned: true,
            ban_expires_at: Timestamp.fromDate(banExpiresAt),
            updated_at: serverTimestamp()
        });
    },

    async unbanUser(userId: string) {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            is_banned: false,
            ban_expires_at: null,
            updated_at: serverTimestamp()
        });
    },

    async getAllReservations(limitCount: number = 50) {
        const resRef = collection(db, 'reservations');
        const q = query(resRef, orderBy('created_at', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getAllPayments(limitCount: number = 50) {
        const payRef = collection(db, 'payments');
        const q = query(payRef, orderBy('created_at', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getAllPlatformEarnings(limitCount: number = 50) {
        const earnRef = collection(db, 'platform_earnings');
        const q = query(earnRef, orderBy('created_at', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getAllReviews(limitCount: number = 50) {
        const revRef = collection(db, 'reviews');
        const q = query(revRef, orderBy('created_at', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async deleteReview(reviewId: string) {
        const docRef = doc(db, 'reviews', reviewId);
        await deleteDoc(docRef);
    },

    // ============================================================================
    // CHAT VIOLATION OPERATIONS
    // ============================================================================

    async getChatViolations(userId: string) {
        const violationsRef = collection(db, 'chat_violations');
        const q = query(violationsRef, where('user_id', '==', userId), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    async updateChatViolations(userId: string, data: any) {
        const violationsRef = collection(db, 'chat_violations');
        const q = query(violationsRef, where('user_id', '==', userId), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            await addDoc(violationsRef, {
                user_id: userId,
                ...data,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });
        } else {
            const docId = snapshot.docs[0].id;
            const docRef = doc(db, 'chat_violations', docId);
            await updateDoc(docRef, {
                ...data,
                updated_at: serverTimestamp()
            });
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

/**
 * Supabase Compatibility Layer
 * Temporary export for components still using 'supabase' import
 * This prevents breaking changes during migration
 */
export const supabase = {
    auth: {
        getUser: async () => {
            const user = auth.currentUser;
            return { data: { user }, error: null };
        },
        signOut: () => authHelpers.logoutUser(),
        onAuthStateChange: (callback: (event: string, session: any) => void) => {
            return authHelpers.onAuthStateChanged((user) => {
                callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', { user });
            });
        },
    },
    from: (table: string) => ({
        select: async (_columns: string = '*') => {
            // Compatibility wrapper - todo: migrate components
            console.warn(`⚠️ Using Supabase compatibility layer for table: ${table}. Please migrate to Firebase.`);
            return { data: [], error: null };
        },
        insert: async (_data: any) => {
            console.warn(`⚠️ Using Supabase compatibility layer. Please migrate to Firebase.`);
            return { data: null, error: null };
        },
        update: async (_data: any) => {
            console.warn(`⚠️ Using Supabase compatibility layer. Please migrate to Firebase.`);
            return { data: null, error: null };
        },
        delete: async () => {
            console.warn(`⚠️ Using Supabase compatibility layer. Please migrate to Firebase.`);
            return { data: null, error: null };
        },
    }),
};
