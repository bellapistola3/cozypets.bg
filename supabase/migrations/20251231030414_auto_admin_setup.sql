/*
  # Automatsko kreiranje admin naloga

  1. Nove funkcije
    - Funkcija za automatsko kreiranje profila pri registraciji
    - Automatsko dodavanje admin role za određene email adrese
  
  2. Promene
    - Trigger na auth.users za automatsko kreiranje profila
    - Specijalni admin email: methodman9090@gmail.com
*/

-- Funkcija za automatsko kreiranje profila pri registraciji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text := 'owner';
BEGIN
  -- Provera da li je email admin
  IF NEW.email = 'methodman9090@gmail.com' THEN
    user_role := 'admin';
  END IF;

  -- Kreiranje profila za novog korisnika
  INSERT INTO public.profiles (id, email, full_name, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Brisanje starog triggera ako postoji
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Kreiranje triggera za automatsko kreiranje profila
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ako već postoji korisnik sa ovim emailom, ažuriraj ga kao admin
UPDATE public.profiles 
SET role = 'admin', email = 'methodman9090@gmail.com'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'methodman9090@gmail.com'
);