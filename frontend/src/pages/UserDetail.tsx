import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi, postApi } from '../services/api';
import type { UserWithRelations, PostWithRelations, PaginatedResponse } from '../types';
import { 
  UserIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import ImageDisplay from '../components/ImageDisplay';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [userPosts, setUserPosts] = useState<PaginatedResponse<PostWithRelations> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchUserPosts();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userApi.getById(parseInt(id!));
      setUser(data);
      setFormData({ name: data.name, email: data.email });
      setError(null);
    } catch (err) {
      setError('Failed to fetch user');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const data = await postApi.getByUser(parseInt(id!));
      setUserPosts(data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.update(user!.id, formData);
      setShowEditForm(false);
      fetchUser();
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their posts and comments.')) {
      try {
        await userApi.delete(user!.id);
        window.location.href = '/users';
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setFormData({ name: user!.name, email: user!.email });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error || 'User not found'}</div>
        <Link to="/users" className="text-blue-600 hover:text-blue-800">
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/users"
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Edit User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Update
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

      {/* User Info */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <UserIcon className="h-12 w-12 text-gray-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">User ID</h3>
              <p className="text-gray-600">#{user.id}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Total Posts</h3>
              <p className="text-gray-600">{userPosts?.total || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Posts by {user.name}</h2>
        {userPosts?.data.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            This user hasn't created any posts yet.
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts?.data.map((post) => (
              <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Post →
                    </Link>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content
                    }
                  </p>

                  {post.image && (
                    <div className="mb-4">
                      <ImageDisplay
                        imagePath={post.image}
                        alt={post.title}
                        className="h-48 w-full"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {post.comments?.length || 0} comments
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
