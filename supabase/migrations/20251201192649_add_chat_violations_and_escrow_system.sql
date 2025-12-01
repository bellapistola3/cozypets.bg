/*
  # Add Chat Violations and Escrow Payment System

  1. New Tables
    - `chat_violations`
      - Tracks user violations for sharing contact info
      - Includes violation count, ban status, and ban expiration
    
  2. Changes to Existing Tables
    - `payments` - Add escrow fields
    - `reservations` - Add payment_released field
    
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS chat_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  violation_count integer DEFAULT 0,
  last_violation_at timestamptz,
  is_banned boolean DEFAULT false,
  ban_expires_at timestamptz,
  is_read_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own violations"
  ON chat_violations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage violations"
  ON chat_violations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'escrow_status'
  ) THEN
    ALTER TABLE payments ADD COLUMN escrow_status text DEFAULT 'held' CHECK (escrow_status IN ('held', 'released', 'refunded'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'released_at'
  ) THEN
    ALTER TABLE payments ADD COLUMN released_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'payment_released'
  ) THEN
    ALTER TABLE reservations ADD COLUMN payment_released boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE reservations ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_violations_user_id ON chat_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_escrow_status ON payments(escrow_status);
