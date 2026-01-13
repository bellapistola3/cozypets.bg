import { supabase } from './supabase';

const PLATFORM_COMMISSION_RATE = 0.25;

export interface PaymentBreakdown {
  totalAmount: number;
  platformFee: number;
  sitterEarnings: number;
}

export const calculatePaymentBreakdown = (totalAmount: number): PaymentBreakdown => {
  const platformFee = totalAmount * PLATFORM_COMMISSION_RATE;
  const sitterEarnings = totalAmount - platformFee;

  return {
    totalAmount,
    platformFee,
    sitterEarnings
  };
};

export const createEscrowPayment = async (
  reservationId: string,
  totalAmount: number,
  paymentMethod: string
): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
  try {
    const breakdown = calculatePaymentBreakdown(totalAmount);

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: reservationId,
        amount: totalAmount,
        platform_fee: breakdown.platformFee,
        sitter_amount: breakdown.sitterEarnings,
        payment_method: paymentMethod,
        payment_status: 'completed',
        escrow_status: 'held',
        payment_date: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      return { success: false, error: paymentError.message };
    }

    const { error: earningsError } = await supabase
      .from('platform_earnings')
      .insert({
        reservation_id: reservationId,
        payment_id: payment.id,
        total_amount: totalAmount,
        platform_commission_rate: PLATFORM_COMMISSION_RATE * 100,
        platform_commission_amount: breakdown.platformFee,
        sitter_payout_amount: breakdown.sitterEarnings,
        status: 'pending',
        collected_at: new Date().toISOString()
      });

    if (earningsError) {
      return { success: false, error: earningsError.message };
    }

    return { success: true, paymentId: payment.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const releaseEscrowPayment = async (
  reservationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .select('id, status')
      .eq('id', reservationId)
      .single();

    if (resError || !reservation) {
      return { success: false, error: 'Reservation not found' };
    }

    if (reservation.status !== 'completed') {
      return { success: false, error: 'Reservation must be completed before releasing payment' };
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('id')
      .eq('reservation_id', reservationId)
      .eq('escrow_status', 'held')
      .single();

    if (paymentError || !payment) {
      return { success: false, error: 'Payment not found or already released' };
    }

    const now = new Date().toISOString();

    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        escrow_status: 'released',
        released_at: now
      })
      .eq('id', payment.id);

    if (updatePaymentError) {
      return { success: false, error: updatePaymentError.message };
    }

    const { error: updateEarningsError } = await supabase
      .from('platform_earnings')
      .update({
        status: 'paid_to_sitter',
        paid_to_sitter_at: now
      })
      .eq('payment_id', payment.id);

    if (updateEarningsError) {
      return { success: false, error: updateEarningsError.message };
    }

    const { error: updateReservationError } = await supabase
      .from('reservations')
      .update({
        payment_released: true
      })
      .eq('id', reservationId);

    if (updateReservationError) {
      return { success: false, error: updateReservationError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const completeReservationAndRelease = async (
  reservationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('reservations')
      .update({
        status: 'completed',
        completed_at: now
      })
      .eq('id', reservationId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // NOTE: Payment release is now MANUAL via admin dashboard
    // Funds remain in escrow until explicitly released
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPaymentStatus = async (reservationId: string) => {
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('reservation_id', reservationId)
    .maybeSingle();

  if (error || !payment) {
    return null;
  }

  return {
    amount: payment.amount,
    platformFee: payment.platform_fee,
    sitterAmount: payment.sitter_amount,
    status: payment.payment_status,
    escrowStatus: payment.escrow_status,
    releasedAt: payment.released_at
  };
};
