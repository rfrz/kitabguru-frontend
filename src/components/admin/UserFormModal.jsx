// Mengimpor React beserta hooks useState dan useEffect untuk manajemen state lokal dan efek samping
import React, { useState, useEffect } from 'react';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../ui/button';
// Mengimpor komponen input kustom (Input)
import { Input } from '../ui/input';
// Mengimpor komponen label kustom (Label)
import { Label } from '../ui/label';
// Mengimpor ikon X (tanda silang) dari lucide-react untuk tombol tutup modal
import { X } from 'lucide-react';

// Komponen Modal Form Pengguna untuk membuat atau mengedit akun pengguna di sisi admin
export default function UserFormModal({ isOpen, onClose, onSubmit, user }) {
  // State untuk menampung input username pengguna baru
  const [username, setUsername] = useState('');
  // State untuk menampung input email pengguna baru
  const [email, setEmail] = useState('');
  // State untuk menampung input sandi (password) pengguna baru
  const [password, setPassword] = useState('');
  // State untuk pilihan peran akun ('user' / 'admin')
  const [role, setRole] = useState('user');
  // State boolean untuk status keaktifan akun user (aktif / dinonaktifkan)
  const [isActive, setIsActive] = useState(true);
  // State untuk menampung teks pesan error/galat
  const [error, setError] = useState('');
  // State penanda status loading proses request API
  const [loading, setLoading] = useState(false);

  // Efek samping untuk menyinkronkan data form ketika modal dibuka atau user target berubah
  useEffect(() => {
    // Jika modal menerima objek data user (Mode Edit)
    if (user) {
      // Set pilihan role sesuai role user
      setRole(user.role || 'user');
      // Set status aktif sesuai status user
      setIsActive(user.is_active !== undefined ? user.is_active : true);
      // Set username
      setUsername(user.username || '');
      // Set email
      setEmail(user.email || '');
    // Jika tidak menerima data user (Mode Tambah Baru)
    } else {
      // Kosongkan seluruh input form
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('user');
      setIsActive(true);
    }
    // Kosongkan pesan error setiap kali modal dibuka/diubah
    setError('');
  }, [user, isOpen]);

  // Jika modal diset tidak terbuka (isOpen = false), jangan merender apapun ke layar
  if (!isOpen) return null;

  // Fungsi penanganan saat admin menekan submit tombol simpan/buat
  const handleSubmit = async (e) => {
    // Mencegah perilaku default browser memuat ulang halaman saat form disubmit
    e.preventDefault();
    // Bersihkan pesan error sebelumnya
    setError('');
    // Aktifkan status loading
    setLoading(true);

    try {
      // Jika dalam mode edit user
      if (user) {
        // Panggil fungsi submit edit (hanya memperbarui role dan is_active sesuai batas endpoint backend patch)
        await onSubmit(user.id, { role, is_active: isActive });
      // Jika dalam mode buat user baru
      } else {
        // Memastikan seluruh field wajib diisi lengkap
        if (!username || !email || !password) {
          throw new Error('All fields are required');
        }
        // Panggil fungsi submit pembuatan user baru
        await onSubmit(null, { username, email, password, role });
      }
      // Tutup modal setelah proses submit berhasil
      onClose();
    // Menangkap kesalahan saat pemrosesan request
    } catch (err) {
      // Simpan pesan detail kesalahan dari respons API ke state error
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      // Matikan status loading
      setLoading(false);
    }
  };

  return (
    // Wadah terluar modal dengan latar belakang gelap transparan dan efek buram (blur)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      {/* Kotak modal utama dengan kelengkungan sudut, warna card, bayangan shadow, dan animasi masuk */}
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-border/50">
          {/* Judul modal dinamis sesuai dengan mode (Edit / Tambah) */}
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          {/* Tombol X di pojok kanan untuk menutup modal */}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          {/* Menampilkan kotak error merah jika state error terisi */}
          {error && (
            <div className="p-3 text-sm rounded-lg bg-destructive/15 text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Jika Mode Edit: Tampilkan data username dan email sebagai kolom baca saja (read-only) */}
          {user ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Username</Label>
                <div className="mt-1 px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm text-foreground/80">
                  {username}
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                <div className="mt-1 px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm text-foreground/80">
                  {email}
                </div>
              </div>
            </div>
          ) : (
            // Jika Mode Tambah: Render kolom input isian lengkap
            <>
              {/* Kolom input Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                />
              </div>

              {/* Kolom input Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Kolom input Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </>
          )}

          {/* Pilihan Dropdown Role (selalu bisa diubah baik mode edit maupun buat) */}
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Pilihan Checkbox Active Account (hanya muncul saat mode edit user) */}
          {user && (
            <div className="flex items-center gap-2 py-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active Account</Label>
            </div>
          )}

          {/* Area Tombol Aksi (Cancel dan Save/Create) */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            {/* Tombol batalkan */}
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            {/* Tombol submit simpan */}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : user ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
