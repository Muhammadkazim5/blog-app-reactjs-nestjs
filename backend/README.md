<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Blog API

A NestJS-based Blog API with PostgreSQL and TypeORM, featuring user management, blog posts, and comments.

## Features

- ✅ User registration and management (CRUD operations)
- ✅ Blog post creation and management (only by registered users)
- ✅ Comment system on posts
- ✅ Get all posts with comments and authors
- ✅ Relationship management between Users, Posts, and Comments
- ✅ Image upload and management for posts
- ✅ Static file serving for uploaded images

## Database Relationships

- **User** → **Posts**: OneToMany (One user can write many posts)
- **User** → **Comments**: OneToMany (One user can write many comments)
- **Post** → **User**: ManyToOne (Many posts belong to one user)
- **Post** → **Comments**: OneToMany (One post can have many comments)
- **Comment** → **Post**: ManyToOne (Many comments belong to one post)
- **Comment** → **User**: ManyToOne (Many comments belong to one user)

## Image Functionality

The API now supports image uploads for posts. You can:

1. **Upload images with posts** using multipart/form-data
2. **Reference external image URLs** in post creation
3. **Update posts with new images**
4. **Access uploaded images** via static file serving

### Image Upload Endpoints

- `POST /posts` - Create a post (supports both JSON and file uploads)
- `PATCH /posts/:id` - Update a post with new image

### Image Storage

- Images are stored in the `uploads/` directory
- Files are renamed with random names for security
- Original file extensions are preserved
- Images are served at `/uploads/{filename}`

### Example Usage

#### Upload Image with Post
```bash
curl -X POST http://localhost:3000/posts \
  -F "title=My Post with Image" \
  -F "content=This post includes an image!" \
  -F "userId=1" \
  -F "image=@/path/to/your/image.jpg"
```

#### Create Post with Image URL
```json
POST /posts
{
  "title": "Post with Image URL",
  "content": "This post references an image via URL.",
  "image": "https://example.com/image.jpg",
  "userId": 1
}
```

#### Create Post without Image
```json
POST /posts
{
  "title": "Post without Image",
  "content": "This is a regular post without any image.",
  "userId": 1
}
```

#### Access Uploaded Image
```
GET http://localhost:3000/uploads/filename.jpg
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=blog_api

   # Application Configuration
   PORT=3000
   ```

4. Create the PostgreSQL database:
   ```sql
   CREATE DATABASE blog_api;
   ```

5. Run the application:
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user with posts and comments
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Posts

- `POST /posts` - Create a new post
- `GET /posts` - Get all posts with authors and comments
- `GET /posts/:id` - Get a specific post with author and comments
- `GET /posts/user/:userId` - Get all posts by a specific user
- `PATCH /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

### Comments

- `POST /comments` - Create a new comment
- `GET /comments` - Get all comments with users and posts
- `GET /comments/:id` - Get a specific comment with user and post
- `GET /comments/post/:postId` - Get all comments for a specific post
- `GET /comments/user/:userId` - Get all comments by a specific user
- `PATCH /comments/:id` - Update a comment
- `DELETE /comments/:id` - Delete a comment

## Request/Response Examples

### Create User
```json
POST /users
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Create Post
```json
POST /posts
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "userId": 1
}
```

### Create Comment
```json
POST /comments
{
  "content": "Great post! Thanks for sharing.",
  "postId": 1,
  "userId": 2
}
```

### Get Posts with Comments and Authors
```json
GET /posts
Response:
[
  {
    "id": 1,
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "comments": [
      {
        "id": 1,
        "content": "Great post! Thanks for sharing.",
        "user": {
          "id": 2,
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      }
    ]
  }
]
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Database
- **class-validator** - Validation decorators
- **class-transformer** - Object transformation

## Project Structure

```
src/
├── config/
│   └── db.ts                 # Database configuration
├── modules/
│   ├── users/
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── posts/
│   │   ├── dto/
│   │   │   └── create-post.dto.ts
│   │   ├── post.entity.ts
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   └── posts.module.ts
│   └── comments/
│       ├── dto/
│       │   └── create-comment.dto.ts
│       ├── comment.entity.ts
│       ├── comments.controller.ts
│       ├── comments.service.ts
│       └── comments.module.ts
├── app.module.ts
└── main.ts
```

## Development

- Run tests: `npm test`
- Run e2e tests: `npm run test:e2e`
- Lint code: `npm run lint`
- Format code: `npm run format`
