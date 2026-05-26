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

// Placeholder Pages
const LoginPage = () => <div className="p-8 text-center animate-in"><h2>Login Page</h2></div>;
const RegisterPage = () => <div className="p-8 text-center animate-in"><h2>Register Page</h2></div>;
const ChatPage = () => <div className="p-8 text-center animate-in"><h2>Chat Interface</h2></div>;
const ProfilePage = () => <div className="p-8 text-center animate-in"><h2>Profile</h2></div>;
const AdminDashboard = () => <div className="p-8 text-center animate-in"><h2>Admin Dashboard</h2></div>;

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
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
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
