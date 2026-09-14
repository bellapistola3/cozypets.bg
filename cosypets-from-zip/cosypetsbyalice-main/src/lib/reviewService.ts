import { dbHelpers, auth } from './firebase';

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
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    // Simple can_review check - in Firebase we might rely on security rules or UI-level check

    const review = await dbHelpers.createReview({
      reservation_id: data.reservation_id,
      reviewer_id: user.uid,
      sitter_id: data.sitter_id,
      rating: data.rating,
      comment: data.comment,
      is_verified: true
    });

    return review;
  },

  async getSitterReviews(sitterId: string, _limit = 10, _offset = 0) {
    const reviews = await dbHelpers.getReviewsBySitter(sitterId);
    return reviews as Review[];
  },

  async getSitterRating(sitterId: string): Promise<SitterRating | null> {
    const rating = await dbHelpers.getSitterRating(sitterId);
    return rating as SitterRating | null;
  },

  async addSitterResponse(reviewId: string, response: string) {
    await dbHelpers.updateReviewResponse(reviewId, response);
    return { id: reviewId, response };
  },

  async updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
    // Implement in dbHelpers if needed, for now using createReview pattern
    return { id: reviewId, ...data };
  },

  async getReviewByReservation(reservationId: string) {
    // Need a specific query for this
    return null;
  },

  async canReviewReservation(_reservationId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    return true; // Simplified for now
  }
};
