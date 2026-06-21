// Mengimpor React beserta hooks useState, useRef, dan useEffect
import React, { useState, useRef, useEffect } from 'react';
// Mengimpor ikon Send dan Loader2 dari lucide-react
import { Send, Loader2 } from 'lucide-react';
// Mengimpor useNavigate untuk mengalihkan halaman router setelah pengiriman pesan
import { useNavigate } from 'react-router-dom';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../ui/button';
// Mengimpor hook useChat untuk mengakses fungsi pengiriman pesan dan status chat
import { useChat } from '../../contexts/ChatContext';

// Komponen Input Percakapan (ChatInput) di bagian bawah halaman chat
export default function ChatInput() {
  // State untuk menyimpan teks pesan yang sedang diketik
  const [content, setContent] = useState('');
  // Mengambil fungsi kirim pesan, status mengirim, dan ID sesi saat ini dari konteks Chat
  const { sendMessage, isSending, currentSessionId } = useChat();
  // Ref untuk mengakses DOM textarea secara langsung guna menyesuaikan tingginya otomatis
  const textareaRef = useRef(null);
  // Navigasi router react
  const navigate = useNavigate();

  // Efek samping untuk menyesuaikan tinggi (auto-resize) textarea berdasarkan panjang teks inputan
  useEffect(() => {
    // Jika ref textarea tersedia
    if (textareaRef.current) {
      // Atur ulang tinggi ke default agar scrollHeight terbaca akurat
      textareaRef.current.style.height = 'inherit';
      // Membaca tinggi scroll konten teks dalam piksel
      const scrollHeight = textareaRef.current.scrollHeight;
      // Menyetel tinggi textarea maksimal 150px agar tidak terlalu memakan tempat
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [content]);

  // Fungsi penanganan saat form chat disubmit (kirim pesan)
  const handleSubmit = async (e) => {
    // Mencegah muat ulang halaman browser
    e.preventDefault();
    // Abaikan jika teks input kosong atau proses pengiriman sedang berjalan
    if (!content.trim() || isSending) return;

    // Menyimpan teks pesan ke variabel sementara
    const message = content;
    // Mengosongkan kolom input teks
    setContent('');
    // Atur ulang tinggi textarea ke ukuran default
    if (textareaRef.current) textareaRef.current.style.height = 'inherit';
    
    try {
      // Memanggil fungsi sendMessage asinkron dari ChatContext
      await sendMessage(
        message, 
        null, // bookFilter diset null karena belum didukung antarmuka UI saat ini
        // Callback setelah pesan berhasil dikirim
        (newId) => {
          // Jika backend membuatkan ID sesi baru (sesi chat pertama kali), alihkan navigasi URL ke sesi tersebut
          if (newId && newId !== currentSessionId) {
            navigate(`/chat/${newId}`);
          }
        }
      );
    // Menangkap kegagalan pengiriman pesan
    } catch (error) {
      // Pulihkan kembali isi teks pesan ke kolom input agar user tidak kehilangan teks ketikannya
      setContent(message);
    }
  };

  // Fungsi menangkap event ketukan tombol keyboard di area textarea
  const handleKeyDown = (e) => {
    // Jika menekan tombol 'Enter' tanpa dibarengi tombol 'Shift'
    if (e.key === 'Enter' && !e.shiftKey) {
      // Batalkan baris baru (default enter)
      e.preventDefault();
      // Jalankan fungsi submit pengiriman pesan
      handleSubmit(e);
    }
  };

  return (
    // Kontainer pembungkus input chat dengan efek bayangan gradasi warna (glow effect) saat disorot
    <div className="relative group">
      {/* Background glow shadow transparan */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      {/* Form utama input chat */}
      <form 
        onSubmit={handleSubmit}
        // Desain melengkung, background transparan kaca, dan fokus garis luar
        className="relative flex items-end bg-background/80 backdrop-blur-xl rounded-2xl border border-border/60 shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2"
      >
        {/* Kolom pengetikan teks multiline */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan sesuatu..."
          className="w-full bg-transparent px-3 py-2.5 outline-none resize-none max-h-[150px] min-h-[44px] text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 custom-scrollbar"
          rows={1}
          disabled={isSending}
        />
        {/* Tombol kirim/loading di bagian kanan */}
        <div className="flex-shrink-0 mb-0.5 ml-2">
          <Button 
            type="submit" 
            size="icon"
            className="h-10 w-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
            // Nonaktifkan tombol jika teks kosong atau sedang mengirim
            disabled={!content.trim() || isSending}
          >
            {/* Tampilkan ikon loading berputar jika status isSending aktif, sebaliknya tampilkan ikon kirim Send */}
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
