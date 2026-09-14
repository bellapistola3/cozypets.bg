import { dbHelpers } from './firebase';

export interface CreateReservationData {
  owner_id: string;
  sitter_id?: string;
  pet_id?: string;
  service_type: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  special_instructions?: string;
  total_price?: number;
}

export interface CreatePetData {
  owner_id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  spayed_neutered: boolean;
  gender: 'male' | 'female';
}

export interface BookingResult {
  success: boolean;
  reservation?: any;
  pet?: any;
  payment?: any;
  error?: string;
}

export const bookingService = {
  async createOrGetPet(petData: CreatePetData) {
    try {
      const pet = await dbHelpers.getPetByName(petData.owner_id, petData.name);
      if (pet) return { data: pet, error: null };

      const newPet = await dbHelpers.createPet(petData);
      return { data: newPet, error: null };
    } catch (error) {
      console.error('Error creating/getting pet:', error);
      return { data: null, error };
    }
  },

  async checkSitterAvailability(_sitterId: string, startDate: string, endDate: string) {
    try {
      const availability = await dbHelpers.checkSitterAvailability(_sitterId, startDate, endDate);
      return {
        available: availability.available,
        conflictingReservations: availability.conflicts,
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: true, conflictingReservations: [] };
    }
  },

  async calculatePrice(
    serviceType: string,
    startDate: string,
    endDate?: string,
    sitterId?: string
  ) {
    const servicePrices: { [key: string]: number } = {
      'daily-walks': 20,
      'home-visits': 25,
      'overnight': 50,
      'pet-taxi': 30,
      'grooming': 40,
    };

    let basePrice = servicePrices[serviceType] || 25;

    // Sitter specific pricing not yet implemented in firebase helpers, using base

    let days = 1;
    if (endDate && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      days = Math.max(1, days);
    }

    const subtotal = basePrice * days;
    const platformFee = subtotal * 0.20;
    const serviceFee = subtotal * 0.05;
    const insurance = 15;
    const total = subtotal + platformFee + serviceFee + insurance;

    return {
      basePrice,
      days,
      subtotal,
      platformFee,
      serviceFee,
      insurance,
      total,
    };
  },

  async createReservation(reservationData: CreateReservationData): Promise<BookingResult> {
    try {
      if (!reservationData.total_price) {
        const pricing = await this.calculatePrice(
          reservationData.service_type,
          reservationData.start_date,
          reservationData.end_date,
          reservationData.sitter_id
        );
        reservationData.total_price = pricing.total;
      }

      const reservation = await dbHelpers.createReservation({
        ...reservationData,
        status: 'pending'
      });

      const payment = await dbHelpers.createPayment({
        reservation_id: reservation.id,
        amount: reservationData.total_price,
        payment_method: 'credit_card',
        payment_status: 'pending',
        escrow_status: 'held',
        platform_fee: reservationData.total_price * 0.20,
        sitter_amount: reservationData.total_price * 0.75,
      });

      return {
        success: true,
        reservation,
        payment,
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return {
        success: false,
        error: 'Възникна грешка. Моля, опитайте отново.',
      };
    }
  },

  async getUserReservations(userId: string) {
    try {
      const data = await dbHelpers.getUserReservations(userId);
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return { data: [], error };
    }
  },

  async getSitterReservations(sitterId: string) {
    try {
      const data = await dbHelpers.getSitterReservations(sitterId);
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching sitter reservations:', error);
      return { data: [], error };
    }
  },

  async updateReservationStatus(reservationId: string, status: string) {
    try {
      await dbHelpers.updateReservationStatus(reservationId, status);
      return { data: { id: reservationId, status }, error: null };
    } catch (error) {
      console.error('Error updating reservation status:', error);
      return { data: null, error };
    }
  },
};
