import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url_here' || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('Supabase environment variables not configured. Using mock client.');
  // Create a mock client that won't cause errors
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: new Error('Supabase not configured') }),
      insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Database helper functions
export const dbHelpers = {
  // Users
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createUser(userData: {
    name: string;
    email: string;
    phone?: string;
    password_hash: string;
    role?: 'owner' | 'admin';
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Sitters
  async getSitters(filters?: {
    location?: string;
    min_rate?: number;
    max_rate?: number;
    min_rating?: number;
  }) {
    let query = supabase
      .from('sitters')
      .select(`
        *,
        user:users(*)
      `);

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.min_rate) {
      query = query.gte('hourly_rate', filters.min_rate);
    }
    if (filters?.max_rate) {
      query = query.lte('hourly_rate', filters.max_rate);
    }
    if (filters?.min_rating) {
      query = query.gte('rating', filters.min_rating);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createSitter(sitterData: {
    user_id: number;
    bio?: string;
    photo_url?: string;
    hourly_rate: number;
    location: string;
    qualifications?: string;
  }) {
    const { data, error } = await supabase
      .from('sitters')
      .insert([sitterData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Pets
  async getUserPets(userId: string) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async createPet(petData: {
    user_id: number;
    name: string;
    breed?: string;
    age?: number;
    health_status?: string;
    photo_url?: string;
  }) {
    const { data, error } = await supabase
      .from('pets')
      .insert([petData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Reservations
  async getUserReservations(userId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        owner:users!owner_id(*),
        sitter:sitters(*),
        pet:pets(*),
        payment:payments(*)
      `)
      .or(`owner_id.eq.${userId},sitter_id.in.(select sitter_id from sitters where user_id=${userId})`);
    
    if (error) throw error;
    return data;
  },

  async createReservation(reservationData: {
    owner_id: number;
    sitter_id: number;
    pet_id: number;
    start_date: string;
    end_date: string;
    total_price: number;
  }) {
    const { data, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Reviews
  async getSitterReviews(sitterId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users(*)
      `)
      .eq('sitter_id', sitterId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createReview(reviewData: {
    reservation_id: number;
    reviewer_id: number;
    sitter_id: number;
    rating: number;
    comment?: string;
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Payments
  async createPayment(paymentData: {
    reservation_id: number;
    amount: number;
    payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
    payment_status?: 'pending' | 'completed' | 'failed';
  }) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Statistics
  async getPlatformStats() {
    const [usersResult, sittersResult, reservationsResult, paymentsResult] = await Promise.all([
      supabase.from('users').select('user_id', { count: 'exact' }),
      supabase.from('sitters').select('sitter_id', { count: 'exact' }),
      supabase.from('reservations').select('reservation_id', { count: 'exact' }),
      supabase.from('payments').select('amount').eq('payment_status', 'completed')
    ]);

    const totalRevenue = paymentsResult.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

    return {
      totalUsers: usersResult.count || 0,
      totalSitters: sittersResult.count || 0,
      totalReservations: reservationsResult.count || 0,
      totalRevenue: totalRevenue
    };
  }
};