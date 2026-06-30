// Mengimpor React beserta hooks useState dan useEffect
import React, { useState, useEffect } from 'react';
// Mengimpor API Admin untuk integrasi data pengguna, sesi chat, dan sesi IoT
import { adminApi } from '../../api/admin';
// Mengimpor komponen kartu kustom (Card, CardHeader, CardTitle, CardContent)
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../../components/ui/button';
// Mengimpor ikon-ikon dari lucide-react untuk dekorasi antarmuka dashboard
import { 
  LogOut, Trash2, Plus, Edit2, Eye, Users, MessageSquare, Cpu, 
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Book
} from 'lucide-react';
// Mengimpor hook autentikasi untuk memicu logout
import { useAuth } from '../../contexts/AuthContext';
// Mengimpor useNavigate untuk mengarahkan admin ke halaman detail/percakapan
import { useNavigate } from 'react-router-dom';
// Mengimpor modal form penambahan/edit data pengguna (UserFormModal)
import UserFormModal from '../../components/admin/UserFormModal';
// Mengimpor halaman manajemen EPUB
import AdminEpubManagement from './AdminEpubManagement';

// Konstanta batas jumlah data per halaman untuk sistem paginasi tabel
const ITEMS_PER_PAGE = 10;

/**
 * Halaman AdminDashboard menyediakan antarmuka konsol manajemen data bagi admin.
 * Memuat panel kontrol tab untuk mengelola Akun Pengguna, Sesi Webchat, dan Sesi Perangkat IoT.
 */
export default function AdminDashboard() {
  // State untuk melacak tab aktif saat ini ('users', 'sessions', atau 'iot')
  const [activeTab, setActiveTab] = useState('users');
  // Mengambil fungsi logout dari AuthContext
  const { logout } = useAuth();
  // Navigasi router
  const navigate = useNavigate();

  // State penyimpan daftar pengguna (users)
  const [users, setUsers] = useState([]);
  // State penyimpan daftar sesi chat web (sessions)
  const [sessions, setSessions] = useState([]);
  // State penyimpan daftar sesi perangkat IoT (iot)
  const [iot, setIot] = useState([]);

  // State nomor halaman aktif sistem paginasi tabel pengguna
  const [userPage, setUserPage] = useState(1);
  // State nomor halaman aktif sistem paginasi tabel sesi chat
  const [sessionPage, setSessionPage] = useState(1);
  // State nomor halaman aktif sistem paginasi tabel sesi IoT
  const [iotPage, setIotPage] = useState(1);

  // State penyimpan informasi total jumlah seluruh user di database
  const [totalUsers, setTotalUsers] = useState(0);
  // State penyimpan informasi total jumlah seluruh sesi chat di database
  const [totalSessions, setTotalSessions] = useState(0);
  // State penyimpan informasi total jumlah seluruh sesi IoT di database
  const [totalIot, setTotalIot] = useState(0);

  // State indikator memuat data awal
  const [loading, setLoading] = useState(true);
  // State pengendali apakah modal edit/tambah user sedang terbuka di layar
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State penampung objek user yang sedang dipilih untuk diedit (null jika tambah baru)
  const [selectedUser, setSelectedUser] = useState(null);

  // Fungsi asinkron untuk mengambil data pengguna terpaginasi dari server
  const fetchUsers = async (page = 1) => {
    try {
      // Mengirim request GET ke endpoint admin getUsers terpaginasi
      const data = await adminApi.getUsers(page, ITEMS_PER_PAGE);
      // Menyimpan data pengguna ke state
      setUsers(data.users || []);
      // Menyimpan total data pengguna ke state
      setTotalUsers(data.total || 0);
    } catch (e) {
      // Cetak error ke konsol
      console.error("Failed to fetch users", e);
    }
  };

  // Fungsi asinkron untuk mengambil data sesi chat terpaginasi dari server
  const fetchSessions = async (page = 1) => {
    try {
      // Mengirim request GET ke endpoint admin getSessions terpaginasi
      const data = await adminApi.getSessions(page, ITEMS_PER_PAGE);
      // Menyimpan daftar sesi ke state
      setSessions(data.sessions || []);
      // Menyimpan total sesi ke state
      setTotalSessions(data.total || 0);
    } catch (e) {
      // Cetak error ke konsol
      console.error("Failed to fetch sessions", e);
    }
  };

  // Fungsi asinkron untuk mengambil data sesi perangkat IoT terpaginasi dari server
  const fetchIot = async (page = 1) => {
    try {
      // Mengirim request GET ke endpoint admin getIoTSessions terpaginasi
      const data = await adminApi.getIoTSessions(page, ITEMS_PER_PAGE);
      // Menyimpan daftar sesi IoT ke state
      setIot(data.sessions || []);
      // Menyimpan total sesi IoT ke state
      setTotalIot(data.total || 0);
    } catch (e) {
      // Cetak error ke konsol
      console.error("Failed to fetch IoT sessions", e);
    }
  };

  // Efek samping memuat seluruh jenis data secara bersamaan ketika komponen dimuat pertama kali
  useEffect(() => {
    // Fungsi asinkron pembungkus promise gabungan
    const fetchAll = async () => {
      // Aktifkan indikator loading
      setLoading(true);
      // Menunggu penyelesaian seluruh request API secara paralel menggunakan Promise.all
      await Promise.all([
        fetchUsers(userPage),
        fetchSessions(sessionPage),
        fetchIot(iotPage)
      ]);
      // Matikan indikator loading setelah semua data selesai terunduh
      setLoading(false);
    };
    // Jalankan fungsi fetchAll
    fetchAll();
  }, []); // Hanya berjalan saat komponen pertama kali dipasang

  // Efek samping memperbarui data tabel pengguna ketika nomor halaman userPage berubah
  useEffect(() => {
    // Jalankan update jika data awal selesai diload
    if (!loading) fetchUsers(userPage);
  }, [userPage]);

  // Efek samping memperbarui data tabel sesi chat ketika nomor halaman sessionPage berubah
  useEffect(() => {
    // Jalankan update jika data awal selesai diload
    if (!loading) fetchSessions(sessionPage);
  }, [sessionPage]);

  // Efek samping memperbarui data tabel sesi IoT ketika nomor halaman iotPage berubah
  useEffect(() => {
    // Jalankan update jika data awal selesai diload
    if (!loading) fetchIot(iotPage);
  }, [iotPage]);

  // Fungsi logout untuk menghapus kredensial admin dan kembali ke layar login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fungsi asinkron menghapus akun user berdasarkan ID pengguna
  const handleDeleteUser = async (id, name) => {
    // Konfirmasi keamanan sebelum menghapus
    if (window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      try {
        // Panggil endpoint deleteUser API
        await adminApi.deleteUser(id);
        // Refresh daftar data pengguna di halaman aktif saat ini
        fetchUsers(userPage);
      } catch (e) {
        // Tampilkan notifikasi error dari server
        alert(e.response?.data?.detail || 'Failed to delete user');
      }
    }
  };

  // Fungsi asinkron menghapus satu sesi obrolan pengguna
  const handleDeleteSession = async (id) => {
    // Konfirmasi keamanan hapus sesi
    if (window.confirm('Delete this chat session?')) {
      try {
        // Panggil endpoint deleteSession API
        await adminApi.deleteSession(id);
        // Refresh daftar data sesi di halaman aktif
        fetchSessions(sessionPage);
      } catch (e) {
        // Cetak error ke konsol
        console.error('Failed to delete session', e);
      }
    }
  };

  // Fungsi asinkron menghapus rekaman sesi percakapan perangkat IoT
  const handleDeleteIotSession = async (id) => {
    // Konfirmasi keamanan hapus sesi IoT
    if (window.confirm('Delete this IoT session?')) {
      try {
        // Panggil endpoint deleteIoTSession API
        await adminApi.deleteIoTSession(id);
        // Refresh daftar data sesi IoT di halaman aktif
        fetchIot(iotPage);
      } catch (e) {
        // Cetak error ke konsol
        console.error('Failed to delete IoT session', e);
      }
    }
  };

  // Fungsi asinkron penangan submit pada modal form (bisa berupa tambah user atau update user)
  const handleFormSubmit = async (userId, data) => {
    // Jika terdapat userId (sedang dalam operasi ubah/update data)
    if (userId) {
      // Kirim request PATCH pembaruan profil user
      await adminApi.updateUser(userId, data);
    // Jika userId kosong (sedang dalam operasi penambahan user baru)
    } else {
      // Kirim request POST pembuatan user baru
      await adminApi.createUser(data);
    }
    // Refresh daftar user terbaru pada halaman aktif
    fetchUsers(userPage);
  };

  // Membuka modal form dalam kondisi bersih untuk menambahkan pengguna baru
  const openAddUser = () => {
    // Set user terpilih ke null (menandakan mode tambah baru)
    setSelectedUser(null);
    // Buka modal
    setIsModalOpen(true);
  };

  // Membuka modal form terisi untuk mengedit data pengguna tertentu
  const openEditUser = (user) => {
    // Set objek user terpilih ke state selectedUser
    setSelectedUser(user);
    // Buka modal
    setIsModalOpen(true);
  };

  // Tampilkan layar loading berputar jika status pemuatan data masih berjalan
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner lingkaran berputar */}
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Menghitung jumlah total halaman paginasi untuk masing-masing tab kategori data (minimal 1 halaman)
  const userTotalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE) || 1;
  const sessionTotalPages = Math.ceil(totalSessions / ITEMS_PER_PAGE) || 1;
  const iotTotalPages = Math.ceil(totalIot / ITEMS_PER_PAGE) || 1;

  return (
    // Wadah utama halaman dashboard admin dengan latar belakang abu-abu transparan
    <div className="min-h-screen bg-muted/30 p-6 md:p-8">
      {/* Batas lebar konten halaman maksimal */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Atas Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Console</h1>
            <p className="text-sm text-muted-foreground">Manage user accounts, active chat sessions, and IoT activities.</p>
          </div>
          {/* Tombol pintasan kembali ke chat utama dan logout */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => navigate('/chat')}>
              Back to Chat
            </Button>
            <Button variant="destructive" className="flex-1 sm:flex-initial gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Pengendali Tab Utama (Users / Webchats / IoT Sessions) */}
        <div className="flex bg-card p-1.5 rounded-xl border border-border/80 shadow-sm max-w-md">
          {/* Tab Users */}
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Users size={16} />
            <span>Users</span>
          </button>
          {/* Tab Webchats */}
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sessions' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <MessageSquare size={16} />
            <span>Webchats</span>
          </button>
          {/* Tab IoT Sessions */}
          <button
            onClick={() => setActiveTab('iot')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'iot' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Cpu size={16} />
            <span>IoT Sessions</span>
          </button>
          {/* Tab EPUBs */}
          <button
            onClick={() => setActiveTab('epubs')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'epubs' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Book size={16} />
            <span>EPUBs</span>
          </button>
        </div>

        {/* Kotak Kontainer Utama Konten Data Aktif */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          {/* Bagian Header Kartu Konten */}
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-5">
            <div>
              {/* Judul dinamis kartu sesuai tab yang sedang aktif */}
              <CardTitle className="text-xl font-semibold">
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'sessions' && 'Web Chat Sessions'}
                {activeTab === 'iot' && 'IoT Device Sessions'}
                {activeTab === 'epubs' && 'EPUB Documents Management'}
              </CardTitle>
              {/* Jumlah total baris data yang ada */}
              <p className="text-xs text-muted-foreground mt-1">
                {activeTab === 'users' && `Total: ${totalUsers} user accounts`}
                {activeTab === 'sessions' && `Total: ${totalSessions} active web sessions`}
                {activeTab === 'iot' && `Total: ${totalIot} active device sessions`}
                {activeTab === 'epubs' && `Manage knowledge base documents`}
              </p>
            </div>
            {/* Hanya tampilkan tombol "Add User" jika berada di tab Users */}
            {activeTab === 'users' && (
              <Button size="sm" onClick={openAddUser} className="gap-2">
                <Plus size={16} />
                Add User
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            
            {/* TABEL MANAJEMEN PENGGUNA (USERS) */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
                      <th className="p-4 pl-6">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created At</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {/* Tampilkan pesan jika data kosong */}
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-muted-foreground">No users found.</td>
                      </tr>
                    ) : (
                      // Iterasi daftar user
                      users.map(u => (
                        <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 pl-6 font-medium text-foreground">{u.username}</td>
                          <td className="p-4 text-muted-foreground">{u.email}</td>
                          <td className="p-4">
                            {/* Badge penanda hak akses (role) */}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              u.role === 'admin' 
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                                : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {/* Indikator status keaktifan user */}
                            {u.is_active ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                                <CheckCircle size={14} /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-muted-foreground font-medium text-xs">
                                <XCircle size={14} /> Suspended
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                          {/* Tombol aksi manipulasi user */}
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            {/* Tombol Edit User */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => openEditUser(u)}>
                              <Edit2 size={14} />
                            </Button>
                            {/* Tombol Hapus User */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(u.id, u.username)}>
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABEL MANAJEMEN SESI CHAT WEB (WEBCHAT SESSIONS) */}
            {activeTab === 'sessions' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
                      <th className="p-4 pl-6">Session ID</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Message Count</th>
                      <th className="p-4">Updated At</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {/* Tampilkan pesan jika data kosong */}
                    {sessions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">No chat sessions found.</td>
                      </tr>
                    ) : (
                      // Iterasi daftar sesi chat
                      sessions.map(s => (
                        <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">{s.id.slice(0, 8)}...</td>
                          <td className="p-4 font-medium text-foreground">{s.title || 'Untitled Session'}</td>
                          <td className="p-4 text-muted-foreground font-semibold">{s.message_count}</td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(s.updated_at).toLocaleString()}</td>
                          {/* Tombol aksi manipulasi sesi */}
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            {/* Tombol masuk melihat detail pesan sesi */}
                            <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={() => navigate(`/admin/chat/${s.id}`)}>
                              <Eye size={14} />
                              View
                            </Button>
                            {/* Tombol hapus sesi chat */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSession(s.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABEL MANAJEMEN SESI PERANGKAT IOT (IOT SESSIONS) */}
            {activeTab === 'iot' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
                      <th className="p-4 pl-6">Session ID</th>
                      <th className="p-4">Device ID</th>
                      <th className="p-4">Started At</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {/* Tampilkan pesan jika data kosong */}
                    {iot.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">No IoT sessions found.</td>
                      </tr>
                    ) : (
                      // Iterasi daftar sesi IoT
                      iot.map(i => (
                        <tr key={i.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">{i.id.slice(0, 8)}...</td>
                          <td className="p-4 font-medium text-foreground">{i.device_id}</td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(i.started_at).toLocaleString()}</td>
                          <td className="p-4">
                            {/* Badge penunjuk status keaktifan sesi rekaman IoT */}
                            {i.ended_at ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse">
                                Active
                              </span>
                            )}
                          </td>
                          {/* Tombol aksi manipulasi IoT */}
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            {/* Tombol masuk melihat rekaman detail suara & teks IoT */}
                            <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={() => navigate(`/admin/iot/${i.id}`)}>
                              <Eye size={14} />
                              View
                            </Button>
                            {/* Tombol hapus sesi IoT */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteIotSession(i.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABEL MANAJEMEN EPUB (EPUB MANAGEMENT) */}
            {activeTab === 'epubs' && (
              <div className="p-4 sm:p-6 border-b border-border/50">
                <AdminEpubManagement />
              </div>
            )}

            {/* Bagian Bawah Kartu: Pengendali Navigasi Paginasi Halaman Tabel */}
            {activeTab !== 'epubs' && (
            <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-muted/10">
              {/* Teks informasi posisi halaman saat ini */}
              <span className="text-xs text-muted-foreground">
                {activeTab === 'users' && `Showing page ${userPage} of ${userTotalPages}`}
                {activeTab === 'sessions' && `Showing page ${sessionPage} of ${sessionTotalPages}`}
                {activeTab === 'iot' && `Showing page ${iotPage} of ${iotTotalPages}`}
              </span>
              {/* Tombol panah kiri dan kanan sistem paginasi */}
              <div className="flex items-center gap-2">
                {/* Kontrol Paginasi Users */}
                {activeTab === 'users' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setUserPage(p => Math.max(p - 1, 1))} disabled={userPage === 1} className="h-8 w-8 p-0">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setUserPage(p => Math.min(p + 1, userTotalPages))} disabled={userPage === userTotalPages} className="h-8 w-8 p-0">
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                {/* Kontrol Paginasi Sesi Webchat */}
                {activeTab === 'sessions' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setSessionPage(p => Math.max(p - 1, 1))} disabled={sessionPage === 1} className="h-8 w-8 p-0">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSessionPage(p => Math.min(p + 1, sessionTotalPages))} disabled={sessionPage === sessionTotalPages} className="h-8 w-8 p-0">
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                {/* Kontrol Paginasi IoT */}
                {activeTab === 'iot' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIotPage(p => Math.max(p - 1, 1))} disabled={iotPage === 1} className="h-8 w-8 p-0">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIotPage(p => Math.min(p + 1, iotTotalPages))} disabled={iotPage === iotTotalPages} className="h-8 w-8 p-0">
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            )}

          </CardContent>
        </Card>
      </div>

      {/* Modal Popup Aksi Edit/Tambah Pengguna */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />
    </div>
  );
}
