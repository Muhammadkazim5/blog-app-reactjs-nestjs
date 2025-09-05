import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postApi, commentApi, userApi } from '../services/api';
import type { PostWithRelations, CommentWithRelations, User, CreateCommentDto } from '../types';
import { 
  DocumentTextIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [comments, setComments] = useState<CommentWithRelations[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
  });

  const [commentFormData, setCommentFormData] = useState<CreateCommentDto>({
    content: '',
    userId: 0,
    postId: 0,
  });

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      fetchUsers();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await postApi.getById(parseInt(id!));
      setPost(data);
      setPostFormData({ title: data.title, content: data.content });
      setCommentFormData(prev => ({ ...prev, postId: data.id }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await commentApi.getByPost(parseInt(id!));
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postApi.update(post!.id, postFormData);
      setShowEditForm(false);
      fetchPost();
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await commentApi.create(commentFormData);
      setCommentFormData({ content: '', userId: 0, postId: post!.id });
      setShowCommentForm(false);
      fetchComments();
    } catch (err) {
      setError('Failed to create comment');
      console.error('Error creating comment:', err);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post? This will also delete all comments.')) {
      try {
        await postApi.delete(post!.id);
        window.location.href = '/posts';
      } catch (err) {
        setError('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentApi.delete(commentId);
        fetchComments();
      } catch (err) {
        setError('Failed to delete comment');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const handleCancelPost = () => {
    setShowEditForm(false);
    setPostFormData({ title: post!.title, content: post!.content });
  };

  const handleCancelComment = () => {
    setShowCommentForm(false);
    setCommentFormData({ content: '', userId: 0, postId: post!.id });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error || 'Post not found'}</div>
        <Link to="/posts" className="text-blue-600 hover:text-blue-800">
          ← Back to Posts
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
            to="/posts"
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Post Details</h1>
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
            onClick={handleDeletePost}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Edit Post Form */}
      {showEditForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Post</h2>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={postFormData.title}
                onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
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
                rows={6}
                value={postFormData.content}
                onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
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
                onClick={handleCancelPost}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <UserIcon className="h-4 w-4 mr-1" />
                  By {post.author.name}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          {post.image && (
            <div className="mb-6">
              <img
                src={`http://localhost:3000/uploads/${post.image}`}
                alt={post.title}
                className="h-64 w-full object-cover rounded-md"
              />
            </div>
          )}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h2>
          <button
            onClick={() => setShowCommentForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Comment
          </button>
        </div>

        {/* Add Comment Form */}
        {showCommentForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <textarea
                  id="commentContent"
                  rows={3}
                  value={commentFormData.content}
                  onChange={(e) => setCommentFormData({ ...commentFormData, content: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="commentUserId" className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <select
                  id="commentUserId"
                  value={commentFormData.userId}
                  onChange={(e) => setCommentFormData({ ...commentFormData, userId: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                  required
                >
                  <option value={0}>Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Add Comment
                </button>
                <button
                  type="button"
                  onClick={handleCancelComment}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {comment.user.name}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-700">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
