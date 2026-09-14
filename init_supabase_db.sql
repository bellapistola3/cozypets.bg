-- CozyPets Database Initialization SQL
-- Copy and paste this entire script into your Supabase SQL Editor and click "Run"

-- 1. Create the custom types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'sitter');
CREATE TYPE payment_method AS ENUM ('credit_card', 'paypal', 'bank_transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE escrow_status AS ENUM ('held', 'released', 'refunded');

-- 2. Create the profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'owner'::user_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the sitters table (extended profile for sitters)
CREATE TABLE public.sitters (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    profile_title TEXT,
    bio TEXT,
    experience TEXT,
    address_line TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    is_hotel BOOLEAN DEFAULT false,
    price_24h DOUBLE PRECISION DEFAULT 0,
    price_notes TEXT,
    pet_types TEXT[],
    allow_small_dogs BOOLEAN DEFAULT true,
    allow_large_dogs BOOLEAN DEFAULT true,
    accept_in_heat BOOLEAN DEFAULT false,
    accept_unneutered BOOLEAN DEFAULT false,
    behavior_trainer BOOLEAN DEFAULT false,
    has_car BOOLEAN DEFAULT false,
    medical_training TEXT,
    day_flow_short TEXT
);

-- 4. Create the pets table
CREATE TABLE public.pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    breed TEXT,
    age INTEGER,
    health_status TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create the reservations table
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sitter_id UUID REFERENCES public.sitters(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create the reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sitter_id UUID REFERENCES public.sitters(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create the payments table
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    payment_method payment_method,
    escrow_status escrow_status DEFAULT 'held'::escrow_status,
    payment_status payment_status DEFAULT 'pending'::payment_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 9. Create standard security policies (allowing everything for logged-in users to start, matching your previous Firestore logic)

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- SITTERS
CREATE POLICY "Sitter profiles are viewable by everyone" ON public.sitters FOR SELECT USING (true);
CREATE POLICY "Users can insert their own sitter profile" ON public.sitters FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own sitter profile" ON public.sitters FOR UPDATE USING (auth.uid() = id);

-- PETS
CREATE POLICY "Pets are viewable by everyone" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Users can insert their own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id);

-- RESERVATIONS
CREATE POLICY "Users can view their own reservations" ON public.reservations FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = sitter_id);
CREATE POLICY "Owners can create reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users involved can update reservations" ON public.reservations FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = sitter_id);

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- PAYMENTS
CREATE POLICY "Users can view their payments" ON public.payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.reservations 
        WHERE reservations.id = payments.reservation_id 
        AND (reservations.owner_id = auth.uid() OR reservations.sitter_id = auth.uid())
    )
);
CREATE POLICY "Owners can create payments" ON public.payments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.reservations 
        WHERE reservations.id = payments.reservation_id 
        AND reservations.owner_id = auth.uid()
    )
);
