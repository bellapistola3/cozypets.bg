import { supabase } from './supabase';

export interface Review {
  id: string;
  reservation_id: string;
  reviewer_id: string;
  sitter_id: string;
  rating: number;
  comment: string;
  response?: string;
  response_at?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  reviewer?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface SitterRating {
  sitter_id: string;
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  updated_at: string;
}

export const reviewService = {
  async createReview(data: {
    reservation_id: string;
    sitter_id: string;
    rating: number;
    comment: string;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('Not authenticated');

    const { data: canReview } = await supabase.rpc('can_review_reservation', {
      p_reservation_id: data.reservation_id,
      p_user_id: session.session.user.id
    });

    if (!canReview) {
      throw new Error('Cannot review this reservation');
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        reservation_id: data.reservation_id,
        reviewer_id: session.session.user.id,
        sitter_id: data.sitter_id,
        rating: data.rating,
        comment: data.comment,
        is_verified: true
      })
      .select()
      .single();

    if (error) throw error;
    return review;
  },

  async getSitterReviews(sitterId: string, limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
      `)
      .eq('sitter_id', sitterId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Review[];
  },

  async getSitterRating(sitterId: string): Promise<SitterRating | null> {
    const { data, error } = await supabase
      .from('sitter_ratings')
      .select('*')
      .eq('sitter_id', sitterId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async addSitterResponse(reviewId: string, response: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        response,
        response_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return review;
  },

  async getReviewByReservation(reservationId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
      `)
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (error) throw error;
    return data as Review | null;
  },

  async canReviewReservation(reservationId: string): Promise<boolean> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return false;

    const { data, error } = await supabase.rpc('can_review_reservation', {
      p_reservation_id: reservationId,
      p_user_id: session.session.user.id
    });

    if (error) return false;
    return data === true;
  }
};
