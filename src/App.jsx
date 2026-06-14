import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

// Layouts & Pages (Placeholders for now)
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/chat" />;
  
  return children;
};

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ChatPage from './pages/user/ChatPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminChatView from './pages/admin/AdminChatView';
import AdminIoTView from './pages/admin/AdminIoTView';

import ProfilePage from './pages/user/ProfilePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* User Routes */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatProvider>
            <ChatPage />
          </ChatProvider>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/chat/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminChatView />
        </ProtectedRoute>
      } />
      <Route path="/admin/iot/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminIoTView />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
