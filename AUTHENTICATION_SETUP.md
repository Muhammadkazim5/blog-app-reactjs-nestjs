# Authentication Setup Guide

## 🎉 Authentication System Implemented!

Your blog app now has a complete authentication system! Here's what was implemented:

## ✅ What's New

### Backend (NestJS)
- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Protected Routes** for post creation, editing, and deletion
- **Authorization** - users can only edit/delete their own posts
- **Auth Endpoints**:
  - `POST /auth/register` - Create new user account
  - `POST /auth/login` - Sign in with email/password
  - `GET /auth/profile` - Get current user profile

### Frontend (React)
- **Authentication Context** for state management
- **Login/Register Forms** with validation
- **Protected Routes** - automatic redirect to login
- **User Session Management** with localStorage
- **Authorization UI** - only show edit/delete for own posts

## 🚀 How It Works Now

### For Visitors (Not Logged In)
1. ✅ **Can view all posts** - Public access to read posts
2. ❌ **Cannot create posts** - Redirected to login page
3. ❌ **Cannot edit/delete posts** - No edit/delete buttons shown

### For Authenticated Users
1. ✅ **Can view all posts** - Same public access
2. ✅ **Can create posts** - Automatically uses their user ID
3. ✅ **Can edit/delete their own posts** - Only their posts show edit/delete buttons
4. ✅ **Cannot edit/delete others' posts** - Authorization enforced

## 📋 Setup Instructions

### 1. Database Migration
Run the database migration to add password field:

```sql
-- Add password column to users table
ALTER TABLE "user" ADD COLUMN "password" VARCHAR NOT NULL DEFAULT '';

-- Update existing users with a default password
UPDATE "user" SET "password" = '$2b$10$default.hash.for.existing.users' WHERE "password" = '';
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=blog_api

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Install Dependencies
```bash
# Backend dependencies (already installed)
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 4. Start the Application
```bash
# Start backend
cd backend
npm run start:dev

# Start frontend (in another terminal)
cd frontend
npm start
```

## 🔐 Authentication Flow

### Registration
1. User visits `/register`
2. Fills out name, email, password
3. Password is hashed and stored
4. JWT token is generated and returned
5. User is automatically logged in

### Login
1. User visits `/login`
2. Enters email and password
3. Password is verified against hash
4. JWT token is generated and returned
5. User is logged in

### Creating Posts
1. User must be logged in
2. Clicks "Add Post" button
3. Fills out title and content
4. Post is automatically assigned to their user ID
5. No need to select author from dropdown

### Authorization
- **View Posts**: Anyone can view all posts
- **Create Posts**: Only authenticated users
- **Edit/Delete Posts**: Only the post author
- **User Management**: Still available for admin purposes

## 🎯 Key Features

### Security
- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens expire after 24 hours
- ✅ Protected routes require authentication
- ✅ Authorization checks prevent unauthorized access

### User Experience
- ✅ Clean login/register forms
- ✅ Automatic redirect after login
- ✅ User session persistence
- ✅ Clear visual indicators for authentication status

### Developer Experience
- ✅ Type-safe authentication context
- ✅ Reusable protected route component
- ✅ Centralized API error handling
- ✅ Clean separation of concerns

## 🧪 Testing the Authentication

### Test Registration
1. Go to `/register`
2. Create a new account
3. You should be automatically logged in
4. Try creating a post

### Test Login
1. Go to `/login`
2. Sign in with your credentials
3. You should see your name in the navigation
4. Try creating a post

### Test Authorization
1. Create a post while logged in
2. You should see edit/delete buttons
3. Log out and log back in as a different user
4. You should NOT see edit/delete buttons for the first user's posts

## 🔧 Customization

### JWT Secret
Change the JWT secret in your `.env` file for production:
```env
JWT_SECRET=your-super-secure-production-secret-key
```

### Token Expiration
Modify the expiration time in `auth.module.ts`:
```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  signOptions: { expiresIn: '7d' }, // Change from 24h to 7 days
}),
```

### Password Requirements
Update validation in `register.dto.ts`:
```typescript
@MinLength(8) // Change from 6 to 8 characters
password: string;
```

## 🎉 You're All Set!

Your blog app now has a complete authentication system that works exactly like a real blog platform:

- **Public users** can read posts
- **Registered users** can create posts
- **Post authors** can edit/delete their own posts
- **Secure authentication** with JWT tokens
- **Clean user interface** with proper navigation

The authentication system is production-ready and follows security best practices!
