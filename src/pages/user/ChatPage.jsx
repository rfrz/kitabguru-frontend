// Mengimpor React beserta hooks useEffect dan useState
import React, { useEffect, useState } from 'react';
// Mengimpor useParams untuk mengambil parameter dari URL, useNavigate untuk navigasi, dan Link untuk tautan beranda
import { useParams, useNavigate, Link } from 'react-router-dom';
// Mengimpor ikon Menu dan Bot dari lucide-react
import { Menu, Bot } from 'lucide-react';
// Mengimpor hook autentikasi untuk data user
import { useAuth } from '../../contexts/AuthContext';
// Mengimpor hook chat untuk melacak status sesi obrolan yang sedang berjalan
import { useChat } from '../../contexts/ChatContext';
// Mengimpor komponen Sidebar panel kiri
import Sidebar from '../../components/layout/Sidebar';
// Mengimpor komponen Balon Chat (ChatBubble) untuk menampilkan baris pesan
import ChatBubble from '../../components/chat/ChatBubble';
// Mengimpor komponen Input Chat (ChatInput) untuk kolom pengetikan pesan
import ChatInput from '../../components/chat/ChatInput';

/**
 * Halaman ChatPage merupakan halaman utama interaksi obrolan.
 * Memuat panel sidebar riwayat chat, dan area utama penampil balon chat serta form input.
 */
export default function ChatPage() {
  // Mengambil info user yang login dari AuthContext
  const { user } = useAuth();
  // Mengambil data sesi, daftar pesan, loading status, dan status mengirim dari ChatContext
  const { currentSessionId, messages, isLoadingMessages, loadSession, isSending } = useChat();
  // Mengambil parameter ID sesi dari path dinamis URL
  const { sessionId } = useParams();
  // Navigasi router
  const navigate = useNavigate();
  // State pengendali sidebar terbuka/tertutup, diatur default terbuka pada layar desktop (>= 768px)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Efek samping untuk mengatur status sidebar otomatis saat ukuran lebar layar browser berubah
  useEffect(() => {
    // Fungsi penangan perubahan ukuran layar
    const handleResize = () => {
      // Jika lebar layar kurang dari 768px (tampilan mobile/tablet), tutup sidebar
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      // Jika di layar lebar desktop, buka sidebar otomatis
      else setIsSidebarOpen(true);
    };
    // Mendaftarkan event listener pada resize window browser
    window.document.defaultView.addEventListener('resize', handleResize);
    // Membersihkan event listener saat komponen dihancurkan
    return () => window.document.defaultView.removeEventListener('resize', handleResize);
  }, []);

  // Efek samping untuk mensinkronisasi URL dengan state sesi obrolan aktif
  useEffect(() => {
    // Menentukan target ID sesi berdasarkan URL (null jika URL di root /chat)
    const targetSessionId = sessionId || null;
    // Jika ID target sesi berbeda dengan state ID sesi aktif di ChatContext
    if (targetSessionId !== currentSessionId) {
      // Panggil fungsi loadSession untuk mengambil data pesan sesi tersebut
      loadSession(targetSessionId);
    }
  }, [sessionId, currentSessionId, loadSession]); // Berjalan ulang jika URL sessionId atau currentSessionId berubah

  return (
    // Struktur layout flexbox dengan melarang scroll vertikal pada kontainer terluar
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Merender komponen Sidebar samping kiri */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Area utama obrolan di samping kanan sidebar */}
      <main className="flex-1 flex flex-col h-full relative bg-dot-pattern bg-fixed min-w-0 transition-all duration-300">
        {/* Header bar atas obrolan */}
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Tombol menu hamburger untuk toggle sidebar */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            {/* Tautan judul ke beranda */}
            <Link to="/" className="font-semibold text-base tracking-tight text-foreground/90 hover:text-primary transition-colors">
              KitabGuru
            </Link>
          </div>
        </header>

        {/* Area utama percakapan tempat balon chat berjejer */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar relative z-0">
          {/* Skenario 1: Jika tidak ada sesi chat aktif yang sedang dibuka (tampilan selamat datang) */}
          {!currentSessionId ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground animate-in fade-in duration-500 zoom-in-95">
              {/* Logo inisial KitabGuru melingkar */}
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                 <span className="text-primary/40 text-4xl font-bold">KG</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">Welcome to KitabGuru</h2>
              <p className="text-sm max-w-sm text-center opacity-80">
                Select an existing session from the sidebar or start a new chat to begin exploring.
              </p>
            </div>
          // Skenario 2: Jika sedang mengunduh data pesan dari backend
          ) : isLoadingMessages ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {/* Animator pulsa pemuatan */}
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          // Skenario 3: Jika sesi aktif tetapi daftar pesan masih kosong
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground animate-in fade-in duration-500">
               <div className="text-center">
                 <p className="text-sm opacity-80">This is the beginning of your chat.</p>
               </div>
            </div>
          // Skenario 4: Menampilkan daftar pesan percakapan
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              {/* Melakukan iterasi (mapping) data pesan untuk dirender ke komponen ChatBubble */}
              {messages.map((msg, idx) => (
                <ChatBubble key={msg.id} message={msg} isLast={idx === messages.length - 1 && !isSending} />
              ))}
              {/* Menampilkan balon mengetik (typing indicator) asisten AI secara kondisional jika status isSending bernilai true */}
              {isSending && (
                <div className="flex gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Avatar asisten AI */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-background z-10 bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Bot size={16} />
                  </div>
                  {/* Animasi balon melompat-lompat penanda asisten AI sedang menulis jawaban */}
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm relative bg-card text-card-foreground rounded-tl-sm border border-border/50 flex items-center">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wadah input chat di bagian paling bawah halaman dengan efek gradasi transparan agar melayang */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            {/* Memuat komponen kolom input pengetikan pesan */}
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
}
