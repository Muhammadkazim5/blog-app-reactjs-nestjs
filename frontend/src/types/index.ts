// Base types first to avoid circular dependencies
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
}

// Extended types with relationships
export interface UserWithRelations extends User {
  posts?: Post[];
  comments?: Comment[];
}

export interface PostWithRelations extends Post {
  author: User;
  comments?: Comment[];
}

export interface CommentWithRelations extends Comment {
  user: User;
  post: Post;
}

// DTO types
export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  authorId: number;
  image?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  image?: string;
}

export interface CreateCommentDto {
  content: string;
  userId: number;
  postId: number;
}

export interface UpdateCommentDto {
  content?: string;
}

// Pagination types
export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
