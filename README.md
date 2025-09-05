# ReactJS-NestJS Blog App

A full-stack blog application built with React.js frontend and NestJS backend, featuring user management, posts, and comments functionality.

## 🚀 Project Overview

This is a complete blog application consisting of:
- **Frontend**: Modern React.js application with TypeScript and Tailwind CSS
- **Backend**: Robust NestJS API with PostgreSQL database
- **Features**: User management, blog posts, comments system, and image uploads

## 🛠️ Tech Stack

### Frontend
- **React 19.x** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **React Router DOM 7.x** - Client-side routing
- **Axios** - HTTP client for API communication
- **Heroicons** - Beautiful SVG icons
- **Vite 7.x** - Fast build tool and dev server

### Backend
- **NestJS 11.x** - Progressive Node.js framework
- **TypeScript** - Type-safe server-side development
- **PostgreSQL** - Robust relational database
- **TypeORM** - Object-relational mapping
- **Multer** - File upload handling
- **class-validator** - Request validation
- **class-transformer** - Data transformation

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd reactjs-nestjs-blog-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=blog_app

# Application Configuration
NODE_ENV=development
PORT=3000
```

**Set up the database:**
```bash
# Create PostgreSQL database
createdb blog_app

# Run database setup scripts
psql -U your_username -d blog_app -f database-setup.sql
psql -U your_username -d blog_app -f add-image-column.sql
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run start:dev
```
Backend will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: Available at backend endpoints

## 📁 Project Structure

```
reactjs-nestjs-blog-app/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── modules/        # Feature modules
│   │   │   ├── users/      # User management
│   │   │   ├── posts/      # Blog posts
│   │   │   └── comments/   # Comments system
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts         # Application entry point
│   ├── uploads/            # File upload directory
│   ├── package.json
│   └── README.md
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript definitions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets
│   ├── package.json
│   └── README.md
└── README.md               # This file
```

## 🔌 API Endpoints

### Users
- `GET /users` - Get all users (with pagination)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/image` - Upload image for post

### Comments
- `GET /comments` - Get all comments (with pagination)
- `GET /comments/:id` - Get comment by ID
- `POST /comments` - Create a new comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## 🎨 Frontend Features

### Pages
- **Home** (`/`) - Welcome page and navigation
- **Users** (`/users`) - User listing and management
- **User Detail** (`/users/:id`) - Individual user profiles
- **Posts** (`/posts`) - Blog posts listing
- **Post Detail** (`/posts/:id`) - Individual post view
- **Comments** (`/comments`) - Comments management

### Features
- **Responsive Design** - Mobile-first approach
- **Modern UI** - Clean interface with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **API Integration** - Seamless backend communication
- **Navigation** - React Router for client-side routing

## 🗄️ Database Schema

### Users Table
```sql
- id (Primary Key)
- name (String)
- email (String, Unique)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Posts Table
```sql
- id (Primary Key)
- title (String)
- content (Text)
- image (String, Optional)
- user_id (Foreign Key)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Comments Table
```sql
- id (Primary Key)
- content (Text)
- post_id (Foreign Key)
- user_id (Foreign Key)
- parent_id (Foreign Key, Optional - for nested comments)
- created_at (Timestamp)
- updated_at (Timestamp)
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Test coverage
```

### Frontend Testing
```bash
cd frontend
npm run lint          # Code linting
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run start:dev     # Development with hot reload
npm run start:debug   # Debug mode
npm run build         # Production build
npm run lint          # Code linting
npm run format        # Code formatting
```

### Frontend Development
```bash
cd frontend
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Code linting
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Start with: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to any static hosting service
3. Configure API endpoint for production

### Environment Variables
Ensure these are set for production:
- Database connection details
- API endpoints
- File upload paths
- CORS settings

## 🔒 Security Features

- **Input Validation** - Server-side validation with class-validator
- **CORS Configuration** - Cross-origin resource sharing
- **File Upload Security** - Secure file handling
- **SQL Injection Protection** - TypeORM parameterized queries
- **XSS Protection** - Input sanitization

## 📝 Available Scripts

### Backend Scripts
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests
- `npm run lint` - Run linting

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

If you encounter any issues:
1. Check the console for errors
2. Ensure both frontend and backend are running
3. Verify database connection
4. Check environment variables
5. Create an issue in the repository

## 🔗 Quick Links

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Testing](./backend/test-api.http)
- [Pagination Guide](./backend/PAGINATION_GUIDE.md)

---

**Happy Coding! 🚀**
