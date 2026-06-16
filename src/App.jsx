import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/layout/ErrorBoundary';

// Layouts & Pages
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
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* User Routes */}
      <Route element={
        <ProtectedRoute>
          <ChatProvider>
            <Outlet />
          </ChatProvider>
        </ProtectedRoute>
      }>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
      </Route>
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

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
