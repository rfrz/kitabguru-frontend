// Mengimpor React beserta hooks useState dan useEffect
import React, { useState, useEffect } from 'react';
// Mengimpor useParams untuk membaca ID parameter dinamis dari URL, dan useNavigate untuk perpindahan rute
import { useParams, useNavigate } from 'react-router-dom';
// Mengimpor integrasi API Admin (adminApi) untuk request detail sesi pengguna
import { adminApi } from '../../api/admin';
// Mengimpor komponen Balon Chat (ChatBubble) untuk menampilkan pesan
import ChatBubble from '../../components/chat/ChatBubble';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../../components/ui/button';
// Mengimpor ikon panah kiri dan perisai peringatan dari lucide-react
import { ArrowLeft, ShieldAlert } from 'lucide-react';

/**
 * Halaman AdminChatView memungkinkan administrator memeriksa riwayat detail percakapan
 * dari pengguna tertentu secara aman dalam mode hanya-baca (read-only).
 */
export default function AdminChatView() {
  // Mengambil parameter ID sesi dari path rute URL (misal: /admin/chat/:id)
  const { id } = useParams();
  // Navigasi router
  const navigate = useNavigate();
  // State untuk menyimpan konfigurasi meta detail sesi yang sedang dilihat
  const [session, setSession] = useState(null);
  // State bertipe array untuk menyimpan daftar pesan percakapan dalam sesi tersebut
  const [messages, setMessages] = useState([]);
  // State indikator memuat data dari server
  const [loading, setLoading] = useState(true);
  // State untuk menampung pesan kesalahan jika request API gagal
  const [error, setError] = useState('');

  // Efek samping untuk mengunduh detail sesi chat begitu halaman diakses/parameter ID berubah
  useEffect(() => {
    // Fungsi asinkron penarik data sesi dari server khusus admin
    const fetchSession = async () => {
      try {
        // Melakukan pemanggilan endpoint admin getSession berdasarkan ID sesi
        const data = await adminApi.getSession(id);
        // Menyimpan metadata sesi ke state
        setSession(data.session);
        // Menyimpan array riwayat pesan ke state messages
        setMessages(data.messages || []);
      } catch (err) {
        // Cetak kesalahan ke konsol
        console.error(err);
        // Set pesan kesalahan ke state error
        setError('Failed to load chat session details.');
      } finally {
        // Matikan status loading memuat
        setLoading(false);
      }
    };
    // Jalankan fungsi fetchSession
    fetchSession();
  }, [id]); // Dependensi parameter id menjamin pemanggilan ulang jika id di URL berganti

  return (
    // Struktur layout layar penuh dengan scrolling terisolasi
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Area utama konten layout */}
      <main className="flex-1 flex flex-col h-full relative bg-dot-pattern bg-fixed">
        {/* Bagian Header bar atas */}
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Tombol kembali ke dashboard admin */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
              <span>Back to Admin</span>
            </Button>
            {/* Garis pembatas vertikal */}
            <div className="h-4 w-[1px] bg-border/50" />
            {/* Informasi judul sesi obrolan yang sedang dibaca */}
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm tracking-tight text-foreground/90">
                {session?.title || 'Viewing Chat Session'}
              </h1>
              {/* Keterangan ID sesi */}
              <span className="text-[10px] text-muted-foreground">
                Session ID: {id}
              </span>
            </div>
          </div>
          {/* Badge peringatan status Read-Only untuk admin */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <ShieldAlert size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Read Only View</span>
          </div>
        </header>

        {/* Bagian gulir daftar pesan percakapan */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar relative z-0">
          {/* Tampilkan indikator loading berupa tiga titik berdenyut bergantian jika status loading aktif */}
          {loading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          // Tampilkan pesan kesalahan jika state error terisi
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center text-destructive p-4">
              <p className="font-medium text-center">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/admin')}>
                Back to Dashboard
              </Button>
            </div>
          // Tampilkan pesan jika sesi tidak memiliki rekaman percakapan
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p className="text-sm opacity-80">This session has no messages.</p>
            </div>
          // Render riwayat balon chat
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              {messages.map((msg, idx) => (
                <ChatBubble 
                  key={msg.id} 
                  message={msg} 
                  isLast={idx === messages.length - 1} 
                  // Meneruskan properti readOnly true agar admin tidak bisa generate media baru
                  readOnly={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Banner keterangan kaki permanen menegaskan status baca admin */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto flex justify-center">
            <div className="px-4 py-3 bg-muted border border-border rounded-full shadow-sm text-xs text-muted-foreground flex items-center gap-2">
              {/* Ikon perisai kuning */}
              <ShieldAlert size={14} className="text-amber-500" />
              <span>You are viewing this chat in read-only administrator mode. Responses cannot be sent.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
