// Mengimpor React dan hook useState untuk manajemen state komponen
import React, { useState } from 'react';
// Mengimpor ikon-ikon yang dibutuhkan dari pustaka lucide-react
import { Image as ImageIcon, Video, Loader2, Sparkles } from 'lucide-react';
// Mengimpor komponen tombol kustom (Button) dari folder ui
import { Button } from '../ui/button';
// Mengimpor modul API media untuk melakukan request pembuatan gambar/video
import { mediaApi } from '../../api/media';
// Mengimpor hook kustom useChat untuk mengakses status obrolan saat ini
import { useChat } from '../../contexts/ChatContext';

/**
 * Komponen MediaButtons menyediakan tombol interaktif untuk memicu pembuatan media
 * (gambar atau video) berdasarkan pesan tertentu di dalam sesi chat.
 *
 * @param {string} messageId - ID dari pesan yang ingin dibuatkan medianya
 * @param {string} sessionId - ID dari sesi percakapan aktif
 */
export default function MediaButtons({ messageId, sessionId }) {
  // Mengambil ID sesi saat ini dan fungsi memuat ulang sesi dari konteks chat
  const { currentSessionId, loadSession } = useChat();
  // State untuk menandai apakah sistem sedang memproses pembuatan gambar
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  // State untuk menandai apakah sistem sedang memproses pembuatan video
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);
  // State untuk melacak persentase kemajuan (progress) proses pembuatan video
  const [videoProgress, setVideoProgress] = useState(null);

  // Menentukan ID sesi aktif dengan memprioritaskan parameter sessionId lalu currentSessionId
  const activeSessionId = sessionId || currentSessionId;
  // Ref untuk menyimpan interval pemantauan status (polling) agar tidak memicu re-render
  const pollingIntervalRef = React.useRef(null);

  // Efek samping untuk membersihkan (cleanup) interval polling saat komponen dilepas (unmounted)
  React.useEffect(() => {
    // Fungsi pembersih yang dijalankan saat komponen dihancurkan
    return () => {
      // Jika interval polling masih aktif berjalan
      if (pollingIntervalRef.current) {
        // Hentikan proses interval polling tersebut
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []); // Array dependensi kosong agar efek ini hanya berjalan saat load pertama dan unmount

  // Fungsi asinkron untuk menangani klik tombol pembuatan gambar
  const handleGenerateImage = async () => {
    // Mengubah state pembuatan gambar menjadi true (menampilkan status loading)
    setIsGeneratingImg(true);
    try {
      // Melakukan request ke server untuk menghasilkan gambar baru berdasarkan sesi dan pesan
      await mediaApi.generateImage(activeSessionId, messageId);
      // Memuat ulang sesi chat agar gambar yang berhasil dibuat langsung tampil di layar
      await loadSession(activeSessionId);
    } catch (error) {
      // Mencetak kesalahan ke konsol browser jika terjadi error
      console.error(error);
      // Menampilkan dialog peringatan bahwa pembuatan gambar gagal dilakukan
      alert('Failed to generate image');
    } finally {
      // Mengembalikan state pembuatan gambar menjadi false (menghilangkan status loading)
      setIsGeneratingImg(false);
    }
  };

  // Fungsi untuk memantau status pengerjaan (job) pembuatan video secara berkala (polling)
  const pollVideoJob = (jobId) => {
    // Periksa jika sudah ada proses polling yang berjalan sebelumnya
    if (pollingIntervalRef.current) {
      // Hentikan proses polling lama tersebut agar tidak tumpang tindih
      clearInterval(pollingIntervalRef.current);
    }

    // Set interval baru untuk memeriksa status tugas pembuatan video setiap 3 detik
    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Meminta data status terbaru dari pekerjaan pembuatan video ke backend
        const statusRes = await mediaApi.getJobStatus(jobId);
        // Mendestruktur status pekerjaan dan persentase kemajuan dari respons
        const { status: jobStatus, progress_pct } = statusRes;

        // Jika status pekerjaan telah selesai dengan sukses
        if (jobStatus === 'completed') {
          // Hentikan interval pemantauan status
          clearInterval(pollingIntervalRef.current);
          // Set referensi interval kembali ke null
          pollingIntervalRef.current = null;
          // Matikan indikator proses pembuatan video
          setIsGeneratingVid(false);
          // Reset data progres video menjadi kosong kembali
          setVideoProgress(null);
          // Muat ulang data sesi chat agar video baru terintegrasi ke dalam layar percakapan
          await loadSession(activeSessionId);
        // Jika status pekerjaan berakhir dengan kegagalan
        } else if (jobStatus === 'failed') {
          // Hentikan interval pemantauan status
          clearInterval(pollingIntervalRef.current);
          // Set referensi interval kembali ke null
          pollingIntervalRef.current = null;
          // Matikan indikator proses pembuatan video
          setIsGeneratingVid(false);
          // Reset data progres video menjadi kosong kembali
          setVideoProgress(null);
          // Tampilkan pesan error kepada pengguna
          alert('Video generation failed');
        // Jika status pekerjaan masih dalam antrean atau sedang diproses
        } else {
          // Perbarui persentase kemajuan video dengan nilai terbaru (default 0 jika null)
          setVideoProgress(progress_pct || 0);
        }
      } catch (error) {
        // Cetak kesalahan pemantauan status ke konsol jika request gagal
        console.error('Error polling video job:', error);
      }
    }, 3000); // Durasi pemantauan diatur setiap 3000 milidetik (3 detik)
  };

  // Fungsi asinkron untuk memicu pembuatan video
  const handleGenerateVideo = async () => {
    // Aktifkan indikator pembuatan video
    setIsGeneratingVid(true);
    // Inisialisasi persentase kemajuan di angka 0
    setVideoProgress(0);
    try {
      // Kirim request pembuatan video ke backend
      const res = await mediaApi.generateVideo(activeSessionId, messageId);
      // Jika respons valid dan mengembalikan ID pekerjaan (job_id)
      if (res && res.job_id) {
        // Mulai memantau kemajuan pekerjaan video tersebut menggunakan fungsinya
        pollVideoJob(res.job_id);
      } else {
        // Lempar error jika backend tidak mengirimkan ID pekerjaan yang valid
        throw new Error('No job ID returned');
      }
    } catch (error) {
      // Cetak error ke konsol
      console.error(error);
      // Tampilkan notifikasi kegagalan
      alert('Failed to generate video');
      // Matikan indikator pembuatan video karena gagal
      setIsGeneratingVid(false);
      // Reset persentase kemajuan video ke null
      setVideoProgress(null);
    }
  };

  return (
    // Wadah tombol-tombol media dengan tataletak baris yang melipat otomatis (wrap) jika sempit
    <div className="flex flex-wrap gap-2.5">
      {/* Tombol pemicu pembuatan gambar */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleGenerateImage}
        // Tombol dinonaktifkan jika sedang memproses gambar, tidak ada sesi aktif, atau tidak ada ID pesan
        disabled={isGeneratingImg || !activeSessionId || !messageId}
        className="gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all rounded-full h-8 px-4 text-xs font-medium shadow-sm hover:shadow"
      >
        {/* Tampilkan ikon loading berputar jika sedang memproses, atau ikon berkilau Sparkles */}
        {isGeneratingImg ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Sparkles size={14} className="text-amber-500" />
        )}
        {/* Mengubah teks tombol secara dinamis berdasarkan status pemrosesan gambar */}
        {isGeneratingImg ? 'Generating...' : 'Generate Image'}
      </Button>
      
      {/* Tombol pemicu pembuatan video */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleGenerateVideo}
        // Tombol dinonaktifkan jika sedang memproses video, tidak ada sesi aktif, atau tidak ada ID pesan
        disabled={isGeneratingVid || !activeSessionId || !messageId}
        className="gap-2 text-emerald-600 border-emerald-600/20 bg-emerald-500/5 hover:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:hover:bg-emerald-400/10 transition-all rounded-full h-8 px-4 text-xs font-medium shadow-sm hover:shadow"
      >
        {/* Tampilkan ikon loading berputar jika sedang memproses, atau ikon kamera Video biasa */}
        {isGeneratingVid ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Video size={14} />
        )}
        {/* Menampilkan teks pemrosesan beserta persentase progres, atau teks tombol standar */}
        {isGeneratingVid ? `Generating... ${videoProgress ?? 0}%` : 'Generate Video'}
      </Button>
    </div>
  );
}
