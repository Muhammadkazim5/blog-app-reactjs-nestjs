# NestJS Blog Frontend

A modern React.js frontend application for the NestJS Blog backend. Built with TypeScript, Vite, Tailwind CSS, and React Router.

## Features

- **User Management**: Create, read, update, and delete users
- **Post Management**: Create, read, update, and delete blog posts with image upload
- **Comment System**: Add comments to posts with user association
- **Pagination**: Efficient pagination for posts
- **Responsive Design**: Modern UI with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Heroicons** - Beautiful SVG icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- NestJS backend running on port 3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Users.tsx       # Users list and management
│   ├── UserDetail.tsx  # Individual user details
│   ├── Posts.tsx       # Posts list with pagination
│   ├── PostDetail.tsx  # Individual post details
│   └── Comments.tsx    # Comments management
├── services/           # API service layer
│   └── api.ts         # Axios configuration and API calls
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types and interfaces
├── App.tsx            # Main app component with routing
└── main.tsx           # Application entry point
```

## API Integration

The frontend communicates with the NestJS backend through the following endpoints:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Posts
- `GET /posts` - Get paginated posts
- `GET /posts/:id` - Get post by ID
- `GET /posts/user/:userId` - Get posts by user
- `POST /posts` - Create new post (with image upload)
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Comments
- `GET /comments` - Get all comments
- `GET /comments/:id` - Get comment by ID
- `GET /comments/post/:postId` - Get comments by post
- `GET /comments/user/:userId` - Get comments by user
- `POST /comments` - Create new comment
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## Features Overview

### User Management
- View all users in a clean, organized list
- Create new users with name and email
- Edit existing user information
- Delete users (with confirmation)
- View detailed user profiles with their posts

### Post Management
- Browse posts with pagination (5 posts per page)
- Create posts with title, content, and optional image upload
- Edit post content
- Delete posts
- View individual post details with full content and image
- See post author information

### Comment System
- View all comments across the platform
- Add comments to posts
- Edit comment content
- Delete comments
- See comment author and associated post information

### Image Upload
- Upload images when creating posts
- Images are stored in the backend's uploads directory
- Images are served statically from `/uploads/` endpoint

## Styling

The application uses Tailwind CSS for styling, providing:
- Responsive design that works on all screen sizes
- Modern, clean UI components
- Consistent color scheme and typography
- Hover effects and transitions
- Mobile-friendly navigation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

The frontend expects the NestJS backend to be running on `http://localhost:3000`. Make sure your backend is started before running the frontend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the NestJS Blog application.