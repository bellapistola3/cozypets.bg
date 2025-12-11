/*
  # Chat Approval System
  
  ## Описание
  Добавя система за одобрение на чат комуникация между собственици и гледачи.
  Чатът е разрешен САМО след одобрение от администратор/платформа.
  
  ## 1. Добавяне на role в profiles
  - `role` (text) - owner, sitter, admin
  
  ## 2. Промени в Reservations таблица
  - `chat_approved` (boolean) - дали чатът е одобрен
  - `chat_approved_at` (timestamptz) - кога е одобрен
  - `chat_approved_by` (uuid) - кой админ е одобрил
  
  ## 3. Нова таблица Chat Requests
  - `chat_requests` 
    - Заявки за отваряне на чат комуникация
    - Статус: pending, approved, rejected
  
  ## 4. Security
  - Потребителите могат да изпращат съобщения САМО ако chat_approved = true
  - Администраторите могат да одобряват/отказват чат заявки
  - RLS политики за защита на данните
*/

-- Добавяне на role поле в profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'owner' CHECK (role IN ('owner', 'sitter', 'admin'));
  END IF;
END $$;

-- Добавяне на полета за одобрение на чат в reservations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'chat_approved'
  ) THEN
    ALTER TABLE reservations ADD COLUMN chat_approved boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'chat_approved_at'
  ) THEN
    ALTER TABLE reservations ADD COLUMN chat_approved_at timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'chat_approved_by'
  ) THEN
    ALTER TABLE reservations ADD COLUMN chat_approved_by uuid REFERENCES profiles(id);
  END IF;
END $$;

-- Създаване на таблица за заявки за чат
CREATE TABLE IF NOT EXISTS chat_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE NOT NULL UNIQUE,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_message text,
  admin_notes text,
  requested_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_requests ENABLE ROW LEVEL SECURITY;

-- Собствениците и ситерите могат да виждат своите заявки
CREATE POLICY "Users can view own chat requests"
  ON chat_requests FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM sitters 
      WHERE sitters.id = chat_requests.sitter_id 
      AND sitters.profile_id = auth.uid()
    )
  );

-- Собствениците могат да създават заявки за чат
CREATE POLICY "Owners can create chat requests"
  ON chat_requests FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Администраторите могат да управляват всички заявки
CREATE POLICY "Admins can manage chat requests"
  ON chat_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Обновяване на messages политиките за одобрен чат
DROP POLICY IF EXISTS "Users can send messages with approved chat" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

CREATE POLICY "Users can send messages with approved chat"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() 
    AND (
      -- Ако има reservation_id, трябва чатът да е одобрен
      (reservation_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM reservations 
        WHERE reservations.id = messages.reservation_id 
        AND reservations.chat_approved = true
        AND (reservations.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM sitters 
          WHERE sitters.id = reservations.sitter_id 
          AND sitters.profile_id = auth.uid()
        ))
      ))
      -- Или ако няма reservation_id (директни съобщения или системни)
      OR reservation_id IS NULL
    )
  );

-- Функция за автоматично създаване на chat request при резервация
CREATE OR REPLACE FUNCTION create_chat_request_on_reservation()
RETURNS TRIGGER AS $$
BEGIN
  -- Създаване на chat request само при нова резервация
  IF NEW.status = 'pending' THEN
    INSERT INTO chat_requests (
      reservation_id,
      owner_id,
      sitter_id,
      status,
      request_message
    ) VALUES (
      NEW.id,
      NEW.owner_id,
      NEW.sitter_id,
      'pending',
      'Автоматична заявка за чат при създаване на резервация'
    )
    ON CONFLICT (reservation_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger за автоматично създаване на chat request
DROP TRIGGER IF EXISTS on_reservation_created_create_chat_request ON reservations;
CREATE TRIGGER on_reservation_created_create_chat_request
  AFTER INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION create_chat_request_on_reservation();

-- Функция за одобрение на чат от администратор
CREATE OR REPLACE FUNCTION approve_chat_request(
  request_id uuid,
  admin_id uuid,
  notes text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_reservation_id uuid;
BEGIN
  -- Проверка дали потребителят е администратор
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Само администратори могат да одобряват чат заявки';
  END IF;
  
  -- Обновяване на chat request
  UPDATE chat_requests 
  SET 
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = admin_id,
    admin_notes = notes,
    updated_at = now()
  WHERE id = request_id
  RETURNING reservation_id INTO v_reservation_id;
  
  -- Обновяване на reservation
  UPDATE reservations
  SET
    chat_approved = true,
    chat_approved_at = now(),
    chat_approved_by = admin_id
  WHERE id = v_reservation_id;
  
  -- Създаване на нотификации
  INSERT INTO notifications (user_id, type, title, message, action_url)
  SELECT 
    owner_id,
    'system',
    'Чат одобрен',
    'Вашата заявка за чат комуникация е одобрена! Вече можете да чатите със ситера.',
    '/dashboard'
  FROM chat_requests
  WHERE id = request_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция за отказ на чат заявка
CREATE OR REPLACE FUNCTION reject_chat_request(
  request_id uuid,
  admin_id uuid,
  reason text
)
RETURNS boolean AS $$
BEGIN
  -- Проверка дали потребителят е администратор
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Само администратори могат да отказват чат заявки';
  END IF;
  
  -- Обновяване на chat request
  UPDATE chat_requests 
  SET 
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = admin_id,
    admin_notes = reason,
    updated_at = now()
  WHERE id = request_id;
  
  -- Създаване на нотификация
  INSERT INTO notifications (user_id, type, title, message, action_url)
  SELECT 
    owner_id,
    'system',
    'Чат заявка отказана',
    'Вашата заявка за чат комуникация е отказана. ' || reason,
    '/dashboard'
  FROM chat_requests
  WHERE id = request_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Индекси за по-бърза производителност
CREATE INDEX IF NOT EXISTS idx_chat_requests_status ON chat_requests(status);
CREATE INDEX IF NOT EXISTS idx_chat_requests_owner_id ON chat_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_chat_requests_sitter_id ON chat_requests(sitter_id);
CREATE INDEX IF NOT EXISTS idx_reservations_chat_approved ON reservations(chat_approved);
CREATE INDEX IF NOT EXISTS idx_messages_reservation_id ON messages(reservation_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
