// Mengimpor React beserta hooks useState dan useEffect
import React, { useState, useEffect } from 'react';
// Mengimpor useParams untuk mengambil parameter dari URL, dan useNavigate untuk berpindah rute halaman
import { useParams, useNavigate } from 'react-router-dom';
// Mengimpor API Admin untuk memuat sesi percakapan dari database
import { adminApi } from '../../api/admin';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../../components/ui/button';
// Mengimpor ikon-ikon menu dari lucide-react untuk fungsionalitas audio player dan petunjuk status
import { ArrowLeft, ShieldAlert, Play, Pause, Volume2, User, Bot } from 'lucide-react';
// Mengimpor fungsi pembantu penggabung kelas CSS kustom (cn)
import { cn } from '../../utils/utils';

/**
 * Halaman AdminIoTView memungkinkan administrator untuk memantau riwayat obrolan suara
 * yang dilakukan melalui perangkat keras IoT KitabGuru serta memutar ulang berkas audionya.
 */
export default function AdminIoTView() {
  // Mengambil ID sesi IoT dari parameter URL
  const { id } = useParams();
  // Navigasi router
  const navigate = useNavigate();
  // State untuk menyimpan konfigurasi meta detail sesi IoT
  const [session, setSession] = useState(null);
  // State bertipe array untuk menyimpan daftar pesan suara/teks dalam sesi tersebut
  const [messages, setMessages] = useState([]);
  // State indikator memuat data dari server
  const [loading, setLoading] = useState(true);
  // State untuk menampung pesan kesalahan jika request API gagal
  const [error, setError] = useState('');
  // State untuk melacak ID pesan yang audionya sedang aktif diputar (null jika berhenti)
  const [playingId, setPlayingId] = useState(null);
  // State bertipe objek penampung referensi instance Audio HTML5 (_audioElements) berdasarkan ID pesan
  const [audioElements, setAudioElements] = useState({});

  // Efek samping untuk mengambil detail rekaman sesi IoT begitu halaman diakses
  useEffect(() => {
    // Fungsi asinkron penarik data sesi IoT dari server
    const fetchSession = async () => {
      try {
        // Meminta detail sesi IoT ke API admin
        const data = await adminApi.getIoTSession(id);
        // Menyimpan metadata sesi ke state
        setSession(data);
        // Menyimpan array riwayat pesan ke state messages
        setMessages(data.messages || []);
      } catch (err) {
        // Cetak error ke konsol
        console.error(err);
        // Set pesan kesalahan ke state error
        setError('Failed to load IoT session details.');
      } finally {
        // Matikan status loading memuat
        setLoading(false);
      }
    };
    // Jalankan fungsi fetchSession
    fetchSession();
  }, [id]); // Dependensi parameter id menjamin pemanggilan ulang jika id di URL berganti

  // Efek samping pembersihan (cleanup) untuk menghentikan audio apa saja yang sedang diputar ketika admin keluar dari halaman
  useEffect(() => {
    return () => {
      // Melakukan perulangan pada setiap instans objek Audio yang pernah dibuat
      Object.values(audioElements).forEach(audio => {
        // Jeda (pause) audio agar tidak bocor suaranya di latar belakang halaman lain
        audio.pause();
      });
    };
  }, [audioElements]); // Berjalan ulang jika referensi daftar instans audio berubah

  // Fungsi pembantu untuk memformat path file audio mentah menjadi URL lengkap backend
  const getMediaUrl = (path) => {
    // Abaikan jika path kosong
    if (!path) return '';
    // Jika path sudah berupa URL internet absolut (mulai http:// atau https://)
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // Membaca URL dasar server backend dari env variable, default ke port 8001
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
    try {
      // Membuat objek URL baru dari string alamat dasar API
      const url = new URL(apiBase);
      // Memastikan awal string path diawali garis miring
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      // Jika path sudah memuat subdirektori '/media'
      if (cleanPath.startsWith('/media')) {
        // Kembalikan URL gabungan origin domain + path media
        return `${url.origin}${cleanPath}`;
      }
      // Jika tidak, tambahkan prefix '/media' di depan path
      return `${url.origin}/media${cleanPath}`;
    } catch (e) {
      // Jika pembuatan objek URL gagal, kembalikan path mentah apa adanya
      return path;
    }
  };

  // Fungsi penanganan kontrol putar/jeda (play/pause) rekaman suara pesan
  const handlePlayPause = (msgId, path) => {
    // Mendapatkan URL absolut media audio
    const audioUrl = getMediaUrl(path);
    // Batalkan jika URL kosong
    if (!audioUrl) return;

    // Jika audio yang diklik memang sedang diputar saat ini
    if (playingId === msgId) {
      // Jeda pemutaran audio pada instans objek terkait
      audioElements[msgId].pause();
      // Set status ID putar kembali ke null
      setPlayingId(null);
    } else {
      // Jika ada audio lain yang sedang berputar sebelumnya
      if (playingId && audioElements[playingId]) {
        // Jeda paksa audio lama tersebut
        audioElements[playingId].pause();
      }

      // Ambil instans objek audio untuk pesan ini dari state
      let audio = audioElements[msgId];
      // Jika objek audio belum pernah dibuat sebelumnya
      if (!audio) {
        // Instansiasi objek Audio HTML5 baru dengan mengarahkan ke berkas audio
        audio = new Audio(audioUrl);
        // Daftarkan event listener saat audio selesai diputar
        audio.onended = () => {
          // Kembalikan state ID pemutaran aktif ke null
          setPlayingId(null);
        };
        // Masukkan instans audio baru tersebut ke dalam daftar penyimpanan state audioElements
        setAudioElements(prev => ({ ...prev, [msgId]: audio }));
      }

      // Jalankan fungsi putar audio asinkron dari API HTML5
      audio.play().catch(e => console.error("Audio play failed:", e));
      // Set ID pesan ini sebagai audio aktif yang sedang diputar
      setPlayingId(msgId);
    }
  };

  return (
    // Struktur layout utama
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Area utama konten layout */}
      <main className="flex-1 flex flex-col h-full relative bg-dot-pattern bg-fixed">
        {/* Header bar atas */}
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
            {/* Judul identitas ID perangkat IoT yang dipantau */}
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm tracking-tight text-foreground/90">
                IoT Session: {session?.device_id || 'Viewing IoT Session'}
              </h1>
              {/* Keterangan ID sesi */}
              <span className="text-[10px] text-muted-foreground">
                Session ID: {id}
              </span>
            </div>
          </div>
          {/* Badge peringatan Read-Only untuk admin */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <ShieldAlert size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Read Only View</span>
          </div>
        </header>

        {/* Bagian gulir daftar pesan transkrip suara */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar relative z-0">
          {/* Tampilkan indikator loading jika status loading aktif */}
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
          // Tampilkan pesan jika sesi tidak memiliki pesan
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p className="text-sm opacity-80">This session has no messages.</p>
            </div>
          // Render riwayat transkrip chat IoT
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              {messages.map((msg) => {
                // Menentukan apakah peran pesan dikirim oleh user (perangkat)
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={cn(
                    "flex gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300", 
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}>
                    {/* Avatar indikator pengirim */}
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-background z-10",
                      isUser ? "bg-primary" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    )}>
                      {isUser ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    {/* Balon kontainer transkrip teks */}
                    <div className={cn(
                      "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm relative group",
                      isUser 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-card text-card-foreground rounded-tl-sm border border-border/50"
                    )}>
                      <div className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed">
                        {msg.content}
                      </div>

                      {/* Render player kontrol audio jika properti path audio tersedia */}
                      {msg.audio_path && (
                        <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center gap-3">
                          {/* Tombol Play/Pause audio */}
                          <button
                            onClick={() => handlePlayPause(msg.id, msg.audio_path)}
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm",
                              playingId === msg.id 
                                ? "bg-red-500 hover:bg-red-600 text-white" 
                                : "bg-primary/10 hover:bg-primary/20 text-primary"
                            )}
                          >
                            {/* Ubah ikon secara dinamis jika audio sedang diputar */}
                            {playingId === msg.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                          </button>
                          <div className="flex-1 flex flex-col">
                            {/* Keterangan label audio */}
                            <span className="text-[11px] font-medium opacity-80 flex items-center gap-1">
                              <Volume2 size={12} />
                              Voice Recording
                            </span>
                            {/* Nama berkas audio */}
                            <span className="text-[9px] opacity-60 truncate">
                              {msg.audio_path.split('/').pop()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Banner peringatan kaki tentang status baca admin */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto flex justify-center">
            <div className="px-4 py-3 bg-muted border border-border rounded-full shadow-sm text-xs text-muted-foreground flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>You are viewing this IoT chat history in read-only administrator mode. Responses cannot be sent.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
