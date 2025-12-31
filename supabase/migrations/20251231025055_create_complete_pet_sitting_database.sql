/*
  # Створення повної бази даних для CozyPets

  ## Нові таблиці
  
  ### 1. profiles
  - `id` (uuid, primary key) - зв'язок з auth.users
  - `full_name` (text) - повне ім'я
  - `phone` (text) - телефон
  - `avatar_url` (text) - URL аватара
  - `location_city` (text) - місто
  - `location_address` (text) - адреса
  - `bio` (text) - біографія
  - `member_since` (timestamptz) - член з
  - `created_at` (timestamptz) - дата створення
  - `updated_at` (timestamptz) - дата оновлення

  ### 2. sitters
  - `id` (uuid, primary key)
  - `profile_id` (uuid) - зв'язок з profiles
  - `hourly_rate` (decimal) - ціна на годину
  - `experience_years` (integer) - роки досвіду
  - `is_verified` (boolean) - верифікований
  - `rating` (decimal) - рейтинг
  - `total_reviews` (integer) - кількість відгуків
  - `languages` (text[]) - мови
  - `qualifications` (text) - кваліфікації
  - `services` (text[]) - послуги
  - `pet_types` (text[]) - види домашніх улюбленців
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3-12. Інші таблиці для повної функціональності

  ## Безпека
  - Включений RLS для всіх таблиць
  - Політики доступу базовані на auth.uid()
  - Користувачі можуть бачити і змінювати тільки власні дані
*/

-- Створення таблиці профілів
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  location_city text,
  location_address text,
  bio text,
  member_since timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Створення таблиці sitters
CREATE TABLE IF NOT EXISTS sitters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hourly_rate decimal(10,2) DEFAULT 0,
  experience_years integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  languages text[] DEFAULT '{}',
  qualifications text,
  services text[] DEFAULT '{}',
  pet_types text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

ALTER TABLE sitters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sitters"
  ON sitters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sitters can update own profile"
  ON sitters FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can create sitter profile"
  ON sitters FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Створення таблиці фото sitters
CREATE TABLE IF NOT EXISTS sitter_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  photo_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sitter_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sitter photos"
  ON sitter_photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sitters can manage own photos"
  ON sitter_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_photos.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_photos.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Створення таблиці ціноутворення sitters
CREATE TABLE IF NOT EXISTS sitter_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  service_type text NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sitter_id, service_type)
);

ALTER TABLE sitter_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sitter pricing"
  ON sitter_pricing FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sitters can manage own pricing"
  ON sitter_pricing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_pricing.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_pricing.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Створення таблиці домашніх улюбленців
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  breed text,
  age integer,
  weight decimal(5,2),
  photo_url text,
  vaccinated boolean DEFAULT false,
  spayed_neutered boolean DEFAULT false,
  microchipped boolean DEFAULT false,
  temperament text[] DEFAULT '{}',
  medical_info text,
  special_needs text,
  emergency_vet_name text,
  emergency_vet_phone text,
  emergency_vet_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert own pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete own pets"
  ON pets FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Створення таблиці резервацій
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  service_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time,
  end_time time,
  total_price decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  special_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Sitters can view their reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = reservations.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

CREATE POLICY "Owners can create reservations"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Sitters can update their reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = reservations.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = reservations.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Створення таблиці відгуків
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(reservation_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can create reviews for their reservations"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM reservations
      WHERE reservations.id = reviews.reservation_id
      AND reservations.owner_id = auth.uid()
      AND reservations.status = 'completed'
    )
  );

CREATE POLICY "Reviewers can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

-- Створення таблиці платежів
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date timestamptz,
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reservations
      WHERE reservations.id = payments.reservation_id
      AND reservations.owner_id = auth.uid()
    )
  );

CREATE POLICY "Sitters can view their payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reservations r
      JOIN sitters s ON s.id = r.sitter_id
      WHERE r.id = payments.reservation_id
      AND s.profile_id = auth.uid()
    )
  );

-- Створення таблиці повідомлень
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reservation_id uuid REFERENCES reservations(id) ON DELETE SET NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- Створення таблиці сповіщень
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('reservation', 'payment', 'review', 'message', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Створення таблиці улюблених sitters
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, sitter_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Створення таблиці доступності sitters
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sitter availability"
  ON availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sitters can manage own availability"
  ON availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = availability.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = availability.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Створення індексів для кращої продуктивності
CREATE INDEX IF NOT EXISTS idx_sitters_profile_id ON sitters(profile_id);
CREATE INDEX IF NOT EXISTS idx_sitters_rating ON sitters(rating DESC);
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_reservations_owner_id ON reservations(owner_id);
CREATE INDEX IF NOT EXISTS idx_reservations_sitter_id ON reservations(sitter_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reviews_sitter_id ON reviews(sitter_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригери для автоматичного оновлення updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sitters_updated_at BEFORE UPDATE ON sitters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sitter_pricing_updated_at BEFORE UPDATE ON sitter_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функція для автоматичного оновлення рейтингу sitter
CREATE OR REPLACE FUNCTION update_sitter_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sitters
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE sitter_id = NEW.sitter_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE sitter_id = NEW.sitter_id
    )
  WHERE id = NEW.sitter_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для автоматичного оновлення рейтингу
CREATE TRIGGER update_sitter_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_sitter_rating();