#!/usr/bin/env bash

# Exit on error
set -e

# -------------------------------------------------
# Create admin user in Supabase and assign admin role
# -------------------------------------------------
# Required environment variables:
#   SUPABASE_URL          - your Supabase project URL
#   SUPABASE_SERVICE_ROLE - service role key (must be kept secret)
#   ADMIN_EMAIL           - admin email (methodman9090@gmail.com)
#   ADMIN_PASSWORD        - admin password (GordsamsBalgariaisassaita7707)
# -------------------------------------------------

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE" ]]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE must be set in the environment."
  exit 1
fi

ADMIN_EMAIL="methodman9090@gmail.com"
ADMIN_PASSWORD="GordsamsBalgariaisassaita7707"

# Create the user via Supabase Auth admin API
echo "Creating admin user $ADMIN_EMAIL..."
response=$(curl -s -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SERVICE_ROLE" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\", \"email_confirmed\": true}")

# Extract user ID
USER_ID=$(echo "$response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
if [[ -z "$USER_ID" ]]; then
  echo "Failed to create admin user. Response: $response"
  exit 1
fi

echo "Admin user created with ID: $USER_ID"

# Assign admin role in the profiles table (assuming a 'role' column exists)
# Using Supabase SQL RPC via the service role key
echo "Assigning admin role..."
psql "$SUPABASE_URL" -c "INSERT INTO profiles (id, role) VALUES ('$USER_ID', 'admin') ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;"

echo "Admin account setup complete."
