/*
  # Добавяне на ветеринарна чат система

  ## Нови таблици

  ### 1. veterinarians
  - `id` (uuid, primary key)
  - `profile_id` (uuid) - връзка с profiles
  - `specialization` (text) - специализация
  - `license_number` (text) - номер на лиценз
  - `years_of_experience` (integer) - години опит
  - `is_online` (boolean) - онлайн статус
  - `is_available` (boolean) - наличен за чат
  - `rating` (decimal) - рейтинг
  - `total_consultations` (integer) - брой консултации
  - `response_time_avg` (integer) - среден отговор в минути
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. vet_chat_rooms
  - `id` (uuid, primary key)
  - `user_id` (uuid) - потребител (собственик/гледач)
  - `veterinarian_id` (uuid) - ветеринар
  - `pet_id` (uuid, optional) - домашен любимец
  - `subject` (text) - тема на чата
  - `urgency_level` (text) - ниво на спешност
  - `status` (text) - статус (open, in_progress, closed)
  - `started_at` (timestamptz) - начало
  - `closed_at` (timestamptz) - край
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. vet_chat_messages
  - `id` (uuid, primary key)
  - `chat_room_id` (uuid) - чат стая
  - `sender_id` (uuid) - изпращач
  - `sender_type` (text) - тип изпращач (user, veterinarian)
  - `message` (text) - съобщение
  - `message_type` (text) - тип (text, image, file)
  - `file_url` (text) - URL на файл
  - `is_read` (boolean) - прочетено
  - `read_at` (timestamptz) - кога е прочетено
  - `created_at` (timestamptz)

  ### 4. vet_consultations
  - `id` (uuid, primary key)
  - `chat_room_id` (uuid) - чат стая
  - `diagnosis` (text) - диагноза
  - `recommendations` (text) - препоръки
  - `follow_up_needed` (boolean) - нужно последващо наблюдение
  - `follow_up_date` (timestamptz) - дата за последващо
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. vet_availability
  - `id` (uuid, primary key)
  - `veterinarian_id` (uuid) - ветеринар
  - `day_of_week` (integer) - ден от седмицата
  - `start_time` (time) - начален час
  - `end_time` (time) - краен час
  - `is_available` (boolean) - наличен
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Сигурност
  - RLS политики за всички таблици
  - Потребителите виждат само собствените си чатове
  - Ветеринарите виждат своите назначени чатове
  - Автоматично присвояване на наличен ветеринар
*/

-- Създаване на таблица за ветеринари
CREATE TABLE IF NOT EXISTS veterinarians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialization text NOT NULL,
  license_number text NOT NULL UNIQUE,
  years_of_experience integer DEFAULT 0,
  is_online boolean DEFAULT false,
  is_available boolean DEFAULT true,
  rating decimal(3,2) DEFAULT 5.00,
  total_consultations integer DEFAULT 0,
  response_time_avg integer DEFAULT 5,
  bio text,
  languages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view veterinarians"
  ON veterinarians FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Veterinarians can update own profile"
  ON veterinarians FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Създаване на таблица за чат стаи с ветеринари
CREATE TABLE IF NOT EXISTS vet_chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  veterinarian_id uuid REFERENCES veterinarians(id) ON DELETE SET NULL,
  pet_id uuid REFERENCES pets(id) ON DELETE SET NULL,
  subject text NOT NULL,
  urgency_level text DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'emergency')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'waiting')),
  started_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vet_chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat rooms"
  ON vet_chat_rooms FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Veterinarians can view assigned chat rooms"
  ON vet_chat_rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM veterinarians
      WHERE veterinarians.id = vet_chat_rooms.veterinarian_id
      AND veterinarians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat rooms"
  ON vet_chat_rooms FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat rooms"
  ON vet_chat_rooms FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Veterinarians can update assigned chat rooms"
  ON vet_chat_rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM veterinarians
      WHERE veterinarians.id = vet_chat_rooms.veterinarian_id
      AND veterinarians.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM veterinarians
      WHERE veterinarians.id = vet_chat_rooms.veterinarian_id
      AND veterinarians.profile_id = auth.uid()
    )
  );

-- Създаване на таблица за съобщения в ветеринарен чат
CREATE TABLE IF NOT EXISTS vet_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id uuid REFERENCES vet_chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'veterinarian')),
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url text,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vet_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own chat rooms"
  ON vet_chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms
      WHERE vet_chat_rooms.id = vet_chat_messages.chat_room_id
      AND vet_chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can view messages in assigned chat rooms"
  ON vet_chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_chat_messages.chat_room_id
      AND v.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in own chat rooms"
  ON vet_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM vet_chat_rooms
      WHERE vet_chat_rooms.id = vet_chat_messages.chat_room_id
      AND vet_chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can send messages in assigned chat rooms"
  ON vet_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_chat_messages.chat_room_id
      AND v.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can mark messages as read in own chat rooms"
  ON vet_chat_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms
      WHERE vet_chat_rooms.id = vet_chat_messages.chat_room_id
      AND vet_chat_rooms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms
      WHERE vet_chat_rooms.id = vet_chat_messages.chat_room_id
      AND vet_chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can mark messages as read in assigned rooms"
  ON vet_chat_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_chat_messages.chat_room_id
      AND v.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_chat_messages.chat_room_id
      AND v.profile_id = auth.uid()
    )
  );

-- Създаване на таблица за консултации
CREATE TABLE IF NOT EXISTS vet_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id uuid REFERENCES vet_chat_rooms(id) ON DELETE CASCADE NOT NULL UNIQUE,
  diagnosis text,
  recommendations text,
  follow_up_needed boolean DEFAULT false,
  follow_up_date timestamptz,
  prescription text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vet_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultations"
  ON vet_consultations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms
      WHERE vet_chat_rooms.id = vet_consultations.chat_room_id
      AND vet_chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can view consultations for assigned rooms"
  ON vet_consultations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_consultations.chat_room_id
      AND v.profile_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can create consultations"
  ON vet_consultations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_consultations.chat_room_id
      AND v.profile_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can update own consultations"
  ON vet_consultations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_consultations.chat_room_id
      AND v.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vet_chat_rooms vcr
      JOIN veterinarians v ON v.id = vcr.veterinarian_id
      WHERE vcr.id = vet_consultations.chat_room_id
      AND v.profile_id = auth.uid()
    )
  );

-- Създаване на таблица за наличност на ветеринари
CREATE TABLE IF NOT EXISTS vet_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veterinarian_id uuid REFERENCES veterinarians(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vet_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vet availability"
  ON vet_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Veterinarians can manage own availability"
  ON vet_availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM veterinarians
      WHERE veterinarians.id = vet_availability.veterinarian_id
      AND veterinarians.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM veterinarians
      WHERE veterinarians.id = vet_availability.veterinarian_id
      AND veterinarians.profile_id = auth.uid()
    )
  );

-- Индекси за производителност
CREATE INDEX IF NOT EXISTS idx_veterinarians_profile_id ON veterinarians(profile_id);
CREATE INDEX IF NOT EXISTS idx_veterinarians_is_available ON veterinarians(is_available);
CREATE INDEX IF NOT EXISTS idx_vet_chat_rooms_user_id ON vet_chat_rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_vet_chat_rooms_veterinarian_id ON vet_chat_rooms(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_vet_chat_rooms_status ON vet_chat_rooms(status);
CREATE INDEX IF NOT EXISTS idx_vet_chat_messages_chat_room_id ON vet_chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_vet_chat_messages_sender_id ON vet_chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_vet_chat_messages_created_at ON vet_chat_messages(created_at);

-- Тригери за updated_at
CREATE TRIGGER update_veterinarians_updated_at BEFORE UPDATE ON veterinarians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vet_chat_rooms_updated_at BEFORE UPDATE ON vet_chat_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vet_consultations_updated_at BEFORE UPDATE ON vet_consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vet_availability_updated_at BEFORE UPDATE ON vet_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция за автоматично присвояване на ветеринар
CREATE OR REPLACE FUNCTION assign_available_veterinarian()
RETURNS TRIGGER AS $$
DECLARE
  available_vet_id uuid;
BEGIN
  -- Намираме наличен ветеринар
  SELECT id INTO available_vet_id
  FROM veterinarians
  WHERE is_available = true AND is_online = true
  ORDER BY total_consultations ASC, rating DESC
  LIMIT 1;
  
  -- Ако има наличен ветеринар, го присвояваме
  IF available_vet_id IS NOT NULL THEN
    NEW.veterinarian_id := available_vet_id;
    NEW.status := 'waiting';
  ELSE
    NEW.status := 'open';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за автоматично присвояване
DROP TRIGGER IF EXISTS auto_assign_veterinarian ON vet_chat_rooms;
CREATE TRIGGER auto_assign_veterinarian
BEFORE INSERT ON vet_chat_rooms
FOR EACH ROW
WHEN (NEW.veterinarian_id IS NULL)
EXECUTE FUNCTION assign_available_veterinarian();

-- Функция за създаване на известие при ново съобщение
CREATE OR REPLACE FUNCTION notify_on_vet_message()
RETURNS TRIGGER AS $$
DECLARE
  chat_room RECORD;
  recipient_id uuid;
  notification_message text;
BEGIN
  -- Вземаме информация за чат стаята
  SELECT * INTO chat_room
  FROM vet_chat_rooms
  WHERE id = NEW.chat_room_id;
  
  -- Определяме получателя
  IF NEW.sender_type = 'user' THEN
    -- Ако изпращачът е потребител, известяваме ветеринара
    SELECT profile_id INTO recipient_id
    FROM veterinarians
    WHERE id = chat_room.veterinarian_id;
    notification_message := 'Ново съобщение от потребител в ветеринарния чат';
  ELSE
    -- Ако изпращачът е ветеринар, известяваме потребителя
    recipient_id := chat_room.user_id;
    notification_message := 'Ново съобщение от ветеринар';
  END IF;
  
  -- Създаваме известие
  IF recipient_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, action_url)
    VALUES (
      recipient_id,
      'message',
      'Ветеринарен чат',
      notification_message,
      '/vet-chat/' || NEW.chat_room_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за известия
DROP TRIGGER IF EXISTS notify_on_new_vet_message ON vet_chat_messages;
CREATE TRIGGER notify_on_new_vet_message
AFTER INSERT ON vet_chat_messages
FOR EACH ROW
EXECUTE FUNCTION notify_on_vet_message();

-- Функция за актуализиране на статистики на ветеринар
CREATE OR REPLACE FUNCTION update_vet_statistics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'closed' AND (OLD.status IS NULL OR OLD.status != 'closed') THEN
    UPDATE veterinarians
    SET
      total_consultations = total_consultations + 1,
      updated_at = now()
    WHERE id = NEW.veterinarian_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за статистики
DROP TRIGGER IF EXISTS update_vet_stats_on_close ON vet_chat_rooms;
CREATE TRIGGER update_vet_stats_on_close
AFTER UPDATE ON vet_chat_rooms
FOR EACH ROW
EXECUTE FUNCTION update_vet_statistics();

-- View за активни чатове с ветеринари
CREATE OR REPLACE VIEW active_vet_chats AS
SELECT
  vcr.id,
  vcr.user_id,
  vcr.veterinarian_id,
  vcr.subject,
  vcr.urgency_level,
  vcr.status,
  vcr.started_at,
  p_user.full_name as user_name,
  p_user.avatar_url as user_avatar,
  p_vet.full_name as vet_name,
  p_vet.avatar_url as vet_avatar,
  v.specialization as vet_specialization,
  pet.name as pet_name,
  pet.type as pet_type,
  (
    SELECT COUNT(*)
    FROM vet_chat_messages
    WHERE vet_chat_messages.chat_room_id = vcr.id
    AND vet_chat_messages.is_read = false
    AND vet_chat_messages.sender_id != vcr.user_id
  ) as unread_count,
  (
    SELECT message
    FROM vet_chat_messages
    WHERE vet_chat_messages.chat_room_id = vcr.id
    ORDER BY created_at DESC
    LIMIT 1
  ) as last_message,
  (
    SELECT created_at
    FROM vet_chat_messages
    WHERE vet_chat_messages.chat_room_id = vcr.id
    ORDER BY created_at DESC
    LIMIT 1
  ) as last_message_at
FROM vet_chat_rooms vcr
JOIN profiles p_user ON p_user.id = vcr.user_id
LEFT JOIN veterinarians v ON v.id = vcr.veterinarian_id
LEFT JOIN profiles p_vet ON p_vet.id = v.profile_id
LEFT JOIN pets pet ON pet.id = vcr.pet_id
WHERE vcr.status IN ('open', 'waiting', 'in_progress')
ORDER BY vcr.started_at DESC;

-- Вмъкване на примерни ветеринари (само за демонстрация)
-- В реална среда това ще се прави през администраторски панел