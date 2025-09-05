import { useState, useEffect } from 'react';
import { commentApi, userApi, postApi } from '../services/api';
import type { CommentWithRelations, CreateCommentDto, User, PostWithRelations } from '../types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Comments = () => {
  const [comments, setComments] = useState<CommentWithRelations[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentWithRelations | null>(null);

  const [formData, setFormData] = useState<CreateCommentDto>({
    content: '',
    userId: 0,
    postId: 0,
  });

  useEffect(() => {
    fetchComments();
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentApi.getAll();
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
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

  const fetchPosts = async () => {
    try {
      const data = await postApi.getAll();
      setPosts(data.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingComment) {
        await commentApi.update(editingComment.id, {
          content: formData.content,
        });
        setEditingComment(null);
      } else {
        await commentApi.create(formData);
      }
      setFormData({ content: '', userId: 0, postId: 0 });
      setShowCreateForm(false);
      fetchComments();
    } catch (err) {
      setError('Failed to save comment');
      console.error('Error saving comment:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentApi.delete(id);
        fetchComments();
      } catch (err) {
        setError('Failed to delete comment');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const handleEdit = (comment: CommentWithRelations) => {
    setEditingComment(comment);
    setFormData({ 
      content: comment.content, 
      userId: comment.user.id,
      postId: comment.post.id
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingComment(null);
    setFormData({ content: '', userId: 0, postId: 0 });
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
        <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Comment
        </button>
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
            {editingComment ? 'Edit Comment' : 'Create New Comment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Comment
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
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                User
              </label>
              <select
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
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
            <div>
              <label htmlFor="postId" className="block text-sm font-medium text-gray-700">
                Post
              </label>
              <select
                id="postId"
                value={formData.postId}
                onChange={(e) => setFormData({ ...formData, postId: parseInt(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                required
              >
                <option value={0}>Select a post</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {editingComment ? 'Update' : 'Create'}
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

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No comments found. Create your first comment!
          </div>
        ) : (
          comments.map((comment) => (
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
                      <div className="flex items-center text-sm text-gray-500">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        {comment.post.title}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
