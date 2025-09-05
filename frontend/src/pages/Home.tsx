import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to NestJS Blog
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A modern blog application built with NestJS backend and React frontend.
          Manage users, create posts, and engage with comments.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    User Management
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Manage Users
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/users"
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                View all users
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Blog Posts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Create & Read Posts
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/posts"
                className="font-medium text-green-600 hover:text-green-500 flex items-center"
              >
                Browse posts
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Comments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Engage & Discuss
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/comments"
                className="font-medium text-purple-600 hover:text-purple-500 flex items-center"
              >
                View comments
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Link
              to="/users"
              className="bg-blue-50 border border-blue-200 rounded-md p-4 hover:bg-blue-100 transition-colors"
            >
              <div className="text-sm font-medium text-blue-800">View Users</div>
              <div className="text-sm text-blue-600">Browse all registered users</div>
            </Link>
            <Link
              to="/posts"
              className="bg-green-50 border border-green-200 rounded-md p-4 hover:bg-green-100 transition-colors"
            >
              <div className="text-sm font-medium text-green-800">Read Posts</div>
              <div className="text-sm text-green-600">Explore blog posts</div>
            </Link>
            <Link
              to="/comments"
              className="bg-purple-50 border border-purple-200 rounded-md p-4 hover:bg-purple-100 transition-colors"
            >
              <div className="text-sm font-medium text-purple-800">View Comments</div>
              <div className="text-sm text-purple-600">See all comments</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
