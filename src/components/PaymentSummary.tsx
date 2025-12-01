import React, { useState, useEffect } from 'react';
import { DollarSign, Lock, CheckCircle, Clock } from 'lucide-react';
import { getPaymentStatus, PaymentBreakdown, calculatePaymentBreakdown } from '../lib/paymentEscrow';

interface PaymentSummaryProps {
  reservationId: string;
  totalAmount?: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ reservationId, totalAmount }) => {
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<PaymentBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
  }, [reservationId]);

  const loadPaymentData = async () => {
    setLoading(true);

    const status = await getPaymentStatus(reservationId);

    if (status) {
      setPaymentStatus(status);
      setBreakdown({
        totalAmount: status.amount,
        platformFee: status.platformFee,
        sitterEarnings: status.sitterAmount
      });
    } else if (totalAmount) {
      setBreakdown(calculatePaymentBreakdown(totalAmount));
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!breakdown) {
    return null;
  }

  const getEscrowStatusDisplay = () => {
    if (!paymentStatus) {
      return {
        icon: Clock,
        text: 'Payment Pending',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      };
    }

    if (paymentStatus.escrowStatus === 'held') {
      return {
        icon: Lock,
        text: 'Funds Held in Escrow',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      };
    }

    if (paymentStatus.escrowStatus === 'released') {
      return {
        icon: CheckCircle,
        text: 'Payment Released',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    }

    return {
      icon: Clock,
      text: 'Processing',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    };
  };

  const statusDisplay = getEscrowStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          Payment Summary
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusDisplay.bgColor}`}>
          <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
          <span className={`text-sm font-semibold ${statusDisplay.color}`}>
            {statusDisplay.text}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-xl font-bold text-gray-900">
            {breakdown.totalAmount.toFixed(2)} лв
          </span>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Platform Fee (20%)</span>
            <span className="text-lg font-semibold text-orange-600">
              {breakdown.platformFee.toFixed(2)} лв
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Sitter Earnings (80%)</span>
            <span className="text-lg font-semibold text-green-600">
              {breakdown.sitterEarnings.toFixed(2)} лв
            </span>
          </div>
        </div>

        {paymentStatus?.escrowStatus === 'held' && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Secure Escrow</p>
                <p className="text-sm text-blue-800 mt-1">
                  Funds are securely held and will be released to the sitter automatically when the booking is marked as completed.
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus?.escrowStatus === 'released' && paymentStatus.releasedAt && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900">Payment Completed</p>
                <p className="text-sm text-green-800 mt-1">
                  Payment was released to the sitter on {new Date(paymentStatus.releasedAt).toLocaleString('bg-BG')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
