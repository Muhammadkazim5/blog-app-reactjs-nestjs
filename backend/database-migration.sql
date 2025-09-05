-- Database Migration Script for Authentication
-- Run this script to add password field to existing users table

-- Add password column to users table
ALTER TABLE "user" ADD COLUMN "password" VARCHAR NOT NULL DEFAULT '';

-- Update existing users with a default password (users will need to reset)
-- In production, you should handle this differently
UPDATE "user" SET "password" = '$2b$10$default.hash.for.existing.users' WHERE "password" = '';

-- Make password column NOT NULL after updating existing records
-- ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;

-- Note: Existing users will need to reset their passwords through a password reset flow
-- For now, you can manually set passwords for existing users or create new users
