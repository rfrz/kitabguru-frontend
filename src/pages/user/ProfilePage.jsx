// Mengimpor React beserta hooks useState dan useEffect untuk manajemen data lokal
import React, { useState, useEffect } from 'react';
// Mengimpor integrasi API user (usersApi) untuk modifikasi profil/hapus akun
import { usersApi } from '../../api/users';
// Mengimpor hook autentikasi untuk melacak user login, memicu logout, dan loading status
import { useAuth } from '../../contexts/AuthContext';
// Mengimpor hook tema untuk memantau dan mengubah skema warna (dark/light)
import { useTheme } from '../../contexts/ThemeContext';
// Mengimpor hook toast untuk menampilkan notifikasi melayang di layar
import { useToast } from '../../contexts/ToastContext';
// Mengimpor useNavigate untuk memicu navigasi antarmuka router
import { useNavigate } from 'react-router-dom';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../../components/ui/button';
// Mengimpor komponen kerangka pemuatan (Skeleton)
import { Skeleton } from '../../components/ui/skeleton';
// Mengimpor daftar ikon dekorasi layout dari lucide-react
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Trash2, 
  Sun, 
  Moon, 
  Settings, 
  ShieldAlert, 
  Palette, 
  Check,
  Monitor
} from 'lucide-react';

/**
 * Halaman ProfilePage bertindak sebagai layar pengaturan profil.
 * Menyediakan form pengubahan nama/email, penggantian sandi, penghapusan akun, serta pilihan tema.
 */
export default function ProfilePage() {
  // Mendestruktur status user, fungsi logout, dan status memuat autentikasi awal dari AuthContext
  const { user, logout, isLoading: authLoading } = useAuth();
  // Mendestruktur setelan tema aktif dan fungsi pengubah tema dari ThemeContext
  const { theme, setTheme } = useTheme();
  // Mendapatkan fungsi pemicu toast dari ToastContext
  const { toast } = useToast();
  // Navigasi router
  const navigate = useNavigate();
  
  // State untuk melacak tab pengaturan aktif ('profile', 'security', atau 'appearance')
  const [activeTab, setActiveTab] = useState('profile');
  // State formulir penyimpan nilai input pengaturan profil dan sandi
  const [formData, setFormData] = useState({ username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  // State indikator saat request modifikasi data ke API sedang berjalan (loading)
  const [loading, setLoading] = useState(false);

  // Efek samping untuk memasukkan data user aktif ke form isian saat halaman dimuat atau data user terisi
  useEffect(() => {
    // Jika data user tersedia
    if (user) {
      // Perbarui nilai username dan email di form data
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]); // Bergantung pada data user

  // Fungsi penanganan perubahan teks di seluruh kolom input form
  const handleChange = (e) => {
    // Memperbarui properti name yang sesuai di state formData dengan nilai barunya
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi asinkron untuk mengirim request pembaruan informasi dasar profil (username & email)
  const handleUpdateProfile = async (e) => {
    // Mencegah reload halaman web
    e.preventDefault();
    // Mengaktifkan status loading proses
    setLoading(true);
    try {
      // Mengirim request PATCH modifikasi profil diri ke API backend
      await usersApi.updateMe({
        username: formData.username,
        email: formData.email
      });
      // Menampilkan toast sukses jika request berhasil diselesaikan
      toast({
        title: "Success",
        description: "Profile information updated successfully.",
        variant: "success"
      });
    } catch (err) {
      // Menampilkan toast error berisi detail kesalahan dari server jika gagal
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      // Mematikan status loading
      setLoading(false);
    }
  };

  // Fungsi asinkron penanganan submit ganti sandi baru
  const handleChangePassword = async (e) => {
    // Mencegah reload halaman web
    e.preventDefault();
    // Validasi: Periksa kesamaan kolom password baru dengan konfirmasi password baru
    if (formData.newPassword !== formData.confirmPassword) {
      // Tampilkan notifikasi toast kesalahan jika tidak cocok
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // Aktifkan status loading proses
    setLoading(true);
    try {
      // Mengirim request PATCH dengan membawa isian kolom password baru ke API
      await usersApi.updateMe({
        password: formData.newPassword
      });
      // Tampilkan toast sukses pembaruan sandi
      toast({
        title: "Success",
        description: "Password updated successfully.",
        variant: "success"
      });
      // Bersihkan kolom-kolom input sandi di form setelah berhasil diubah
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      // Tampilkan toast berisi detail error kegagalan
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to change password.",
        variant: "destructive"
      });
    } finally {
      // Matikan status loading
      setLoading(false);
    }
  };

  // Fungsi asinkron menghapus akun pribadi secara permanen (deleteMe)
  const handleDelete = async () => {
    // Konfirmasi keamanan tingkat lanjut guna meyakinkan niat pengguna
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Mengirim request DELETE akun pribadi ke API backend
        await usersApi.deleteMe();
        // Tampilkan pesan sukses penghapusan akun
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted.",
          variant: "warning"
        });
        // Picu fungsi logout untuk membersihkan sisa token di memori lokal
        logout();
        // Kembalikan pengguna secara paksa ke layar masuk (login)
        navigate('/login');
      } catch (err) {
        // Tampilkan notifikasi error kegagalan penghapusan akun
        toast({
          title: "Error",
          description: "Failed to delete account.",
          variant: "destructive"
        });
      }
    }
  };

  // Tampilan kerangka pemuatan (Skeleton) jika status loading autentikasi awal user masih berjalan
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6 md:p-8 space-y-6">
          {/* Kerangka skeleton bagian header */}
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          {/* Kerangka skeleton grid konten halaman */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Samping kiri menu tab */}
            <div className="space-y-2 col-span-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Konten form kanan */}
            <div className="col-span-3 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Wadah utama halaman pengaturan
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      {/* Box kartu putih dengan batas sudut melengkung */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in">
        {/* Header pengaturan */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-4">
            {/* Tombol kembali ke halaman sebelumnya menggunakan router -1 history */}
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile, password and configurations</p>
            </div>
          </div>
        </div>

        {/* Struktur layout grid membagi menu tab kiri dan panel isi kanan */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[450px]">
          {/* Menu Tab Navigasi Kiri */}
          <div className="col-span-1 bg-gray-50/50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4 space-y-1 flex md:flex-col overflow-x-auto md:overflow-x-visible">
            {/* Tombol Tab Edit Profil */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <User size={18} />
              <span className="hidden md:inline">Edit Profile</span>
            </button>
            
            {/* Tombol Tab Keamanan (Ganti Password & Hapus Akun) */}
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                activeTab === 'security'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <ShieldAlert size={18} />
              <span className="hidden md:inline">Security</span>
            </button>

            {/* Tombol Tab Tampilan Skema Warna Tema */}
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                activeTab === 'appearance'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <Palette size={18} />
              <span className="hidden md:inline">Appearance</span>
            </button>
          </div>

          {/* Panel Konten Kanan */}
          <div className="col-span-3 p-6 md:p-8">
            {/* RENDER KONDISIONAL: TAB EDIT PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                  <p className="text-xs text-gray-500">Update your username and email address.</p>
                </div>
                
                <div className="space-y-4">
                  {/* Field Username */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Field Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Tombol Simpan Perubahan Profil */}
                <Button type="submit" className="w-fit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}

            {/* RENDER KONDISIONAL: TAB KEAMANAN (SECURITY) */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Form Ubah Kata Sandi */}
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
                    <p className="text-xs text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Sandi Baru */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input 
                          type="password" 
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                          required
                        />
                      </div>
                    </div>

                    {/* Konfirmasi Sandi Baru */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tombol Update Password */}
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Changing...' : 'Update Password'}
                  </Button>
                </form>

                {/* Zona Bahaya: Hapus Akun Permanen */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-xs text-gray-500 mb-4">Permanently delete your account. This action cannot be undone.</p>
                  {/* Tombol Hapus Akun */}
                  <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {/* RENDER KONDISIONAL: TAB APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-xs text-gray-500">Customize the application UI style.</p>
                </div>

                {/* Grid Pilihan Tema (Light / Dark / System) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Pilihan 1: Mode Terang (Light Mode) */}
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'light'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Light Mode</span>
                      {theme === 'light' && <Check size={16} className="text-blue-600 dark:text-blue-500" />}
                    </div>
                  </button>

                  {/* Pilihan 2: Mode Gelap (Dark Mode) */}
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'dark'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-slate-100 flex items-center justify-center border border-slate-800">
                      <Moon size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span>
                      {theme === 'dark' && <Check size={16} className="text-blue-600 dark:text-blue-500" />}
                    </div>
                  </button>

                  {/* Pilihan 3: Mengikuti Preferensi Sistem OS */}
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'system'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <Monitor size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                      {theme === 'system' && <Check size={16} className="text-blue-600 dark:text-blue-500" />}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
