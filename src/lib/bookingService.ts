import { supabase } from './supabase';

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
      const existingPet = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', petData.owner_id)
        .eq('name', petData.name)
        .maybeSingle();

      if (existingPet.data) {
        return { data: existingPet.data, error: null };
      }

      const { data, error } = await supabase
        .from('pets')
        .insert([{
          owner_id: petData.owner_id,
          name: petData.name,
          type: petData.type,
          breed: petData.breed,
          age: petData.age,
          weight: petData.weight,
          spayed_neutered: petData.spayed_neutered,
          gender: petData.gender,
          vaccinated: true,
          microchipped: false,
          temperament: [],
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating/getting pet:', error);
      return { data: null, error };
    }
  },

  async checkSitterAvailability(sitterId: string, startDate: string, endDate: string) {
    try {
      const { data: existingReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('sitter_id', sitterId)
        .in('status', ['pending', 'confirmed'])
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

      if (error) throw error;

      const isAvailable = !existingReservations || existingReservations.length === 0;

      return {
        available: isAvailable,
        conflictingReservations: existingReservations || [],
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

    if (sitterId) {
      const { data: pricing } = await supabase
        .from('sitter_pricing')
        .select('price')
        .eq('sitter_id', sitterId)
        .eq('service_type', serviceType)
        .maybeSingle();

      if (pricing?.price) {
        basePrice = Number(pricing.price);
      }
    }

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

      if (reservationData.sitter_id && reservationData.end_date) {
        const availability = await this.checkSitterAvailability(
          reservationData.sitter_id,
          reservationData.start_date,
          reservationData.end_date
        );

        if (!availability.available) {
          return {
            success: false,
            error: 'Ситерът не е наличен за избраните дати.',
          };
        }
      }

      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert([{
          owner_id: reservationData.owner_id,
          sitter_id: reservationData.sitter_id || null,
          pet_id: reservationData.pet_id || null,
          service_type: reservationData.service_type,
          start_date: reservationData.start_date,
          end_date: reservationData.end_date || reservationData.start_date,
          start_time: reservationData.start_time || '09:00',
          end_time: reservationData.end_time || '17:00',
          special_instructions: reservationData.special_instructions || '',
          total_price: reservationData.total_price,
          status: 'pending',
        }])
        .select()
        .single();

      if (reservationError) {
        console.error('Reservation error:', reservationError);
        return {
          success: false,
          error: 'Грешка при създаване на резервацията.',
        };
      }

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          reservation_id: reservation.id,
          amount: reservationData.total_price,
          payment_method: 'credit_card',
          payment_status: 'pending',
          escrow_status: 'held',
          platform_fee: reservationData.total_price * 0.20,
          sitter_amount: reservationData.total_price * 0.75,
        }])
        .select()
        .single();

      if (paymentError) {
        console.warn('Payment record creation failed:', paymentError);
      }

      await supabase
        .from('notifications')
        .insert([{
          user_id: reservationData.owner_id,
          type: 'booking',
          title: 'Резервация създадена',
          message: `Вашата резервация за ${reservationData.service_type} е получена успешно!`,
          action_url: '/dashboard',
          is_read: false,
        }]);

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
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          pet:pets(*),
          sitter:sitters(
            *,
            profile:profiles(*)
          ),
          payment:payments(*)
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return { data: [], error };
    }
  },

  async getSitterReservations(sitterId: string) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          pet:pets(*),
          owner:profiles!reservations_owner_id_fkey(*),
          payment:payments(*)
        `)
        .eq('sitter_id', sitterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching sitter reservations:', error);
      return { data: [], error };
    }
  },

  async updateReservationStatus(reservationId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating reservation status:', error);
      return { data: null, error };
    }
  },
};
