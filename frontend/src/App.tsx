import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
// import Users from './pages/Users';
import Posts from './pages/Posts';
// import Comments from './pages/Comments';
import UserDetail from './pages/UserDetail';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            {/* <Route path="/users" element={<Users />} /> */}
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            {/* <Route path="/comments" element={<Comments />} /> */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
