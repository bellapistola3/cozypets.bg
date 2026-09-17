/**
 * CozyPets uses a single database backend: Supabase.
 *
 * This file exists only as a backward-compatible shim for legacy imports.
 * New code should import from ./supabaseClient or ./supabase directly.
 */

import { supabase } from './supabaseClient';

export { supabase };

export type DbUserRole = 'owner' | 'admin' | 'sitter';

export const dbHelpers = {
  async createUserProfile(userData: {
    auth_user_id: string;
    name: string;
    email: string;
    phone?: string;
    role?: DbUserRole;
  }) {
    const profileData = {
      id: userData.auth_user_id,
      full_name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || ((userData.email === 'methodman9090@gmail.com' || userData.email === 'cozypetsbyalice@gmail.com') ? 'admin' : 'owner'),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating Supabase user profile:', error);
      throw error;
    }

    return data || { id: userData.auth_user_id, ...profileData };
  },

  async getUserByAuthId(authUserId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUserId)
      .maybeSingle();

    if (error) {
      console.error('Error getting Supabase profile by ID:', error);
      throw error;
    }

    return data ? { id: data.id, name: data.full_name || data.name, ...data } : null;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }

    return data ? { id: data.id, name: data.full_name || data.name, ...data } : null;
  },

  async updateUserProfile(authUserId: string, updates: {
    name?: string;
    phone?: string;
    role?: DbUserRole;
  }) {
    const updatesObj: Record<string, any> = { ...updates };
    if (updates.name) updatesObj.full_name = updates.name;

    const { data, error } = await supabase
      .from('profiles')
      .update(updatesObj)
      .eq('id', authUserId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data ? { id: data.id, ...data } : { id: authUserId, ...updatesObj };
  },

  async getUserPets(userId: string) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting user pets:', error);
      throw error;
    }

    return data || [];
  },

  async createPet(petData: {
    user_id: string;
    name: string;
    breed?: string;
    age?: number;
    health_status?: string;
    photo_url?: string;
  }) {
    const petDoc = {
      user_id: petData.user_id,
      name: petData.name,
      breed: petData.breed || '',
      age: petData.age || 0,
      health_status: petData.health_status || '',
      photo_url: petData.photo_url || '',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('pets')
      .insert(petDoc)
      .select()
      .single();

    if (error) {
      console.error('Error creating pet:', error);
      throw error;
    }

    return data || { id: Date.now().toString(), ...petDoc };
  },

  async deletePet(userId: string, petId: string) {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', petId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  },

  async getSitters(filters?: {
    location?: string;
    min_rate?: number;
    max_rate?: number;
    min_rating?: number;
  }) {
    let query = supabase.from('sitters').select('*');

    if (filters?.min_rate) query = query.gte('price_24h', filters.min_rate);
    if (filters?.max_rate) query = query.lte('price_24h', filters.max_rate);
    if (filters?.location) query = query.ilike('address_line', `%${filters.location}%`);

    const { data, error } = await query;
    if (error) {
      console.error('Error getting sitters:', error);
      throw error;
    }

    return data || [];
  },

  async getSitterProfile(userId: string) {
    const { data, error } = await supabase
      .from('sitters')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error getting sitter profile:', error);
      throw error;
    }

    return data || null;
  },

  async createOrUpdateSitter(sitterData: Record<string, any>) {
    const allowedKeys = [
      'id', 'profile_title', 'bio', 'experience', 'address_line',
      'lat', 'lng', 'is_hotel', 'price_24h', 'price_notes',
      'pet_types', 'allow_small_dogs', 'allow_large_dogs',
      'accept_in_heat', 'accept_unneutered', 'behavior_trainer',
      'has_car', 'medical_training', 'day_flow_short'
    ];

    const cleanSitterData: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (sitterData[key] !== undefined) cleanSitterData[key] = sitterData[key];
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
  },

  async getUserReservations(userId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, profiles:owner_id(full_name), sitters:sitter_id(*)')
      .or(`owner_id.eq.${userId},sitter_id.eq.${userId}`);

    if (error) {
      console.error('Error getting user reservations:', error);
      throw error;
    }

    return data || [];
  },

  async createReservation(reservationData: {
    owner_id: string;
    sitter_id: string;
    pet_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status?: string;
  }) {
    const reservation = {
      owner_id: reservationData.owner_id,
      sitter_id: reservationData.sitter_id,
      pet_id: reservationData.pet_id,
      start_date: new Date(reservationData.start_date).toISOString(),
      end_date: new Date(reservationData.end_date).toISOString(),
      total_price: reservationData.total_price,
      status: reservationData.status || 'pending',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('reservations')
      .insert(reservation)
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    return data || { id: Date.now().toString(), ...reservation };
  },

  async getSitterReviews(sitterId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('sitter_id', sitterId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting sitter reviews:', error);
      throw error;
    }

    return data || [];
  },

  async createReview(reviewData: {
    reservation_id: string;
    reviewer_id: string;
    sitter_id: string;
    rating: number;
    comment?: string;
  }) {
    const review = {
      reservation_id: reviewData.reservation_id,
      reviewer_id: reviewData.reviewer_id,
      sitter_id: reviewData.sitter_id,
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return data || { id: Date.now().toString(), ...review };
  },

  async createPayment(paymentData: {
    reservation_id: string;
    amount: number;
    payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
    payment_status?: 'pending' | 'completed' | 'failed';
    escrow_status?: 'held' | 'released' | 'refunded';
  }) {
    const payment = {
      reservation_id: paymentData.reservation_id,
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
      escrow_status: paymentData.escrow_status || 'held',
      payment_status: paymentData.payment_status || 'completed',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }

    return data || { id: Date.now().toString(), ...payment };
  },

  async getPlatformStats() {
    const [{ count: usersCount }, { count: sittersCount }, { count: reservationsCount }, { data: paymentsData }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('sitters').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('amount'),
    ]);

    const totalRevenue = (paymentsData || []).reduce((sum, payment: any) => sum + (payment.amount || 0), 0);

    return {
      totalUsers: usersCount || 0,
      totalSitters: sittersCount || 0,
      totalReservations: reservationsCount || 0,
      totalRevenue: totalRevenue || 0,
    };
  },
};

export const authHelpers = {
  async registerUser(email: string, password: string, name: string) {
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
        email,
      });
    }

    return data.user;
  },

  async loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChanged(callback: (user: any) => void) {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  },
};

export default { dbHelpers, authHelpers, supabase };
