/*
  # Добавяне на система за премиум месечно издание

  ## Нови таблици

  ### 1. magazine_issues
  - `id` (uuid, primary key)
  - `issue_number` (integer) - номер на изданието
  - `title` (text) - заглавие
  - `cover_image_url` (text) - корица
  - `publication_date` (date) - дата на публикация
  - `is_published` (boolean) - публикувано
  - `description` (text) - описание
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. magazine_articles
  - `id` (uuid, primary key)
  - `issue_id` (uuid) - връзка с издание
  - `title` (text) - заглавие на статия
  - `category` (text) - категория
  - `content` (text) - съдържание
  - `author` (text) - автор
  - `image_url` (text) - изображение
  - `reading_time` (integer) - време за четене в минути
  - `is_premium` (boolean) - премиум съдържание
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. veterinary_clinics
  - `id` (uuid, primary key)
  - `name` (text) - име на клиника
  - `city` (text) - град
  - `address` (text) - адрес
  - `phone` (text) - телефон
  - `email` (text) - имейл
  - `website` (text) - уебсайт
  - `working_hours` (text) - работно време
  - `services` (text[]) - услуги
  - `emergency_available` (boolean) - спешна помощ
  - `rating` (decimal) - рейтинг
  - `latitude` (decimal) - географска ширина
  - `longitude` (decimal) - географска дължина
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. grooming_salons
  - `id` (uuid, primary key)
  - `name` (text) - име на салон
  - `city` (text) - град
  - `address` (text) - адрес
  - `phone` (text) - телефон
  - `email` (text) - имейл
  - `website` (text) - уебсайт
  - `working_hours` (text) - работно време
  - `services` (text[]) - услуги
  - `price_range` (text) - ценови диапазон
  - `rating` (decimal) - рейтинг
  - `latitude` (decimal) - географска ширина
  - `longitude` (decimal) - географска дължина
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. pet_stores
  - `id` (uuid, primary key)
  - `name` (text) - име на магазин
  - `city` (text) - град
  - `address` (text) - адрес
  - `phone` (text) - телефон
  - `email` (text) - имейл
  - `website` (text) - уебсайт
  - `working_hours` (text) - работно време
  - `product_categories` (text[]) - категории продукти
  - `has_delivery` (boolean) - доставка
  - `rating` (decimal) - рейтинг
  - `latitude` (decimal) - географска ширина
  - `longitude` (decimal) - географска дължина
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. training_specialists
  - `id` (uuid, primary key)
  - `name` (text) - име
  - `city` (text) - град
  - `phone` (text) - телефон
  - `email` (text) - имейл
  - `specialization` (text[]) - специализация
  - `experience_years` (integer) - години опит
  - `certifications` (text[]) - сертификати
  - `price_per_session` (decimal) - цена за сесия
  - `rating` (decimal) - рейтинг
  - `bio` (text) - биография
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. user_magazine_access
  - `id` (uuid, primary key)
  - `user_id` (uuid) - потребител
  - `issue_id` (uuid) - издание
  - `accessed_at` (timestamptz) - достъпен на
  - `created_at` (timestamptz)

  ## Категории на статии
  - Хранене и диети
  - Болести и лечение
  - Породи и особености
  - Обучение и дресировка
  - Профилактика и грижа
  - Психология на животните
  - Законодателство

  ## Сигурност
  - RLS политики за всички таблици
  - Само премиум потребители виждат премиум съдържание
  - Публична информация за клиники, салони и магазини
*/

-- Създаване на таблица за издания на списанието
CREATE TABLE IF NOT EXISTS magazine_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_number integer NOT NULL UNIQUE,
  title text NOT NULL,
  cover_image_url text,
  publication_date date NOT NULL,
  is_published boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE magazine_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published issues"
  ON magazine_issues FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Създаване на таблица за статии в списанието
CREATE TABLE IF NOT EXISTS magazine_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES magazine_issues(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'nutrition', 'diseases', 'breeds', 'training', 'prevention', 
    'psychology', 'legislation', 'grooming', 'general'
  )),
  content text NOT NULL,
  author text NOT NULL,
  image_url text,
  reading_time integer DEFAULT 5,
  is_premium boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE magazine_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can view premium articles"
  ON magazine_articles FOR SELECT
  TO authenticated
  USING (
    NOT is_premium OR
    EXISTS (
      SELECT 1 FROM sitters
      WHERE sitters.profile_id = auth.uid()
      AND sitters.is_premium = true
      AND sitters.featured_until > now()
    )
  );

-- Създаване на таблица за ветеринарни клиники
CREATE TABLE IF NOT EXISTS veterinary_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text,
  website text,
  working_hours text,
  services text[] DEFAULT '{}',
  emergency_available boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 5.00,
  latitude decimal(10,8),
  longitude decimal(11,8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE veterinary_clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view veterinary clinics"
  ON veterinary_clinics FOR SELECT
  TO authenticated
  USING (true);

-- Създаване на таблица за груминг салони
CREATE TABLE IF NOT EXISTS grooming_salons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text,
  website text,
  working_hours text,
  services text[] DEFAULT '{}',
  price_range text CHECK (price_range IN ('budget', 'medium', 'premium')),
  rating decimal(3,2) DEFAULT 5.00,
  latitude decimal(10,8),
  longitude decimal(11,8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE grooming_salons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view grooming salons"
  ON grooming_salons FOR SELECT
  TO authenticated
  USING (true);

-- Създаване на таблица за зоо магазини
CREATE TABLE IF NOT EXISTS pet_stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text,
  website text,
  working_hours text,
  product_categories text[] DEFAULT '{}',
  has_delivery boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 5.00,
  latitude decimal(10,8),
  longitude decimal(11,8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pet_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pet stores"
  ON pet_stores FOR SELECT
  TO authenticated
  USING (true);

-- Създаване на таблица за специалисти по обучение
CREATE TABLE IF NOT EXISTS training_specialists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  email text,
  specialization text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  certifications text[] DEFAULT '{}',
  price_per_session decimal(10,2),
  rating decimal(3,2) DEFAULT 5.00,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE training_specialists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view training specialists"
  ON training_specialists FOR SELECT
  TO authenticated
  USING (true);

-- Създаване на таблица за достъп до издания
CREATE TABLE IF NOT EXISTS user_magazine_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  issue_id uuid REFERENCES magazine_issues(id) ON DELETE CASCADE NOT NULL,
  accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, issue_id)
);

ALTER TABLE user_magazine_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own magazine access"
  ON user_magazine_access FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own magazine access"
  ON user_magazine_access FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Индекси за производителност
CREATE INDEX IF NOT EXISTS idx_magazine_articles_issue_id ON magazine_articles(issue_id);
CREATE INDEX IF NOT EXISTS idx_magazine_articles_category ON magazine_articles(category);
CREATE INDEX IF NOT EXISTS idx_magazine_articles_is_premium ON magazine_articles(is_premium);
CREATE INDEX IF NOT EXISTS idx_veterinary_clinics_city ON veterinary_clinics(city);
CREATE INDEX IF NOT EXISTS idx_grooming_salons_city ON grooming_salons(city);
CREATE INDEX IF NOT EXISTS idx_pet_stores_city ON pet_stores(city);
CREATE INDEX IF NOT EXISTS idx_training_specialists_city ON training_specialists(city);
CREATE INDEX IF NOT EXISTS idx_user_magazine_access_user_id ON user_magazine_access(user_id);

-- Тригери за updated_at
CREATE TRIGGER update_magazine_issues_updated_at BEFORE UPDATE ON magazine_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_magazine_articles_updated_at BEFORE UPDATE ON magazine_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veterinary_clinics_updated_at BEFORE UPDATE ON veterinary_clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grooming_salons_updated_at BEFORE UPDATE ON grooming_salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_stores_updated_at BEFORE UPDATE ON pet_stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_specialists_updated_at BEFORE UPDATE ON training_specialists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View за актуалното издание
CREATE OR REPLACE VIEW current_magazine_issue AS
SELECT
  mi.*,
  COUNT(ma.id) as article_count,
  COUNT(ma.id) FILTER (WHERE ma.is_premium = true) as premium_article_count,
  COUNT(ma.id) FILTER (WHERE ma.is_premium = false) as free_article_count
FROM magazine_issues mi
LEFT JOIN magazine_articles ma ON ma.issue_id = mi.id
WHERE mi.is_published = true
GROUP BY mi.id
ORDER BY mi.publication_date DESC
LIMIT 1;

-- View за статии по категория
CREATE OR REPLACE VIEW articles_by_category AS
SELECT
  category,
  COUNT(*) as article_count,
  COUNT(*) FILTER (WHERE is_premium = true) as premium_count,
  COUNT(*) FILTER (WHERE is_premium = false) as free_count
FROM magazine_articles
GROUP BY category;

-- Функция за проверка на премиум достъп
CREATE OR REPLACE FUNCTION has_premium_access(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM sitters
    WHERE sitters.profile_id = user_uuid
    AND sitters.is_premium = true
    AND sitters.featured_until > now()
  );
END;
$$ LANGUAGE plpgsql;

-- Функция за запис на достъп до издание
CREATE OR REPLACE FUNCTION record_magazine_access(p_user_id uuid, p_issue_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO user_magazine_access (user_id, issue_id, accessed_at)
  VALUES (p_user_id, p_issue_id, now())
  ON CONFLICT (user_id, issue_id) DO UPDATE
  SET accessed_at = now();
END;
$$ LANGUAGE plpgsql;

-- Вмъкване на примерни данни за демонстрация

-- Примерно издание
INSERT INTO magazine_issues (issue_number, title, description, publication_date, is_published)
VALUES (
  1,
  'Пролетна грижа за домашните любимци',
  'Специално издание с полезни съвети за пролетния сезон',
  '2025-03-01',
  true
)
ON CONFLICT (issue_number) DO NOTHING;

-- Примерни статии
INSERT INTO magazine_articles (issue_id, title, category, content, author, reading_time, is_premium)
SELECT
  mi.id,
  'Правилното хранене на кучета: Пълно ръководство',
  'nutrition',
  'Подробно ръководство за балансирана диета и хранене на кучета от всички възрасти и породи...',
  'Д-р Мария Иванова',
  10,
  true
FROM magazine_issues mi
WHERE mi.issue_number = 1
ON CONFLICT DO NOTHING;

INSERT INTO magazine_articles (issue_id, title, category, content, author, reading_time, is_premium)
SELECT
  mi.id,
  'Топ 10 породи котки за апартамент',
  'breeds',
  'Какви породи котки са най-подходящи за живот в апартамент и как да се грижим за тях...',
  'Д-р Петър Димитров',
  8,
  true
FROM magazine_issues mi
WHERE mi.issue_number = 1
ON CONFLICT DO NOTHING;

-- Примерни клиники (София)
INSERT INTO veterinary_clinics (name, city, address, phone, services, emergency_available, rating)
VALUES
  (
    'Ветеринарна клиника "Животинска любов"',
    'София',
    'ул. "Цар Борис III" 136',
    '+359 2 123 4567',
    ARRAY['Общ преглед', 'Ваксинации', 'Хирургия', 'Дентална грижа', 'Лабораторни изследвания'],
    true,
    4.8
  ),
  (
    'Вет Център "Здраве"',
    'София',
    'бул. "Витоша" 89',
    '+359 2 234 5678',
    ARRAY['Общ преглед', 'Ваксинации', 'УЗИ', 'Рентген', '24/7 Спешна помощ'],
    true,
    4.9
  )
ON CONFLICT DO NOTHING;

-- Примерни груминг салони
INSERT INTO grooming_salons (name, city, address, phone, services, price_range, rating)
VALUES
  (
    'Груминг салон "Красиво куче"',
    'София',
    'ул. "Graf Ignatiev" 45',
    '+359 2 345 6789',
    ARRAY['Къпане', 'Подстригване', 'Оформяне на козина', 'Почистване на уши', 'Педикюр'],
    'medium',
    4.7
  ),
  (
    'Pet Beauty Studio',
    'Пловдив',
    'ул. "Княз Александър I" 23',
    '+359 32 456 7890',
    ARRAY['Професионален груминг', 'SPA процедури', 'Хидратираща терапия'],
    'premium',
    4.9
  )
ON CONFLICT DO NOTHING;

-- Примерни зоо магазини
INSERT INTO pet_stores (name, city, address, phone, product_categories, has_delivery, rating)
VALUES
  (
    'Zoo Market "Приятел"',
    'София',
    'бул. "Черни връх" 67',
    '+359 2 567 8901',
    ARRAY['Храна', 'Играчки', 'Аксесоари', 'Легла', 'Преносими клетки'],
    true,
    4.6
  ),
  (
    'Pet Shop "Зоо Свят"',
    'Варна',
    'ул. "Цар Освободител" 12',
    '+359 52 678 9012',
    ARRAY['Храна', 'Играчки', 'Аквариуми', 'Птици', 'Гризачи'],
    true,
    4.8
  )
ON CONFLICT DO NOTHING;

-- Примерни специалисти
INSERT INTO training_specialists (name, city, phone, specialization, experience_years, price_per_session, rating)
VALUES
  (
    'Иван Петров',
    'София',
    '+359 88 123 4567',
    ARRAY['Базово обучение', 'Поведенческа корекция', 'Послушание'],
    12,
    80.00,
    4.9
  ),
  (
    'Мария Георгиева',
    'Пловдив',
    '+359 88 234 5678',
    ARRAY['Обучение на кучета', 'Аджилити', 'Фристайл'],
    8,
    70.00,
    4.7
  )
ON CONFLICT DO NOTHING;