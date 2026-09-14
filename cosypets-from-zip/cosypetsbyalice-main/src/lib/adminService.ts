import { dbHelpers } from './firebase';

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
    const stats = await dbHelpers.getPlatformStats();
    const earnings = await dbHelpers.getAllPlatformEarnings(100);

    const platformEarnings = (earnings as any[])
      ?.filter((e: any) => e.status === 'collected')
      .reduce((sum: number, e: any) => sum + Number(e.platform_commission_amount || 0), 0) || 0;

    const pendingPayouts = (earnings as any[])
      ?.filter((e: any) => e.status === 'collected')
      .reduce((sum: number, e: any) => sum + Number(e.sitter_payout_amount || 0), 0) || 0;

    return {
      totalUsers: stats.totalUsers,
      totalSitters: stats.totalSitters,
      totalReservations: stats.totalReservations,
      totalRevenue: stats.totalRevenue,
      platformEarnings,
      pendingPayouts,
      activeSubscriptions: 0, // Need subscription logic in Firebase
      completedReservations: stats.totalReservations // Simplified
    };
  },

  async getAllUsers(limit = 50, _offset = 0): Promise<UserManagement[]> {
    const users = await dbHelpers.getAllUsers(limit);
    return users.map((user: any) => ({
      id: user.id,
      full_name: user.full_name || user.name || 'Unknown',
      role: user.role || 'user',
      created_at: user.created_at?.toDate?.()?.toISOString() || user.created_at || new Date().toISOString(),
      is_banned: user.is_banned || false,
      violation_count: user.violation_count || 0
    }));
  },

  async banUser(userId: string, duration: number = 7): Promise<void> {
    await dbHelpers.banUser(userId, duration);
  },

  async unbanUser(userId: string): Promise<void> {
    await dbHelpers.unbanUser(userId);
  },

  async getAllReservations(limit = 50, _offset = 0): Promise<ReservationManagement[]> {
    const reservations = await dbHelpers.getAllReservations(limit);
    return reservations.map((res: any) => ({
      id: res.id,
      owner_name: res.owner_name || 'Unknown',
      sitter_name: res.sitter_name || 'Unknown',
      service_type: res.service_type || 'N/A',
      start_date: res.start_date || '',
      end_date: res.end_date || '',
      total_price: Number(res.total_price || 0),
      status: res.status || 'pending',
      created_at: res.created_at?.toDate?.()?.toISOString() || res.created_at || new Date().toISOString(),
      chat_approved: res.chat_approved || false
    }));
  },

  async updateReservationStatus(reservationId: string, status: string): Promise<void> {
    await dbHelpers.updateReservationStatus(reservationId, status);
  },

  async getAllPayments(limit = 50, _offset = 0): Promise<PaymentManagement[]> {
    const payments = await dbHelpers.getAllPayments(limit);
    return payments.map((payment: any) => ({
      id: payment.id,
      reservation_id: payment.reservation_id,
      amount: Number(payment.amount || 0),
      platform_fee: Number(payment.platform_fee || 0),
      sitter_amount: Number(payment.sitter_amount || 0),
      payment_status: payment.payment_status || 'pending',
      escrow_status: payment.escrow_status || 'held',
      created_at: payment.created_at?.toDate?.()?.toISOString() || payment.created_at || new Date().toISOString(),
      released_at: payment.released_at?.toDate?.()?.toISOString() || payment.released_at
    }));
  },

  async releasePayment(paymentId: string): Promise<void> {
    await dbHelpers.updatePaymentEscrow(paymentId, 'released');
    await dbHelpers.updatePlatformEarningStatus(paymentId, 'paid_to_sitter');
  },

  async getPlatformEarnings(limit = 50, _offset = 0) {
    return await dbHelpers.getAllPlatformEarnings(limit);
  },

  async deleteReview(reviewId: string): Promise<void> {
    await dbHelpers.deleteReview(reviewId);
  },

  async getAllReviews(limit = 50, _offset = 0) {
    return await dbHelpers.getAllReviews(limit);
  }
};
