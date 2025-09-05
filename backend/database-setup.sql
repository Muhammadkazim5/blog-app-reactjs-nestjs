-- Database Setup Script for Blog API
-- Run this script in your PostgreSQL database

-- Create database (run this separately if needed)
-- CREATE DATABASE blog_api;

-- Connect to the blog_api database and run the following:

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL UNIQUE
);

-- Create posts table
CREATE TABLE IF NOT EXISTS "post" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "content" TEXT NOT NULL,
    "image" VARCHAR,
    "authorId" INTEGER,
    CONSTRAINT "FK_post_author" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS "comment" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" INTEGER,
    "postId" INTEGER,
    CONSTRAINT "FK_comment_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "FK_comment_post" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "IDX_post_author" ON "post"("authorId");
CREATE INDEX IF NOT EXISTS "IDX_comment_user" ON "comment"("userId");
CREATE INDEX IF NOT EXISTS "IDX_comment_post" ON "comment"("postId");

-- Insert sample data (optional)
INSERT INTO "user" ("name", "email") VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "post" ("title", "content", "authorId") VALUES 
    ('My First Blog Post', 'This is the content of my first blog post.', 1),
    ('Learning NestJS', 'NestJS is a fantastic framework for building scalable Node.js applications.', 1),
    ('TypeORM Best Practices', 'Here are some best practices for using TypeORM.', 2)
ON CONFLICT DO NOTHING;

INSERT INTO "comment" ("content", "userId", "postId") VALUES 
    ('Great post! Thanks for sharing.', 2, 1),
    ('I learned a lot from this article.', 1, 1),
    ('NestJS is indeed amazing!', 2, 2)
ON CONFLICT DO NOTHING;
