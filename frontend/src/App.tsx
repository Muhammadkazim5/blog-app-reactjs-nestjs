import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Comments from './pages/Comments';
import UserDetail from './pages/UserDetail';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/comments" element={<Comments />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
