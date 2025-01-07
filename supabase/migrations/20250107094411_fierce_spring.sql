/*
  # Add Extended Profile Fields

  1. New Fields
    - first_name (text, required)
    - last_name (text, required)
    - phone_number (text, required)
    - physical_address (text, required)
    - is_email_verified (boolean)
    - is_phone_verified (boolean)
    - email_verification_code (text)
    - phone_verification_code (text)
    - verification_attempts (integer)
    - last_verification_attempt (timestamptz)

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS physical_address text,
ADD COLUMN IF NOT EXISTS is_email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_phone_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verification_code text,
ADD COLUMN IF NOT EXISTS phone_verification_code text,
ADD COLUMN IF NOT EXISTS verification_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_verification_attempt timestamptz;