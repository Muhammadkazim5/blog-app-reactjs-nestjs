import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postApi, userApi, commentApi } from '../services/api';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  PlusIcon,
  EyeIcon,
  HeartIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import type { PostWithRelations } from '../types';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [recentPosts, setRecentPosts] = useState<PostWithRelations[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent posts (limit to 6)
        const recentPosts = await postApi.getAll({ page: 1, limit: 6 });
        setRecentPosts(recentPosts);

        // Fetch all posts to get accurate count
        const allPosts = await postApi.getAll();
        
        // Fetch other stats
        const [users, comments] = await Promise.all([
          userApi.getAll(),
          commentApi.getAll()
        ]);

        setStats({
          totalUsers: users.length,
          totalPosts: allPosts.length, // Use the actual count of all posts
          totalComments: comments.length
        });
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-6 py-16 sm:px-16 sm:py-24 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Welcome to Blog App'}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            {isAuthenticated 
              ? 'Continue sharing your thoughts and connecting with the community.'
              : 'A modern blog platform where you can share ideas, connect with others, and build meaningful conversations.'
            }
          </p>
          {!isAuthenticated && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/posts"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                <EyeIcon className="mr-2 h-5 w-5" />
                Explore Posts
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalPosts}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalComments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
            <Link
              to="/posts"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
            >
              View all posts
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <Link to={`/posts/${post.id}`}>
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.author?.name || 'Anonymous'}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {truncateText(post.content, 120)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          {post.comments?.length || 0} comments
                        </span>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Be the first to share your thoughts!</p>
            {isAuthenticated && (
              <Link
                to="/posts"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/posts"
              className="group bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:from-green-100 hover:to-green-200 transition-all duration-200"
            >
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-green-800">Browse Posts</h4>
                  <p className="text-sm text-green-600">Discover amazing content</p>
                </div>
              </div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="group bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-blue-800">My Profile</h4>
                      <p className="text-sm text-blue-600">Manage your account</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/posts"
                  className="group bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-purple-800">Create Post</h4>
                      <p className="text-sm text-purple-600">Share your thoughts</p>
                    </div>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-blue-800">Sign In</h4>
                      <p className="text-sm text-blue-600">Access your account</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-purple-800">Join Us</h4>
                      <p className="text-sm text-purple-600">Create your account</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
