// Mengimpor React dan hook useState untuk melacak status pengeditan judul sesi
import React, { useState } from 'react';
// Mengimpor hook useChat untuk berinteraksi dengan API sesi chat (baca, tambah, ubah, hapus)
import { useChat } from '../../contexts/ChatContext';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../ui/button';
// Mengimpor ikon-ikon menu dari lucide-react untuk dekorasi visual
import { PlusCircle, Trash2, LogOut, Settings, Edit2, Check, X } from 'lucide-react';
// Mengimpor hook autentikasi untuk melacak info user login dan memicu logout
import { useAuth } from '../../contexts/AuthContext';
// Mengimpor useNavigate untuk mengarahkan pengguna ke halaman lain
import { useNavigate } from 'react-router-dom';

/**
 * Komponen Sidebar merupakan panel samping navigasi utama aplikasi.
 * Berisi daftar riwayat obrolan (sesi), tombol pembuatan chat baru, serta menu user/admin.
 *
 * @param {boolean} isOpen - Status apakah sidebar terbuka di layar
 * @param {function} onClose - Fungsi callback saat sidebar ditutup (pada tampilan mobile)
 */
export default function Sidebar({ isOpen = true, onClose }) {
  // Mengambil state dan fungsi penanganan sesi dari konteks chat
  const { sessions, currentSessionId, loadSession, createSession, deleteSession, renameSession, isLoadingSessions } = useChat();
  // Mengambil fungsi logout dan data user dari konteks autentikasi
  const { logout, user } = useAuth();
  // Membuka navigasi rute
  const navigate = useNavigate();

  // State untuk menyimpan ID sesi yang sedang dalam mode ubah judul
  const [editingId, setEditingId] = useState(null);
  // State penampung sementara teks judul sesi yang sedang diketik saat diubah
  const [editTitle, setEditTitle] = useState('');

  // Fungsi mengaktifkan mode pengeditan judul sesi chat
  const startEditing = (e, session) => {
    // Mencegah klik menyebar ke elemen induk (agar tidak memicu navigasi masuk ke chat)
    e.stopPropagation();
    // Set ID sesi yang diedit
    setEditingId(session.id);
    // Set nilai awal input edit teks dengan judul sesi saat ini
    setEditTitle(session.title || 'Untitled Chat');
  };

  // Fungsi membatalkan pengeditan judul sesi chat
  const cancelEditing = (e) => {
    // Mencegah klik menyebar ke elemen induk
    e.stopPropagation();
    // Kosongkan ID sesi yang diedit kembali ke null
    setEditingId(null);
    // Bersihkan teks input penampung
    setEditTitle('');
  };

  // Fungsi asinkron untuk menyimpan perubahan judul sesi ke server
  const saveEditing = async (e, sessionId) => {
    // Mencegah klik menyebar ke elemen induk
    e.stopPropagation();
    // Validasi: Pastikan teks baru tidak kosong, dan judul baru berbeda dengan judul lama
    if (editTitle.trim() && editTitle.trim() !== sessions.find(s => s.id === sessionId)?.title) {
      // Memanggil fungsi renameSession dari konteks chat
      await renameSession(sessionId, editTitle.trim());
    }
    // Keluar dari mode edit dengan mereset ID sesi ke null
    setEditingId(null);
  };

  // Fungsi untuk mengarahkan pengguna ke halaman pembuatan chat baru (/chat)
  const handleNewChat = () => {
    navigate('/chat');
  };

  // Fungsi untuk memproses keluar dari aplikasi
  const handleLogout = () => {
    // Jalankan fungsi logout untuk menghapus token
    logout();
    // Alihkan halaman ke form masuk (login)
    navigate('/login');
  };

  return (
    // Tag utama layout sidebar dengan transisi animasi geser masuk/keluar
    <aside 
      className={`w-64 border-r border-border bg-background/95 backdrop-blur-md flex flex-col h-full shrink-0 shadow-sm z-20 transition-all duration-300 ${
        isOpen ? 'ml-0' : '-ml-64'
      }`}
    >
      {/* Bagian atas sidebar berisi tombol obrolan baru (New Chat) */}
      <div className="p-4 border-b border-border">
        <Button 
          onClick={handleNewChat} 
          className="w-full flex items-center justify-center gap-2 rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
        >
          {/* Ikon lingkaran tambah */}
          <PlusCircle size={18} />
          {/* Label tombol */}
          <span className="font-medium">New Chat</span>
        </Button>
      </div>

      {/* Bagian tengah sidebar berisi daftar gulir riwayat sesi chat */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {/* Tampilkan indikator loading berdenyut jika sedang mengambil daftar sesi dari server */}
        {isLoadingSessions ? (
          <div className="text-center text-xs text-muted-foreground py-4 animate-pulse">Loading sessions...</div>
        // Tampilkan teks jika daftar sesi kosong
        ) : sessions.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-4">No recent chats</div>
        // Jika terdapat daftar sesi, lakukan iterasi (mapping) data sesi chat
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              // Tampilan latar belakang aktif (selected) atau tidak
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                currentSessionId === session.id 
                  ? 'bg-secondary text-secondary-foreground shadow-sm font-medium' 
                  : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
              // Alihkan navigasi chat ke ID sesi terpilih saat diklik (kecuali sedang mode edit judul)
              onClick={() => {
                if (editingId !== session.id) navigate(`/chat/${session.id}`);
              }}
            >
              {/* Jika sesi ini sedang diedit, tampilkan elemen input teks ubah judul */}
              {editingId === session.id ? (
                <div className="flex items-center gap-1.5 w-full animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                  {/* Kolom pengetikan judul baru */}
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    // Tekan enter untuk menyimpan, escape untuk membatalkan
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing(e, session.id);
                      if (e.key === 'Escape') cancelEditing(e);
                    }}
                    className="flex-1 min-w-0 bg-background text-foreground text-sm px-2 py-1 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm transition-all"
                  />
                  {/* Tombol aksi simpan dan batal di samping kolom input */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Tombol Check untuk menyimpan */}
                    <button onClick={(e) => saveEditing(e, session.id)} className="text-emerald-500 hover:text-emerald-600 p-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-md transition-colors" title="Save"><Check size={14} /></button>
                    {/* Tombol X untuk membatalkan */}
                    <button onClick={cancelEditing} className="text-rose-500 hover:text-rose-600 p-1 bg-rose-50 dark:bg-rose-950/30 rounded-md transition-colors" title="Cancel"><X size={14} /></button>
                  </div>
                </div>
              ) : (
                // Tampilan reguler baris sesi (jika tidak sedang diedit)
                <>
                  {/* Nama/Judul sesi chat dengan efek potong teks jika terlalu panjang (truncate) */}
                  <div className="flex items-center truncate">
                    <span className="truncate text-[13px]">{session.title || 'Untitled Chat'}</span>
                  </div>
                  {/* Tombol manipulasi sesi (ubah & hapus) yang muncul saat baris disorot (hover) */}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                    {/* Tombol Edit */}
                    <button 
                      onClick={(e) => startEditing(e, session)}
                      className="text-muted-foreground hover:text-primary p-1 rounded-md hover:bg-background/80 transition-colors"
                      title="Rename chat"
                    >
                      <Edit2 size={13} />
                    </button>
                    {/* Tombol Hapus */}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        deleteSession(session.id); 
                        // Jika sesi yang dihapus adalah sesi aktif saat ini, alihkan navigasi kembali ke /chat
                        if (currentSessionId === session.id) {
                          navigate('/chat');
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-background/80 transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bagian bawah sidebar berisi menu profil user, admin dashboard, dan tombol keluar (Logout) */}
      <div className="p-3 border-t border-border space-y-1 bg-background/50 backdrop-blur-sm">
        {/* Tombol navigasi menuju halaman profil user */}
        <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate('/profile')}>
          {/* Avatar inisial huruf depan dari nama username */}
          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold uppercase">
            {user?.username?.[0] || 'U'}
          </div>
          {/* Label nama username */}
          <span className="text-sm font-medium truncate">{user?.username || 'Profile'}</span>
        </Button>
        {/* Tombol khusus dashboard admin (hanya tampil jika status user merupakan admin) */}
        {user?.role === 'admin' && (
          <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate('/admin')}>
            {/* Ikon pengaturan */}
            <Settings size={16} />
            <span className="text-sm font-medium">Admin Dashboard</span>
          </Button>
        )}
        {/* Tombol Logout */}
        <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors" onClick={handleLogout}>
          {/* Ikon keluar */}
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
