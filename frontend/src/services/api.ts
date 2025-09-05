import axios from 'axios';
import type { 
  User, 
  UserWithRelations,
  CreateUserDto, 
  UpdateUserDto,
  Post,
  PostWithRelations,
  CreatePostDto,
  UpdatePostDto,
  Comment,
  CommentWithRelations,
  CreateCommentDto,
  UpdateCommentDto,
  PaginationDto
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method
    });
    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: number): Promise<UserWithRelations> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Post API
export const postApi = {
  getAll: async (pagination?: PaginationDto): Promise<PostWithRelations[]> => {
    const params = pagination ? { page: pagination.page, limit: pagination.limit } : {};
    const response = await api.get('/posts', { params });
    return response.data;
  },

  getById: async (id: number): Promise<PostWithRelations> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  getByUser: async (userId: number, pagination?: PaginationDto): Promise<PostWithRelations[]> => {
    const params = pagination ? { page: pagination.page, limit: pagination.limit } : {};
    const response = await api.get(`/posts/user/${userId}`, { params });
    return response.data;
  },

  create: async (data: CreatePostDto, image?: File): Promise<Post> => {
    if (image) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('userId', data.authorId.toString()); // Backend expects userId
      
      if (image) {
        formData.append('image', image);
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Use JSON for regular posts
      const postData = {
        title: data.title,
        content: data.content,
        userId: data.authorId, // Backend expects userId
        ...(data.image && { image: data.image })
      };
      
      const response = await api.post('/posts', postData);
      return response.data;
    }
  },

  update: async (id: number, data: UpdatePostDto): Promise<Post> => {
    const response = await api.patch(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Comment API
export const commentApi = {
  getAll: async (): Promise<CommentWithRelations[]> => {
    const response = await api.get('/comments');
    return response.data;
  },

  getById: async (id: number): Promise<CommentWithRelations> => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  getByPost: async (postId: number): Promise<CommentWithRelations[]> => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  getByUser: async (userId: number): Promise<CommentWithRelations[]> => {
    const response = await api.get(`/comments/user/${userId}`);
    return response.data;
  },

  create: async (data: CreateCommentDto): Promise<Comment> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCommentDto): Promise<Comment> => {
    const response = await api.patch(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};

export default api;
