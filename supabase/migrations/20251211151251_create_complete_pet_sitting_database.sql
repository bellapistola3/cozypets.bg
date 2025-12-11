/*
  # Създаване на пълна база данни за CozyPets

  ## Нови таблици
  
  ### 1. profiles
  - `id` (uuid, primary key) - връзка с auth.users
  - `full_name` (text) - пълно име
  - `phone` (text) - телефон
  - `avatar_url` (text) - URL на аватар
  - `location_city` (text) - град
  - `location_address` (text) - адрес
  - `bio` (text) - биография
  - `member_since` (timestamptz) - член от
  - `created_at` (timestamptz) - дата на създаване
  - `updated_at` (timestamptz) - дата на обновяване

  ### 2. sitters
  - `id` (uuid, primary key)
  - `profile_id` (uuid) - връзка с profiles
  - `hourly_rate` (decimal) - цена на час
  - `experience_years` (integer) - години опит
  - `is_verified` (boolean) - верифициран
  - `rating` (decimal) - рейтинг
  - `total_reviews` (integer) - брой отзиви
  - `languages` (text[]) - езици
  - `qualifications` (text) - квалификации
  - `services` (text[]) - услуги
  - `pet_types` (text[]) - видове домашни любимци
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. sitter_photos
  - `id` (uuid, primary key)
  - `sitter_id` (uuid) - връзка със sitters
  - `photo_url` (text) - URL на снимка
  - `is_primary` (boolean) - основна снимка
  - `display_order` (integer) - ред на показване
  - `created_at` (timestamptz)

  ### 4. sitter_pricing
  - `id` (uuid, primary key)
  - `sitter_id` (uuid) - връзка със sitters
  - `service_type` (text) - тип услуга
  - `price` (decimal) - цена
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. pets
  - `id` (uuid, primary key)
  - `owner_id` (uuid) - връзка с profiles
  - `name` (text) - име
  - `type` (text) - вид (dog, cat, bird, etc.)
  - `breed` (text) - порода
  - `age` (integer) - възраст
  - `weight` (decimal) - тегло
  - `photo_url` (text) - URL на снимка
  - `vaccinated` (boolean) - ваксиниран
  - `spayed_neutered` (boolean) - кастриран
  - `microchipped` (boolean) - чипиран
  - `temperament` (text[]) - темперамент
  - `medical_info` (text) - медицинска информация
  - `special_needs` (text) - специални нужди
  - `emergency_vet_name` (text) - име на ветеринар
  - `emergency_vet_phone` (text) - телефон на ветеринар
  - `emergency_vet_address` (text) - адрес на ветеринар
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. reservations
  - `id` (uuid, primary key)
  - `owner_id` (uuid) - връзка с profiles
  - `sitter_id` (uuid) - връзка със sitters
  - `pet_id` (uuid) - връзка с pets
  - `service_type` (text) - тип услуга
  - `start_date` (date) - начална дата
  - `end_date` (date) - крайна дата
  - `start_time` (time) - начален час
  - `end_time` (time) - краен час
  - `total_price` (decimal) - обща цена
  - `status` (text) - статус (pending, confirmed, completed, cancelled)
  - `special_instructions` (text) - специални инструкции
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. reviews
  - `id` (uuid, primary key)
  - `reservation_id` (uuid) - връзка с reservations
  - `reviewer_id` (uuid) - връзка с profiles (който оставя отзив)
  - `sitter_id` (uuid) - връзка със sitters (за когото е отзивът)
  - `rating` (integer) - оценка (1-5)
  - `comment` (text) - коментар
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. payments
  - `id` (uuid, primary key)
  - `reservation_id` (uuid) - връзка с reservations
  - `amount` (decimal) - сума
  - `payment_method` (text) - метод на плащане
  - `payment_status` (text) - статус (pending, completed, failed, refunded)
  - `payment_date` (timestamptz) - дата на плащане
  - `transaction_id` (text) - ID на транзакция
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. messages
  - `id` (uuid, primary key)
  - `sender_id` (uuid) - изпращач
  - `receiver_id` (uuid) - получател
  - `reservation_id` (uuid, optional) - връзка с резервация
  - `content` (text) - съдържание
  - `message_type` (text) - тип (text, image, file)
  - `is_read` (boolean) - прочетено
  - `read_at` (timestamptz) - кога е прочетено
  - `created_at` (timestamptz)

  ### 10. notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid) - потребител
  - `type` (text) - тип (reservation, payment, review, message, system)
  - `title` (text) - заглавие
  - `message` (text) - съобщение
  - `is_read` (boolean) - прочетено
  - `action_url` (text) - URL за действие
  - `created_at` (timestamptz)

  ### 11. favorites
  - `id` (uuid, primary key)
  - `user_id` (uuid) - потребител
  - `sitter_id` (uuid) - любим sitter
  - `created_at` (timestamptz)

  ### 12. availability
  - `id` (uuid, primary key)
  - `sitter_id` (uuid) - sitter
  - `day_of_week` (integer) - ден от седмицата (0-6)
  - `start_time` (time) - начален час
  - `end_time` (time) - краен час
  - `is_available` (boolean) - наличен
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Сигурност
  - Включен RLS за всички таблици
  - Политики за достъп базирани на auth.uid()
  - Потребителите могат да виждат и променят само собствените си данни
  - Публичен достъп за информация за sitters (четене)
  - Sitters могат да променят само собствените си профили
*/

-- Създаване на таблица за профили
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

-- Създаване на таблица за sitters
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

-- Създаване на таблица за снимки на sitters
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

-- Създаване на таблица за ценообразуване на sitters
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

-- Създаване на таблица за домашни любимци
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

-- Създаване на таблица за резервации
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

-- Създаване на таблица за отзиви
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

-- Създаване на таблица за плащания
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

-- Създаване на таблица за съобщения
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

-- Създаване на таблица за известия
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

-- Създаване на таблица за любими sitters
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

-- Създаване на таблица за наличност на sitters
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

-- Създаване на индекси за по-добра производителност
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

-- Функция за автоматично обновяване на updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригери за автоматично обновяване на updated_at
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

-- Функция за автоматично обновяване на рейтинга на sitter
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

-- Тригер за автоматично обновяване на рейтинга
CREATE TRIGGER update_sitter_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_sitter_rating();