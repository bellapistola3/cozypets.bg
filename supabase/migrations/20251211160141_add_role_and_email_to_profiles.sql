/*
  # Добавяне на role и email към profiles

  1. Промени
    - Добавя `role` поле към profiles (owner или admin)
    - Добавя `email` поле към profiles
    - Добавя `name` поле (алиас за full_name за legacy code)
  
  2. Security
    - Запазва съществуващите RLS политики
    - Добавя индекс на email за бърза търсене
*/

DO $$ 
BEGIN
  -- Добавяне на role поле ако не съществува
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'owner' CHECK (role IN ('owner', 'admin'));
  END IF;

  -- Добавяне на email поле ако не съществува
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;

  -- Добавяне на name поле (алиас за full_name) ако не съществува
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN name text;
  END IF;
END $$;

-- Създаване на индекс за бързо търсене по email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Създаване на индекс за бързо търсене по role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Добавяне на RLS политики за admin достъп
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