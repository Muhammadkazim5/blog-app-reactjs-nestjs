import axios from 'axios';
import type { 
  User, 
  UserWithRelations,
  CreateUserDto, 
  UpdateUserDto,
  UpdateProfileDto,
  Post,
  PostWithRelations,
  CreatePostDto,
  UpdatePostDto,
  Comment,
  CommentWithRelations,
  CreateCommentDto,
  CreateCommentAuthDto,
  UpdateCommentDto,
  PaginationDto,
  PaginatedResponse
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// Auth API
export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileDto) => {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },
};

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
    return response.data.data || response.data; // Handle both paginated and non-paginated responses
  },

  getAllWithPagination: async (pagination?: PaginationDto): Promise<PaginatedResponse<PostWithRelations>> => {
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
        ...(data.image && { image: data.image })
      };
      
      const response = await api.post('/posts', postData);
      return response.data;
    }
  },

  update: async (id: number, data: UpdatePostDto, image?: File): Promise<Post> => {
    if (image) {
      // Use FormData for file uploads
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      formData.append('image', image);

      const response = await api.patch(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Use JSON for regular updates
      const response = await api.patch(`/posts/${id}`, data);
      return response.data;
    }
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

  createAuth: async (data: CreateCommentAuthDto): Promise<Comment> => {
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
