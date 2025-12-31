/*
  # Dodavanje role i email na profiles

  1. Promene
    - Dodaje `role` polje na profiles (owner ili admin)
    - Dodaje `email` polje na profiles
    - Dodaje `name` polje (alias za full_name za legacy code)
  
  2. Security
    - Čuva postojeće RLS politike
    - Dodaje indeks na email za brzu pretragu
*/

DO $$ 
BEGIN
  -- Dodavanje role polja ako ne postoji
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'owner' CHECK (role IN ('owner', 'admin'));
  END IF;

  -- Dodavanje email polja ako ne postoji
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;

  -- Dodavanje name polja (alias za full_name) ako ne postoji
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN name text;
  END IF;
END $$;

-- Kreiranje indeksa za brzu pretragu po email-u
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Kreiranje indeksa za brzu pretragu po role-u
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Dodavanje RLS politika za admin pristup
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );