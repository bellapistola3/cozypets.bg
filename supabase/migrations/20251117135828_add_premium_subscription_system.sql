/*
  # Добавяне на система за премиум абонаменти

  ## Нови таблици

  ### 1. subscription_plans
  - `id` (uuid, primary key)
  - `name` (text) - име на плана
  - `description` (text) - описание
  - `price` (decimal) - цена
  - `currency` (text) - валута
  - `billing_period` (text) - период на таксуване
  - `features` (jsonb) - характеристики
  - `is_active` (boolean) - активен
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. sitter_subscriptions
  - `id` (uuid, primary key)
  - `sitter_id` (uuid) - връзка със sitters
  - `plan_id` (uuid) - връзка с subscription_plans
  - `status` (text) - статус (active, cancelled, expired, trial)
  - `current_period_start` (timestamptz) - начало на текущ период
  - `current_period_end` (timestamptz) - край на текущ период
  - `cancel_at_period_end` (boolean) - анулиране в края на периода
  - `cancelled_at` (timestamptz) - дата на анулиране
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. subscription_payments
  - `id` (uuid, primary key)
  - `subscription_id` (uuid) - връзка с абонамент
  - `amount` (decimal) - сума
  - `currency` (text) - валута
  - `payment_status` (text) - статус
  - `payment_date` (timestamptz) - дата на плащане
  - `period_start` (timestamptz) - начало на период
  - `period_end` (timestamptz) - край на период
  - `transaction_id` (text) - ID на транзакция
  - `created_at` (timestamptz)

  ## Актуализации на съществуващи таблици

  ### sitters таблица
  - `is_premium` (boolean) - премиум акаунт
  - `premium_badge` (text) - значка на премиум акаунт
  - `featured_until` (timestamptz) - промо до дата
  - `profile_boost_score` (integer) - точки за промоция

  ## Премиум характеристики
  1. Промо позиция в резултатите от търсенето
  2. Значка "Premium" на профила
  3. Приоритетна поддръжка
  4. Неограничени снимки в галерията
  5. Възможност за промоционални отстъпки
  6. Подробна статистика и аналитика
  7. Персонализиран профил

  ## Сигурност
  - RLS политики за достъп до абонаменти
  - Sitters могат да виждат само собствените си абонаменти
  - Автоматично обновяване на статуса при изтичане
*/

-- Добавяне на колони към sitters таблицата
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sitters' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE sitters ADD COLUMN is_premium boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sitters' AND column_name = 'premium_badge'
  ) THEN
    ALTER TABLE sitters ADD COLUMN premium_badge text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sitters' AND column_name = 'featured_until'
  ) THEN
    ALTER TABLE sitters ADD COLUMN featured_until timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sitters' AND column_name = 'profile_boost_score'
  ) THEN
    ALTER TABLE sitters ADD COLUMN profile_boost_score integer DEFAULT 0;
  END IF;
END $$;

-- Създаване на таблица за абонаментни планове
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  billing_period text DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
  features jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Всички могат да виждат активните планове
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Вмъкване на премиум план
INSERT INTO subscription_plans (name, description, price, currency, billing_period, features)
VALUES (
  'Premium Sitter',
  'Промо акаунт за професионални гледачи',
  5.00,
  'EUR',
  'monthly',
  '{
    "priority_listing": true,
    "premium_badge": true,
    "unlimited_photos": true,
    "priority_support": true,
    "analytics": true,
    "custom_profile": true,
    "promotional_discounts": true,
    "boost_score": 100
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- Създаване на таблица за абонаменти на sitters
CREATE TABLE IF NOT EXISTS sitter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE RESTRICT NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'past_due')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamptz,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sitter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Sitters могат да виждат собствените си абонаменти
CREATE POLICY "Sitters can view own subscriptions"
  ON sitter_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_subscriptions.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Sitters могат да създават собствени абонаменти
CREATE POLICY "Sitters can create own subscriptions"
  ON sitter_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_subscriptions.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Sitters могат да актуализират собствените си абонаменти
CREATE POLICY "Sitters can update own subscriptions"
  ON sitter_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_subscriptions.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.id = sitter_subscriptions.sitter_id
      AND sitters.profile_id = auth.uid()
    )
  );

-- Създаване на таблица за плащания на абонаменти
CREATE TABLE IF NOT EXISTS subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES sitter_subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date timestamptz,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  transaction_id text,
  payment_method text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Sitters могат да виждат собствените си плащания
CREATE POLICY "Sitters can view own subscription payments"
  ON subscription_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sitter_subscriptions ss
      JOIN sitters s ON s.id = ss.sitter_id
      WHERE ss.id = subscription_payments.subscription_id
      AND s.profile_id = auth.uid()
    )
  );

-- Индекси за по-добра производителност
CREATE INDEX IF NOT EXISTS idx_sitter_subscriptions_sitter_id ON sitter_subscriptions(sitter_id);
CREATE INDEX IF NOT EXISTS idx_sitter_subscriptions_status ON sitter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_sitter_subscriptions_period_end ON sitter_subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON subscription_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_sitters_is_premium ON sitters(is_premium);
CREATE INDEX IF NOT EXISTS idx_sitters_featured_until ON sitters(featured_until);

-- Тригери за автоматично обновяване на updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sitter_subscriptions_updated_at BEFORE UPDATE ON sitter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция за актуализиране на премиум статус на sitter
CREATE OR REPLACE FUNCTION update_sitter_premium_status()
RETURNS TRIGGER AS $$
DECLARE
  plan_features jsonb;
BEGIN
  -- Ако абонаментът е активен
  IF NEW.status = 'active' THEN
    -- Вземаме характеристиките на плана
    SELECT features INTO plan_features
    FROM subscription_plans
    WHERE id = NEW.plan_id;
    
    -- Актуализираме sitter профила
    UPDATE sitters
    SET
      is_premium = true,
      premium_badge = 'Premium',
      featured_until = NEW.current_period_end,
      profile_boost_score = COALESCE((plan_features->>'boost_score')::integer, 100),
      updated_at = now()
    WHERE id = NEW.sitter_id;
  
  -- Ако абонаментът е изтекъл или анулиран
  ELSIF NEW.status IN ('expired', 'cancelled') AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    UPDATE sitters
    SET
      is_premium = false,
      premium_badge = NULL,
      featured_until = NULL,
      profile_boost_score = 0,
      updated_at = now()
    WHERE id = NEW.sitter_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за актуализиране на премиум статус
DROP TRIGGER IF EXISTS update_premium_status_on_subscription_change ON sitter_subscriptions;
CREATE TRIGGER update_premium_status_on_subscription_change
AFTER INSERT OR UPDATE ON sitter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_sitter_premium_status();

-- Функция за обработка на плащане на абонамент
CREATE OR REPLACE FUNCTION process_subscription_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Ако плащането е успешно
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    -- Актуализираме статистиките на платформата
    UPDATE platform_statistics
    SET
      total_earnings = total_earnings + NEW.amount,
      total_transactions = total_transactions + 1,
      last_updated = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за обработка на плащане
DROP TRIGGER IF EXISTS process_payment_on_subscription_payment ON subscription_payments;
CREATE TRIGGER process_payment_on_subscription_payment
AFTER INSERT OR UPDATE ON subscription_payments
FOR EACH ROW
EXECUTE FUNCTION process_subscription_payment();

-- Функция за автоматично изтичане на абонаменти
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE sitter_subscriptions
  SET
    status = 'expired',
    updated_at = now()
  WHERE
    status = 'active'
    AND current_period_end < now()
    AND cancel_at_period_end = false;
END;
$$ LANGUAGE plpgsql;

-- Функция за подновяване на абонамент
CREATE OR REPLACE FUNCTION renew_subscription(p_subscription_id uuid, p_transaction_id text)
RETURNS void AS $$
DECLARE
  sub_record RECORD;
  plan_price decimal(10,2);
  new_period_start timestamptz;
  new_period_end timestamptz;
BEGIN
  -- Вземаме информация за абонамента
  SELECT * INTO sub_record
  FROM sitter_subscriptions
  WHERE id = p_subscription_id;
  
  -- Вземаме цената на плана
  SELECT price INTO plan_price
  FROM subscription_plans
  WHERE id = sub_record.plan_id;
  
  -- Изчисляваме новия период
  new_period_start := sub_record.current_period_end;
  new_period_end := new_period_start + interval '1 month';
  
  -- Актуализираме абонамента
  UPDATE sitter_subscriptions
  SET
    current_period_start = new_period_start,
    current_period_end = new_period_end,
    status = 'active',
    updated_at = now()
  WHERE id = p_subscription_id;
  
  -- Създаваме запис за плащане
  INSERT INTO subscription_payments (
    subscription_id,
    amount,
    payment_status,
    payment_date,
    period_start,
    period_end,
    transaction_id
  ) VALUES (
    p_subscription_id,
    plan_price,
    'completed',
    now(),
    new_period_start,
    new_period_end,
    p_transaction_id
  );
END;
$$ LANGUAGE plpgsql;

-- Функция за анулиране на абонамент
CREATE OR REPLACE FUNCTION cancel_subscription(p_subscription_id uuid, p_cancel_immediately boolean DEFAULT false)
RETURNS void AS $$
BEGIN
  IF p_cancel_immediately THEN
    UPDATE sitter_subscriptions
    SET
      status = 'cancelled',
      cancelled_at = now(),
      cancel_at_period_end = false,
      updated_at = now()
    WHERE id = p_subscription_id;
  ELSE
    UPDATE sitter_subscriptions
    SET
      cancel_at_period_end = true,
      cancelled_at = now(),
      updated_at = now()
    WHERE id = p_subscription_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- View за статистики на абонаментите
CREATE OR REPLACE VIEW subscription_statistics AS
SELECT
  COUNT(DISTINCT ss.id) FILTER (WHERE ss.status = 'active') as active_subscriptions,
  COUNT(DISTINCT ss.id) FILTER (WHERE ss.status = 'trial') as trial_subscriptions,
  COUNT(DISTINCT ss.id) FILTER (WHERE ss.status = 'cancelled') as cancelled_subscriptions,
  COUNT(DISTINCT ss.id) FILTER (WHERE ss.status = 'expired') as expired_subscriptions,
  COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_status = 'completed'), 0) as total_subscription_revenue,
  COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_status = 'completed' AND sp.payment_date >= date_trunc('month', now())), 0) as current_month_revenue,
  COUNT(DISTINCT sp.id) FILTER (WHERE sp.payment_status = 'completed') as total_payments,
  COUNT(DISTINCT sp.id) FILTER (WHERE sp.payment_status = 'failed') as failed_payments
FROM sitter_subscriptions ss
LEFT JOIN subscription_payments sp ON sp.subscription_id = ss.id;

-- View за премиум sitters с подредба
CREATE OR REPLACE VIEW premium_sitters_ranked AS
SELECT
  s.*,
  p.full_name,
  p.avatar_url,
  p.location_city,
  CASE
    WHEN s.is_premium AND s.featured_until > now() THEN s.profile_boost_score
    ELSE 0
  END as current_boost_score
FROM sitters s
JOIN profiles p ON p.id = s.profile_id
WHERE s.is_premium = true AND s.featured_until > now()
ORDER BY current_boost_score DESC, s.rating DESC;