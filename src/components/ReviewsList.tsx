import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import { reviewService, Review, SitterRating } from '../lib/reviewService';

interface ReviewsListProps {
  sitterId: string;
  showRatingSummary?: boolean;
}

export default function ReviewsList({ sitterId, showRatingSummary = true }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<SitterRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, [sitterId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [reviewsData, ratingData] = await Promise.all([
        reviewService.getSitterReviews(sitterId),
        reviewService.getSitterRating(sitterId)
      ]);
      setReviews(reviewsData);
      setRating(ratingData);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showRatingSummary && rating && rating.total_reviews > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {rating.average_rating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(rating.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {rating.total_reviews} {rating.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = rating.rating_breakdown[star.toString() as keyof typeof rating.rating_breakdown] || 0;
                const percentage = rating.total_reviews > 0
                  ? (count / rating.total_reviews) * 100
                  : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{star}</span>
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No reviews yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Be the first to review this sitter
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.reviewer?.avatar_url ? (
                    <img
                      src={review.reviewer.avatar_url}
                      alt={review.reviewer.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.reviewer?.full_name || 'Anonymous'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        {review.is_verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {review.response && (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Response from sitter
                      </p>
                      <p className="text-gray-700 text-sm">{review.response}</p>
                      {review.response_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(review.response_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
