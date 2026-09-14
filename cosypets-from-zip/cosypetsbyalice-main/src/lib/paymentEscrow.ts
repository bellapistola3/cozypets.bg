import { dbHelpers } from './firebase';

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

    const payment = await dbHelpers.createPayment({
      reservation_id: reservationId,
      amount: totalAmount,
      platform_fee: breakdown.platformFee,
      sitter_amount: breakdown.sitterEarnings,
      payment_method: paymentMethod,
      payment_status: 'completed',
      escrow_status: 'held',
    });

    await dbHelpers.addPlatformEarning({
      reservation_id: reservationId,
      payment_id: payment.id,
      total_amount: totalAmount,
      platform_commission_rate: PLATFORM_COMMISSION_RATE * 100,
      platform_commission_amount: breakdown.platformFee,
      sitter_payout_amount: breakdown.sitterEarnings,
      status: 'pending',
    });

    return { success: true, paymentId: payment.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const releaseEscrowPayment = async (
  reservationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const payment = await dbHelpers.getPaymentByReservation(reservationId);

    if (!payment) {
      return { success: false, error: 'Payment not found or already released' };
    }

    await dbHelpers.updatePaymentEscrow(payment.id, 'released');
    await dbHelpers.updatePlatformEarningStatus(payment.id, 'paid_to_sitter');
    await dbHelpers.updateReservationStatus(reservationId, 'completed');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const completeReservationAndRelease = async (
  reservationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await dbHelpers.updateReservationStatus(reservationId, 'completed');
    // NOTE: Payment release is now MANUAL via admin dashboard
    // Funds remain in escrow until explicitly released
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPaymentStatus = async (reservationId: string) => {
  const payment = await dbHelpers.getPaymentByReservation(reservationId);

  if (!payment) {
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
