#!/usr/bin/env bash

# Exit on any error
set -e

# Load environment variables (ensure they are set in CI/CD or locally)
# VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be exported

# 1. Apply Supabase migrations
if command -v supabase >/dev/null 2>&1; then
  echo "Applying Supabase migrations..."
  supabase db push
else
  echo "Supabase CLI not installed. Skipping migrations."
fi

# 2. Run seed data (if needed)
if [ -f "supabase/seed_sample_data.sql" ]; then
  echo "Seeding database..."
  # Use psql with connection string from SUPABASE_DB_URL env var
  if [ -z "$SUPABASE_DB_URL" ]; then
    echo "SUPABASE_DB_URL not set. Skipping seed."
  else
    PGPASSWORD=$(echo $SUPABASE_DB_URL | cut -d'@' -f1 | cut -d':' -f3) psql "$SUPABASE_DB_URL" -f supabase/seed_sample_data.sql
  fi
fi

# 3. Build the frontend
echo "Building the project..."
npm run build

# 4. Deploy to Custom Host
# This step depends on your hosting provider (e.g., VPS, Vercel, Host.bg, etc.)
# Uncomment and modify the command that matches your method:

# Example 1: SCP/rsync to a VPS
# echo "Uploading to custom host via rsync..."
# rsync -avz dist/ user@your-server.com:/var/www/cozypets.bg/

# Example 2: Vercel CLI
# echo "Deploying to Vercel..."
# npx vercel --prod

# Example 3: GitHub Pages
# echo "Deploying to GitHub Pages..."
# npm run gh-pages

echo "Frontend build is ready in the 'dist' folder."

echo "Deployment script completed successfully."
