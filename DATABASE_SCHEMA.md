# CozyPets Database Schema (Supabase PostgreSQL)

This document outlines the database schema for the CozyPets application, which has been fully migrated to Supabase.

## Tables

### 1. `profiles`
Stores user profile information for all types of users (owners, sitters, admins).
*   `id` (UUID, Primary Key) - Matches the `auth.users` ID from Supabase Auth.
*   `full_name` (Text) - User's full name.
*   `email` (Text) - User's email address.
*   `phone` (Text) - User's phone number.
*   `role` (Text) - User's role: `'owner'`, `'sitter'`, or `'admin'`.
*   `created_at` (Timestamp) - Record creation time.

### 2. `sitters`
Stores detailed profile information specifically for pet sitters.
*   `id` (UUID, Primary Key, Foreign Key to `profiles.id`) - The sitter's user ID.
*   `profile_title` (Text) - Title of the sitter's profile.
*   `bio` (Text) - Detailed biography/description.
*   `experience` (Text) - Description of their experience.
*   `address_line` (Text) - Sitter's location/address.
*   `lat`, `lng` (Float) - Geographical coordinates for map integration.
*   `is_hotel` (Boolean) - Whether they offer a pet hotel facility.
*   `price_24h` (Float) - Standard 24-hour rate.
*   `price_notes` (Text) - Additional pricing information.
*   `pet_types` (Text Array) - Array of pet types they accept (e.g., dogs, cats).
*   `allow_small_dogs`, `allow_large_dogs` (Boolean) - Dog size preferences.
*   `accept_in_heat`, `accept_unneutered` (Boolean) - Specific pet condition preferences.
*   `behavior_trainer` (Boolean) - If they offer behavior training.
*   `has_car` (Boolean) - If they have transportation.
*   `medical_training` (Text) - Any relevant medical training.
*   `day_flow_short` (Text) - A brief description of a typical day with the sitter.

### 3. `pets`
Stores information about the users' pets.
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key to `profiles.id`) - The pet owner.
*   `name` (Text) - Pet's name.
*   `breed` (Text) - Pet's breed.
*   `age` (Integer) - Pet's age.
*   `health_status` (Text) - Pet's health status.
*   `photo_url` (Text) - URL to the pet's photo.
*   `created_at` (Timestamp) - Record creation time.

### 4. `reservations`
Stores booking/reservation records between owners and sitters.
*   `id` (UUID, Primary Key)
*   `owner_id` (UUID, Foreign Key to `profiles.id`) - The user making the booking.
*   `sitter_id` (UUID, Foreign Key to `sitters.id`) - The sitter being booked.
*   `pet_id` (UUID, Foreign Key to `pets.id`) - The pet being cared for.
*   `start_date` (Timestamp) - Start of the reservation.
*   `end_date` (Timestamp) - End of the reservation.
*   `total_price` (Float) - Total cost of the reservation.
*   `status` (Text) - Status of the booking (e.g., `'pending'`, `'confirmed'`, `'completed'`, `'cancelled'`).
*   `created_at` (Timestamp) - Record creation time.

### 5. `reviews`
Stores reviews left by owners for sitters.
*   `id` (UUID, Primary Key)
*   `reservation_id` (UUID, Foreign Key to `reservations.id`) - The reservation being reviewed.
*   `reviewer_id` (UUID, Foreign Key to `profiles.id`) - The user writing the review.
*   `sitter_id` (UUID, Foreign Key to `sitters.id`) - The sitter being reviewed.
*   `rating` (Integer) - Rating given (e.g., 1-5).
*   `comment` (Text) - The review text.
*   `created_at` (Timestamp) - Record creation time.

### 6. `payments`
Stores payment transaction records.
*   `id` (UUID, Primary Key)
*   `reservation_id` (UUID, Foreign Key to `reservations.id`) - The associated reservation.
*   `amount` (Float) - The payment amount.
*   `payment_method` (Text) - Method used (`'credit_card'`, `'paypal'`, `'bank_transfer'`).
*   `escrow_status` (Text) - Status of the funds (`'held'`, `'released'`, `'refunded'`).
*   `payment_status` (Text) - Status of the transaction (`'pending'`, `'completed'`, `'failed'`).
*   `created_at` (Timestamp) - Record creation time.
