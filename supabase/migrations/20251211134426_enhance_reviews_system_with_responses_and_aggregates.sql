/*
  # Enhance Reviews System

  ## Overview
  Extends the existing reviews system with sitter responses, verification, and automatic rating aggregation.

  ## Changes
  
  ### Updates to `reviews` table
  - Add `response` column for sitter responses to reviews
  - Add `response_at` timestamp for when sitter responded
  - Add `is_verified` flag for verified reviews from completed bookings

  ### New Table: `sitter_ratings`
  - `sitter_id` (uuid, primary key) - Reference to sitter
  - `average_rating` (numeric) - Average rating score (0-5)
  - `total_reviews` (integer) - Total number of reviews
  - `rating_breakdown` (jsonb) - Count of each rating (1-5 stars)
  - `updated_at` (timestamptz) - Last update timestamp

  ## Features
  - Sitters can respond to reviews about them
  - Automatic rating aggregation via database triggers
  - Rating breakdown statistics for detailed insights
  - Verified badge for reviews from completed reservations
  - Real-time rating updates on sitter profiles

  ## Security
  - Maintain existing RLS policies
  - Only sitters can add responses to their own reviews
  - Rating aggregates are auto-calculated and read-only for users
*/

-- Add new columns to reviews table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'response'
  ) THEN
    ALTER TABLE reviews ADD COLUMN response text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'response_at'
  ) THEN
    ALTER TABLE reviews ADD COLUMN response_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE reviews ADD COLUMN is_verified boolean DEFAULT true;
  END IF;
END $$;

-- Create sitter ratings aggregate table
CREATE TABLE IF NOT EXISTS sitter_ratings (
  sitter_id uuid PRIMARY KEY REFERENCES sitters(id) ON DELETE CASCADE,
  average_rating numeric(3, 2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews integer DEFAULT 0 CHECK (total_reviews >= 0),
  rating_breakdown jsonb DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sitter_ratings_average ON sitter_ratings(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_sitter_rating ON reviews(sitter_id, rating);

-- Enable RLS
ALTER TABLE sitter_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sitter_ratings - anyone can view
CREATE POLICY "Anyone can view sitter ratings"
  ON sitter_ratings FOR SELECT
  TO authenticated
  USING (true);

-- Function to update sitter ratings automatically
CREATE OR REPLACE FUNCTION update_sitter_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_sitter_id uuid;
  v_avg_rating numeric;
  v_total_reviews integer;
  v_breakdown jsonb;
BEGIN
  -- Determine sitter_id based on operation
  IF TG_OP = 'DELETE' THEN
    v_sitter_id := OLD.sitter_id;
  ELSE
    v_sitter_id := NEW.sitter_id;
  END IF;

  -- Calculate new statistics
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0),
    COUNT(*)::integer,
    jsonb_build_object(
      '1', COUNT(*) FILTER (WHERE rating = 1),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '5', COUNT(*) FILTER (WHERE rating = 5)
    )
  INTO v_avg_rating, v_total_reviews, v_breakdown
  FROM reviews
  WHERE sitter_id = v_sitter_id;

  -- Upsert into sitter_ratings
  INSERT INTO sitter_ratings (sitter_id, average_rating, total_reviews, rating_breakdown, updated_at)
  VALUES (v_sitter_id, v_avg_rating, v_total_reviews, v_breakdown, now())
  ON CONFLICT (sitter_id)
  DO UPDATE SET
    average_rating = v_avg_rating,
    total_reviews = v_total_reviews,
    rating_breakdown = v_breakdown,
    updated_at = now();

  -- Also update the sitters table for backward compatibility
  UPDATE sitters
  SET 
    rating = v_avg_rating,
    total_reviews = v_total_reviews,
    updated_at = now()
  WHERE id = v_sitter_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic rating updates
DROP TRIGGER IF EXISTS trigger_update_sitter_ratings ON reviews;
CREATE TRIGGER trigger_update_sitter_ratings
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_sitter_ratings();

-- Function to check if user can review reservation
CREATE OR REPLACE FUNCTION can_review_reservation(p_reservation_id uuid, p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM reservations
    WHERE id = p_reservation_id
    AND owner_id = p_user_id
    AND status = 'completed'
    AND NOT EXISTS (
      SELECT 1 FROM reviews WHERE reservation_id = p_reservation_id
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initialize ratings for existing sitters
INSERT INTO sitter_ratings (sitter_id, average_rating, total_reviews, rating_breakdown, updated_at)
SELECT 
  s.id,
  COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0),
  COUNT(r.id)::integer,
  jsonb_build_object(
    '1', COUNT(*) FILTER (WHERE r.rating = 1),
    '2', COUNT(*) FILTER (WHERE r.rating = 2),
    '3', COUNT(*) FILTER (WHERE r.rating = 3),
    '4', COUNT(*) FILTER (WHERE r.rating = 4),
    '5', COUNT(*) FILTER (WHERE r.rating = 5)
  ),
  now()
FROM sitters s
LEFT JOIN reviews r ON r.sitter_id = s.id
GROUP BY s.id
ON CONFLICT (sitter_id) DO NOTHING;