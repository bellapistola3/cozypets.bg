/*
  # Автоматично създаване на admin акаунт

  1. Нови функции
    - Функция за автоматично създаване на профил при регистрация
    - Автоматично задаване на admin role за определени имейли
  
  2. Промени
    - Тригер на auth.users за автоматично създаване на профил
    - Специален админски имейл: methodman9090@gmail.com
*/

-- Функция за автоматично създаване на профил при регистрация
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text := 'owner';
BEGIN
  -- Проверка дали имейлът е админски
  IF NEW.email = 'methodman9090@gmail.com' THEN
    user_role := 'admin';
  END IF;

  -- Създаване на профил за новия потребител
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

-- Изтриване на стар тригер ако съществува
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Създаване на тригер за автоматично създаване на профил
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ако вече има потребител с този имейл, обнови го като админ
UPDATE public.profiles 
SET role = 'admin', email = 'methodman9090@gmail.com'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'methodman9090@gmail.com'
);