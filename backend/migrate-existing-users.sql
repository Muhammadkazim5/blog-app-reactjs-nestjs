-- Migration script for existing users
-- Run this script to add password field and handle existing users

-- Step 1: Add password column as nullable first
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password" VARCHAR;

-- Step 2: Update existing users with a temporary password
-- Note: These users will need to reset their passwords through the app
UPDATE "user" 
SET "password" = '$2b$10$temp.password.for.existing.users.please.reset'
WHERE "password" IS NULL;

-- Step 3: Make password column NOT NULL after updating existing records
ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;

-- Step 4: Add a comment to remind about password reset
COMMENT ON COLUMN "user"."password" IS 'Existing users have temporary passwords and should reset them';

-- Verify the migration
SELECT id, name, email, 
       CASE 
         WHEN password = '$2b$10$temp.password.for.existing.users.please.reset' 
         THEN 'NEEDS_PASSWORD_RESET'
         ELSE 'PASSWORD_SET'
       END as password_status
FROM "user";
