-- Migration script to add image column to posts table
-- Run this script if you have an existing database

-- Add image column to post table
ALTER TABLE "post" ADD COLUMN IF NOT EXISTS "image" VARCHAR;

-- Update existing posts to have NULL image (optional)
-- UPDATE "post" SET "image" = NULL WHERE "image" IS NULL;
