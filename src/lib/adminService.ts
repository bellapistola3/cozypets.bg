import { supabase } from './supabase';

export interface AdminStats {
  totalUsers: number;
  totalSitters: number;
  totalReservations: number;
  totalRevenue: number;
  platformEarnings: number;
  pendingPayouts: number;
  activeSubscriptions: number;
  completedReservations: number;
}

export interface UserManagement {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  created_at: string;
  is_banned?: boolean;
  violation_count?: number;
}

export interface ReservationManagement {
  id: string;
  owner_name: string;
  sitter_name: string;
  service_type: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  chat_approved: boolean;
}

export interface PaymentManagement {
  id: string;
  reservation_id: string;
  amount: number;
  platform_fee: number;
  sitter_amount: number;
  payment_status: string;
  escrow_status: string;
  created_at: string;
  released_at?: string;
}

export const adminService = {
  async getStatistics(): Promise<AdminStats> {
    const [
      { count: totalUsers },
      { count: totalSitters },
      { count: totalReservations },
      { data: revenueData },
      { data: earningsData },
      { count: activeSubscriptions },
      { count: completedReservations }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('sitters').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('payments')
        .select('amount, sitter_amount, platform_fee')
        .eq('payment_status', 'completed'),
      supabase.from('platform_earnings')
        .select('platform_commission_amount, sitter_payout_amount, status'),
      supabase.from('sitter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase.from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
    ]);

    const totalRevenue = revenueData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const platformEarnings = earningsData
      ?.filter(e => e.status === 'collected')
      .reduce((sum, e) => sum + Number(e.platform_commission_amount), 0) || 0;
    const pendingPayouts = earningsData
      ?.filter(e => e.status === 'collected')
      .reduce((sum, e) => sum + Number(e.sitter_payout_amount), 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      totalSitters: totalSitters || 0,
      totalReservations: totalReservations || 0,
      totalRevenue,
      platformEarnings,
      pendingPayouts,
      activeSubscriptions: activeSubscriptions || 0,
      completedReservations: completedReservations || 0
    };
  },

  async getAllUsers(limit = 50, offset = 0): Promise<UserManagement[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        created_at,
        chat_violations(violation_count, is_banned)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data?.map(user => ({
      id: user.id,
      full_name: user.full_name,
      role: user.role,
      created_at: user.created_at,
      is_banned: user.chat_violations?.[0]?.is_banned || false,
      violation_count: user.chat_violations?.[0]?.violation_count || 0
    })) || [];
  },

  async banUser(userId: string, duration: number = 7): Promise<void> {
    const banExpiresAt = new Date();
    banExpiresAt.setDate(banExpiresAt.getDate() + duration);

    const { error } = await supabase
      .from('chat_violations')
      .upsert({
        user_id: userId,
        is_banned: true,
        ban_expires_at: banExpiresAt.toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async unbanUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_violations')
      .update({
        is_banned: false,
        ban_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getAllReservations(limit = 50, offset = 0): Promise<ReservationManagement[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        service_type,
        start_date,
        end_date,
        total_price,
        status,
        created_at,
        chat_approved,
        owner:profiles!reservations_owner_id_fkey(full_name),
        sitter:sitters!reservations_sitter_id_fkey(
          profile:profiles(full_name)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data?.map(res => ({
      id: res.id,
      owner_name: res.owner?.full_name || 'Unknown',
      sitter_name: res.sitter?.profile?.full_name || 'Unknown',
      service_type: res.service_type,
      start_date: res.start_date,
      end_date: res.end_date,
      total_price: Number(res.total_price),
      status: res.status,
      created_at: res.created_at,
      chat_approved: res.chat_approved
    })) || [];
  },

  async updateReservationStatus(reservationId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('reservations')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservationId);

    if (error) throw error;
  },

  async getAllPayments(limit = 50, offset = 0): Promise<PaymentManagement[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data?.map(payment => ({
      id: payment.id,
      reservation_id: payment.reservation_id,
      amount: Number(payment.amount),
      platform_fee: Number(payment.platform_fee),
      sitter_amount: Number(payment.sitter_amount),
      payment_status: payment.payment_status,
      escrow_status: payment.escrow_status,
      created_at: payment.created_at,
      released_at: payment.released_at
    })) || [];
  },

  async releasePayment(paymentId: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({
        escrow_status: 'released',
        released_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (error) throw error;
  },

  async getPlatformEarnings(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('platform_earnings')
      .select(`
        *,
        reservation:reservations(
          owner:profiles!reservations_owner_id_fkey(full_name),
          sitter:sitters!reservations_sitter_id_fkey(
            profile:profiles(full_name)
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  },

  async getAllReviews(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name),
        sitter:sitters!reviews_sitter_id_fkey(
          profile:profiles(full_name)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }
};
