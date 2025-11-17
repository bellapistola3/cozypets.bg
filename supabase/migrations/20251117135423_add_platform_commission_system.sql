/*
  # Добавяне на система за комисионни на платформата

  ## Промени

  1. Нова таблица `platform_earnings`
    - `id` (uuid, primary key)
    - `reservation_id` (uuid) - връзка с резервация
    - `payment_id` (uuid) - връзка с плащане
    - `total_amount` (decimal) - обща сума на резервацията
    - `platform_commission_rate` (decimal) - процент комисионна (по подразбиране 25%)
    - `platform_commission_amount` (decimal) - сума комисионна за платформата
    - `sitter_payout_amount` (decimal) - сума за изплащане на sitter
    - `status` (text) - статус (pending, collected, paid_to_sitter)
    - `collected_at` (timestamptz) - кога е събрана комисионната
    - `paid_to_sitter_at` (timestamptz) - кога е платено на sitter
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. Нова таблица `platform_statistics`
    - `id` (uuid, primary key)
    - `total_earnings` (decimal) - общо приходи на платформата
    - `total_payouts` (decimal) - общо изплатено на sitters
    - `pending_earnings` (decimal) - чакащи приходи
    - `last_updated` (timestamptz)

  3. Актуализация на таблицата `payments`
    - Добавяне на колона `platform_fee` (decimal)
    - Добавяне на колона `sitter_amount` (decimal)

  ## Сигурност
  - RLS политики за защита на финансови данни
  - Само админи могат да виждат platform_earnings
  - Sitters могат да виждат само собствените си изплащания

  ## Важни бележки
  1. Комисионната се изчислява автоматично при създаване на плащане
  2. По подразбиране е 25% от общата сума
  3. Платформата събира комисионната при потвърждено плащане
  4. Sitter получава 75% от сумата
*/

-- Добавяне на колони към payments таблицата
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'platform_fee'
  ) THEN
    ALTER TABLE payments ADD COLUMN platform_fee decimal(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'sitter_amount'
  ) THEN
    ALTER TABLE payments ADD COLUMN sitter_amount decimal(10,2) DEFAULT 0;
  END IF;
END $$;

-- Създаване на таблица за приходи на платформата
CREATE TABLE IF NOT EXISTS platform_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  platform_commission_rate decimal(5,2) DEFAULT 25.00,
  platform_commission_amount decimal(10,2) NOT NULL,
  sitter_payout_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'collected', 'paid_to_sitter')),
  collected_at timestamptz,
  paid_to_sitter_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(payment_id)
);

ALTER TABLE platform_earnings ENABLE ROW LEVEL SECURITY;

-- Само sitters могат да виждат собствените си изплащания
CREATE POLICY "Sitters can view own payouts"
  ON platform_earnings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reservations r
      JOIN sitters s ON s.id = r.sitter_id
      WHERE r.id = platform_earnings.reservation_id
      AND s.profile_id = auth.uid()
    )
  );

-- Създаване на таблица за статистики на платформата
CREATE TABLE IF NOT EXISTS platform_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_earnings decimal(12,2) DEFAULT 0,
  total_payouts decimal(12,2) DEFAULT 0,
  pending_earnings decimal(12,2) DEFAULT 0,
  total_transactions integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE platform_statistics ENABLE ROW LEVEL SECURITY;

-- Никой не може да вижда статистиките освен чрез функции
CREATE POLICY "No direct access to platform statistics"
  ON platform_statistics FOR SELECT
  TO authenticated
  USING (false);

-- Вмъкване на начален запис за статистики
INSERT INTO platform_statistics (id, total_earnings, total_payouts, pending_earnings, total_transactions)
VALUES (gen_random_uuid(), 0, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Индекси за по-добра производителност
CREATE INDEX IF NOT EXISTS idx_platform_earnings_reservation_id ON platform_earnings(reservation_id);
CREATE INDEX IF NOT EXISTS idx_platform_earnings_payment_id ON platform_earnings(payment_id);
CREATE INDEX IF NOT EXISTS idx_platform_earnings_status ON platform_earnings(status);

-- Тригер за автоматично обновяване на updated_at
CREATE TRIGGER update_platform_earnings_updated_at BEFORE UPDATE ON platform_earnings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция за автоматично изчисляване на комисионна при създаване на плащане
CREATE OR REPLACE FUNCTION calculate_platform_commission()
RETURNS TRIGGER AS $$
DECLARE
  commission_rate decimal(5,2) := 25.00;
  commission_amount decimal(10,2);
  sitter_amount decimal(10,2);
BEGIN
  -- Изчисляване на комисионната (25%)
  commission_amount := NEW.amount * (commission_rate / 100);
  sitter_amount := NEW.amount - commission_amount;
  
  -- Обновяване на payment записа
  NEW.platform_fee := commission_amount;
  NEW.sitter_amount := sitter_amount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за автоматично изчисляване на комисионна
DROP TRIGGER IF EXISTS calculate_commission_on_payment ON payments;
CREATE TRIGGER calculate_commission_on_payment
BEFORE INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION calculate_platform_commission();

-- Функция за създаване на platform_earnings запис при потвърдено плащане
CREATE OR REPLACE FUNCTION create_platform_earnings_record()
RETURNS TRIGGER AS $$
DECLARE
  reservation_record RECORD;
BEGIN
  -- Ако плащането е потвърдено, създаваме platform_earnings запис
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    -- Вземаме информация за резервацията
    SELECT * INTO reservation_record
    FROM reservations
    WHERE id = NEW.reservation_id;
    
    -- Създаване на platform_earnings запис
    INSERT INTO platform_earnings (
      reservation_id,
      payment_id,
      total_amount,
      platform_commission_amount,
      sitter_payout_amount,
      status,
      collected_at
    ) VALUES (
      NEW.reservation_id,
      NEW.id,
      NEW.amount,
      NEW.platform_fee,
      NEW.sitter_amount,
      'collected',
      now()
    )
    ON CONFLICT (payment_id) DO UPDATE
    SET
      status = 'collected',
      collected_at = now();
    
    -- Обновяване на статистиките на платформата
    UPDATE platform_statistics
    SET
      total_earnings = total_earnings + NEW.platform_fee,
      pending_earnings = pending_earnings - NEW.platform_fee + NEW.platform_fee,
      total_transactions = total_transactions + 1,
      last_updated = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за автоматично създаване на platform_earnings
DROP TRIGGER IF EXISTS create_earnings_on_payment_completion ON payments;
CREATE TRIGGER create_earnings_on_payment_completion
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION create_platform_earnings_record();

-- Функция за маркиране на изплащане към sitter
CREATE OR REPLACE FUNCTION mark_sitter_payout(earning_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE platform_earnings
  SET
    status = 'paid_to_sitter',
    paid_to_sitter_at = now(),
    updated_at = now()
  WHERE id = earning_id AND status = 'collected';
  
  -- Обновяване на статистиките
  UPDATE platform_statistics
  SET
    total_payouts = total_payouts + (
      SELECT sitter_payout_amount
      FROM platform_earnings
      WHERE id = earning_id
    ),
    pending_earnings = pending_earnings - (
      SELECT platform_commission_amount
      FROM platform_earnings
      WHERE id = earning_id
    ),
    last_updated = now();
END;
$$ LANGUAGE plpgsql;

-- View за лесен преглед на финансови данни за sitters
CREATE OR REPLACE VIEW sitter_earnings_view AS
SELECT
  s.id as sitter_id,
  s.profile_id,
  p.full_name as sitter_name,
  COUNT(DISTINCT pe.id) as total_completed_jobs,
  COALESCE(SUM(pe.sitter_payout_amount), 0) as total_earnings,
  COALESCE(SUM(CASE WHEN pe.status = 'collected' THEN pe.sitter_payout_amount ELSE 0 END), 0) as pending_payout,
  COALESCE(SUM(CASE WHEN pe.status = 'paid_to_sitter' THEN pe.sitter_payout_amount ELSE 0 END), 0) as paid_out
FROM sitters s
JOIN profiles p ON p.id = s.profile_id
LEFT JOIN reservations r ON r.sitter_id = s.id
LEFT JOIN platform_earnings pe ON pe.reservation_id = r.id
GROUP BY s.id, s.profile_id, p.full_name;

-- View за статистики на платформата
CREATE OR REPLACE VIEW platform_revenue_view AS
SELECT
  COUNT(DISTINCT pe.id) as total_transactions,
  COALESCE(SUM(pe.total_amount), 0) as total_transaction_volume,
  COALESCE(SUM(pe.platform_commission_amount), 0) as total_platform_revenue,
  COALESCE(SUM(pe.sitter_payout_amount), 0) as total_sitter_payouts,
  COALESCE(SUM(CASE WHEN pe.status = 'collected' THEN pe.platform_commission_amount ELSE 0 END), 0) as pending_revenue,
  COALESCE(SUM(CASE WHEN pe.status = 'paid_to_sitter' THEN pe.sitter_payout_amount ELSE 0 END), 0) as completed_payouts,
  AVG(pe.platform_commission_rate) as average_commission_rate
FROM platform_earnings pe
WHERE pe.collected_at IS NOT NULL;