/*
  # CozyPets Database Schema

  1. New Tables
    - `users` - User accounts (owners and potential sitters)
    - `sitters` - Pet sitter profiles linked to users
    - `pets` - Pet information owned by users
    - `reservations` - Booking records between owners and sitters
    - `reviews` - Reviews written by owners for sitters
    - `payments` - Payment records for reservations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Relationships
    - Users can own multiple pets
    - Users can become sitters
    - Reservations link owners, sitters, and pets
    - Reviews are tied to completed reservations
    - Payments are linked to reservations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create sitters table
CREATE TABLE IF NOT EXISTS sitters (
  sitter_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  bio TEXT,
  photo_url TEXT,
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  location VARCHAR(255) NOT NULL,
  qualifications TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  pet_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  age INTEGER CHECK (age >= 0),
  health_status TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  reservation_id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  sitter_id INTEGER REFERENCES sitters(sitter_id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(pet_id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  reservation_id INTEGER REFERENCES reservations(reservation_id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  sitter_id INTEGER REFERENCES sitters(sitter_id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  reservation_id INTEGER REFERENCES reservations(reservation_id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'credit_card' CHECK (payment_method IN ('credit_card', 'paypal', 'bank_transfer')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_date TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create policies for sitters table
CREATE POLICY "Anyone can read sitter profiles"
  ON sitters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sitters can update own profile"
  ON sitters
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create sitter profile"
  ON sitters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create policies for pets table
CREATE POLICY "Users can read own pets"
  ON pets
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own pets"
  ON pets
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create policies for reservations table
CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = owner_id::text OR 
    auth.uid()::text IN (SELECT user_id::text FROM sitters WHERE sitter_id = reservations.sitter_id)
  );

CREATE POLICY "Owners can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Participants can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::text = owner_id::text OR 
    auth.uid()::text IN (SELECT user_id::text FROM sitters WHERE sitter_id = reservations.sitter_id)
  );

-- Create policies for reviews table
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = reviewer_id::text);

-- Create policies for payments table
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text IN (
      SELECT owner_id::text FROM reservations WHERE reservation_id = payments.reservation_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sitters_user_id ON sitters(user_id);
CREATE INDEX IF NOT EXISTS idx_sitters_location ON sitters(location);
CREATE INDEX IF NOT EXISTS idx_sitters_rating ON sitters(rating);
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_owner_id ON reservations(owner_id);
CREATE INDEX IF NOT EXISTS idx_reservations_sitter_id ON reservations(sitter_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reviews_sitter_id ON reviews(sitter_id);
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON payments(reservation_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sitters_updated_at BEFORE UPDATE ON sitters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();