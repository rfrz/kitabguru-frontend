// Mengimpor Router bertipe HashRouter dan komponen navigasi/rute dari react-router-dom
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Mengimpor penyedia konteks dan hook kustom autentikasi user
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Mengimpor penyedia konteks obrolan chat
import { ChatProvider } from './contexts/ChatContext';
// Mengimpor penyedia konteks tema (terang/gelap)
import { ThemeProvider } from './contexts/ThemeContext';
// Mengimpor penyedia konteks toast (notifikasi melayang)
import { ToastProvider } from './contexts/ToastContext';
// Mengimpor pembatas error (ErrorBoundary) untuk menangkap crash UI pada komponen anak
import ErrorBoundary from './components/layout/ErrorBoundary';

// Komponen Pembatas Akses (ProtectedRoute) untuk mengamankan halaman dari akses ilegal non-user
const ProtectedRoute = ({ children, requireAdmin }) => {
  // Mengambil status login user dan status loading dari konteks autentikasi
  const { user, isLoading } = useAuth();
  
  // Jika status autentikasi masih dimuat (loading), tampilkan teks loading sederhana
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  // Jika pengguna belum masuk (login), alihkan navigasi otomatis ke halaman '/login'
  if (!user) return <Navigate to="/login" />;
  // Jika halaman membutuhkan hak akses admin namun user bukan admin, alihkan ke halaman '/chat'
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/chat" />;
  
  // Mengembalikan elemen anak jika user memenuhi seluruh syarat akses
  return children;
};

// Mengimpor halaman masuk (LoginPage)
import LoginPage from './pages/auth/LoginPage';
// Mengimpor halaman pendaftaran akun (RegisterPage)
import RegisterPage from './pages/auth/RegisterPage';
// Mengimpor halaman utama percakapan chat (ChatPage)
import ChatPage from './pages/user/ChatPage';
// Mengimpor halaman dashboard utama admin (AdminDashboard)
import AdminDashboard from './pages/admin/AdminDashboard';
// Mengimpor halaman detail chat milik pengguna di dashboard admin (AdminChatView)
import AdminChatView from './pages/admin/AdminChatView';
// Mengimpor halaman detail rekaman sesi IoT di dashboard admin (AdminIoTView)
import AdminIoTView from './pages/admin/AdminIoTView';
// Mengimpor halaman profil diri pengguna (ProfilePage)
import ProfilePage from './pages/user/ProfilePage';
// Mengimpor halaman landing utama depan (LandingPage)
import LandingPage from './pages/LandingPage';
// Mengimpor halaman error rute tidak ditemukan (NotFoundPage)
import NotFoundPage from './pages/NotFoundPage';

// Komponen penentu daftar rute-rute navigasi aplikasi (React Router)
function AppRoutes() {
  return (
    <Routes>
      {/* Rute depan: Landing Page */}
      <Route path="/" element={<LandingPage />} />
      {/* Rute halaman login */}
      <Route path="/login" element={<LoginPage />} />
      {/* Rute halaman pendaftaran akun */}
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Kelompok Rute Khusus Pengguna Terdaftar (User Routes) */}
      <Route element={
        // Mengamankan rute anak di dalamnya menggunakan ProtectedRoute
        <ProtectedRoute>
          {/* Menyediakan konteks ChatProvider untuk rute obrolan chat */}
          <ChatProvider>
            {/* Outlet bertindak sebagai placeholder untuk merender rute anak yang aktif */}
            <Outlet />
          </ChatProvider>
        </ProtectedRoute>
      }>
        {/* Rute utama chat */}
        <Route path="/chat" element={<ChatPage />} />
        {/* Rute chat dengan ID sesi tertentu */}
        <Route path="/chat/:sessionId" element={<ChatPage />} />
      </Route>
      {/* Rute halaman edit profil pengguna */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Kelompok Rute Khusus Administrator (Admin Routes) */}
      {/* Rute utama dashboard admin */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      {/* Rute detail chat user di sisi admin */}
      <Route path="/admin/chat/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminChatView />
        </ProtectedRoute>
      } />
      {/* Rute detail sesi IoT di sisi admin */}
      <Route path="/admin/iot/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminIoTView />
        </ProtectedRoute>
      } />

      {/* Rute tangkap semua (fallback 404): Jika rute URL tidak ada yang cocok di atas */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Komponen utama aplikasi React
function App() {
  return (
    // Pembatas error global untuk menangkap crash di level manapun
    <ErrorBoundary>
      {/* Menyediakan tema terang/gelap global */}
      <ThemeProvider>
        {/* Menyediakan antrean notifikasi melayang global */}
        <ToastProvider>
          {/* Mengaktifkan sistem routing berbasis Hash */}
          <Router>
            {/* Menyediakan data status login user global */}
            <AuthProvider>
              {/* Merender daftar rute aplikasi */}
              <AppRoutes />
            </AuthProvider>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Mengekspor komponen App secara default
export default App;
