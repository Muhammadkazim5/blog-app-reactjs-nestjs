import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { PostWithRelations, CreatePostDto, PaginatedResponse } from '../types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Posts = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PaginatedResponse<PostWithRelations> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PostWithRelations | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);

  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postApi.getAll({ page: currentPage, limit });
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await postApi.update(editingPost.id, {
          title: formData.title,
          content: formData.content,
        });
        setEditingPost(null);
      } else {
        await postApi.create(formData, selectedImage || undefined);
      }
      setFormData({ title: '', content: '' });
      setSelectedImage(null);
      setShowCreateForm(false);
      fetchPosts();
    } catch (err) {
      setError('Failed to save post');
      console.error('Error saving post:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postApi.delete(id);
        fetchPosts();
      } catch (err) {
        setError('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleEdit = (post: PostWithRelations) => {
    setEditingPost(post);
    setFormData({ 
      title: post.title, 
      content: post.content
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '' });
    setSelectedImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          {isAuthenticated && user && (
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.name}!
            </p>
          )}
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Post
          </button>
        ) : (
          <div className="text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
            {' '}to create posts
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                required
              />
            </div>
            {!editingPost && (
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {editingPost ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts?.data.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No posts found. Create your first post!
          </div>
        ) : (
          posts?.data.map((post) => (
            <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        By {post.author.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    {isAuthenticated && user && user.id === post.author.id && (
                      <>
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {post.content.length > 200 
                    ? `${post.content.substring(0, 200)}...` 
                    : post.content
                  }
                </p>

                {post.image && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:3000/uploads/${post.image}`}
                      alt={post.title}
                      className="h-48 w-full object-cover rounded-md"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                  <span className="text-sm text-gray-500">
                    {post.comments?.length || 0} comments
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {posts && posts.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!posts.hasPrev}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!posts.hasNext}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * limit, posts.total)}
                </span>{' '}
                of <span className="font-medium">{posts.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!posts.hasPrev}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!posts.hasNext}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
