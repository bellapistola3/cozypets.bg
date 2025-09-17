/*
  # Sitter Profile Schema Extension

  1. New Tables
    - `profiles` - Extended user profiles with Stripe integration
    - Extended `sitters` table with detailed profile information
    - `sitter_media` - Media files for sitter profiles
    - `availability` - Calendar availability for sitters

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
    - Public read access for sitter profiles

  3. Features
    - Profile photos and media gallery
    - Interactive map coordinates
    - 3-month calendar availability
    - Pet type preferences and restrictions
    - Pricing and service information
    - Stripe Connect integration ready
*/

-- Профилни данни (ако го нямаш)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('owner','sitter')) NOT NULL DEFAULT 'owner',
  full_name text,
  city text,
  phone text,
  avatar_url text,
  email text, -- удобство за показване
  stripe_account_id text,        -- Stripe Connect
  payouts_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles read all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles self upsert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Базова таблица за sitters (разшири ако вече имаш)
CREATE TABLE IF NOT EXISTS sitters (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  profile_title text,       -- име на профила (заглавие)
  bio text,                 -- разкажи за себе си
  experience text,          -- опит като гледач
  address_line text,        -- текстов адрес
  lat numeric(9,6),
  lng numeric(9,6),
  is_hotel boolean DEFAULT false,  -- хотел или частен дом
  price_24h numeric(10,2) DEFAULT 25,
  price_notes text,         -- „Задай цени за услугите си"
  pet_types text[] DEFAULT '{}',   -- ['kuche','kotka','grizachi','ptici','ekzotichni']
  allow_small_dogs boolean DEFAULT true,
  allow_large_dogs boolean DEFAULT true,
  accept_in_heat boolean DEFAULT false,
  accept_unneutered boolean DEFAULT false,
  behavior_trainer boolean DEFAULT false,
  has_car boolean DEFAULT false,
  medical_training text,     -- „ветеринарно или мед. образование / курсове"
  day_flow_short text,       -- ≤120 символа
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sitters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sitters read public" ON sitters FOR SELECT USING (true);
CREATE POLICY "sitters upsert self" ON sitters FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "sitters update self" ON sitters FOR UPDATE USING (auth.uid() = id);

-- Медии (до 5 изображения/видеа)
CREATE TABLE IF NOT EXISTS sitter_media (
  id bigserial PRIMARY KEY,
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE,
  url text NOT NULL,
  media_type text CHECK (media_type IN ('image','video')) DEFAULT 'image',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sitter_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sitter_media read public" ON sitter_media FOR SELECT USING (true);
CREATE POLICY "sitter_media insert self" ON sitter_media FOR INSERT WITH CHECK (auth.uid() = sitter_id);
CREATE POLICY "sitter_media delete self" ON sitter_media FOR DELETE USING (auth.uid() = sitter_id);

-- Календар (маркираме busy дни)
CREATE TABLE IF NOT EXISTS availability (
  id bigserial PRIMARY KEY,
  sitter_id uuid REFERENCES sitters(id) ON DELETE CASCADE,
  day date NOT NULL,
  busy boolean NOT NULL DEFAULT false,
  UNIQUE (sitter_id, day)
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "availability read public" ON availability FOR SELECT USING (true);
CREATE POLICY "availability manage self" ON availability
  FOR ALL USING (auth.uid() = sitter_id) WITH CHECK (auth.uid() = sitter_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_sitters_location ON sitters(lat, lng);
CREATE INDEX IF NOT EXISTS idx_sitters_pet_types ON sitters USING GIN(pet_types);
CREATE INDEX IF NOT EXISTS idx_sitter_media_sitter_id ON sitter_media(sitter_id);
CREATE INDEX IF NOT EXISTS idx_availability_sitter_day ON availability(sitter_id, day);