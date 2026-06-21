// Mengimpor React beserta hooks inti (createContext, useContext, useState, useEffect, useCallback)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Mengimpor API chat (chatApi) untuk pemrosesan obrolan
import { chatApi } from '../api/chat';

// Membuat objek Konteks Chat (ChatContext) global dengan nilai default null
const ChatContext = createContext(null);

/**
 * Penyedia Konteks Obrolan (ChatProvider) mengelola riwayat obrolan, status pengiriman pesan,
 * pembuatan sesi baru, penghapusan sesi, dan manipulasi data percakapan.
 */
export const ChatProvider = ({ children }) => {
  // State untuk menampung seluruh daftar sesi obrolan yang dimiliki user
  const [sessions, setSessions] = useState([]);
  // State untuk menyimpan ID sesi chat yang sedang dibuka saat ini
  const [currentSessionId, setCurrentSessionId] = useState(null);
  // State untuk menampung riwayat pesan (messages) di dalam sesi aktif
  const [messages, setMessages] = useState([]);
  // State indikator loading saat mendownload daftar sesi chat pertama kali
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  // State indikator loading saat memuat riwayat pesan di dalam satu sesi chat
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  // State indikator saat request pengiriman pesan sedang dikirim ke backend
  const [isSending, setIsSending] = useState(false);

  // Fungsi asinkron dibungkus useCallback untuk mengambil seluruh daftar sesi dari backend
  const fetchSessions = useCallback(async () => {
    try {
      // Meminta data sesi ke server API
      const data = await chatApi.getSessions();
      // Menyimpan daftar sesi ke state (default ke array kosong jika datanya null)
      setSessions(data.sessions || []);
    } catch (error) {
      // Mencetak kesalahan pengambilan data sesi ke konsol browser
      console.error('Error fetching sessions:', error);
    } finally {
      // Menandai proses pemuatan sesi selesai dilakukan
      setIsLoadingSessions(false);
    }
  }, []); // Array dependensi kosong agar fungsi tidak dideklarasikan ulang kecuali komponen di-mount ulang

  // Fungsi asinkron untuk memuat riwayat pesan dari ID sesi tertentu
  const loadSession = useCallback(async (sessionId) => {
    // Jika parameter ID sesi kosong/null (mengosongkan layar obrolan)
    if (!sessionId) {
      // Set ID sesi aktif ke null
      setCurrentSessionId(null);
      // Kosongkan daftar pesan di layar
      setMessages([]);
      return;
    }
    // Set status pemuatan pesan dimulai
    setIsLoadingMessages(true);
    // Set ID sesi aktif ke ID sesi terpilih
    setCurrentSessionId(sessionId);
    try {
      // Mengunduh detail riwayat percakapan dari API
      const data = await chatApi.getSession(sessionId);
      // Menyimpan daftar pesan ke state messages
      setMessages(data.messages || []);
    } catch (error) {
      // Cetak error ke konsol
      console.error('Error loading session:', error);
    } finally {
      // Set status pemuatan pesan selesai
      setIsLoadingMessages(false);
    }
  }, []); // Array dependensi kosong

  // Fungsi asinkron untuk membuat sesi chat baru
  const createSession = async (title = 'New Chat') => {
    try {
      // Mengirim request POST pembuatan sesi baru ke API
      const data = await chatApi.createSession(title);
      // Menyisipkan sesi baru tersebut ke baris paling depan (indeks 0) daftar sessions
      setSessions([data, ...sessions]);
      // Set sesi baru tersebut sebagai sesi aktif di aplikasi
      setCurrentSessionId(data.id);
      // Kosongkan riwayat pesan untuk obrolan baru
      setMessages([]);
      // Mengembalikan data sesi baru
      return data;
    } catch (error) {
      // Cetak error ke konsol
      console.error('Error creating session:', error);
      // Lemparkan kembali error untuk ditangani oleh pemanggil fungsi
      throw error;
    }
  };

  // Fungsi asinkron untuk menghapus sesi percakapan
  const deleteSession = async (sessionId) => {
    try {
      // Mengirim request DELETE ke API backend
      await chatApi.deleteSession(sessionId);
      // Memfilter sessions untuk membuang sesi dengan ID terkait dari state lokal
      setSessions(sessions.filter(s => s.id !== sessionId));
      // Jika sesi yang dihapus kebetulan sedang dibuka saat ini
      if (currentSessionId === sessionId) {
        // Kembalikan ID sesi aktif ke null
        setCurrentSessionId(null);
        // Kosongkan daftar pesan
        setMessages([]);
      }
    } catch (error) {
      // Cetak error ke konsol
      console.error('Error deleting session:', error);
    }
  };

  // Fungsi asinkron untuk mengganti judul sesi chat
  const renameSession = async (sessionId, newTitle) => {
    try {
      // Mengirim request ubah judul ke backend API
      const data = await chatApi.renameSession(sessionId, newTitle);
      // Lakukan pemetaan di state sessions lokal untuk mengganti judul pada sesi terkait
      setSessions(sessions.map(s => s.id === sessionId ? { ...s, title: data.title || newTitle } : s));
      // Mengembalikan objek respons sesi
      return data;
    } catch (error) {
      // Cetak error ke konsol
      console.error('Error renaming session:', error);
      // Lemparkan error
      throw error;
    }
  };

  // Fungsi asinkron utama untuk mengirim pesan teks baru dari user ke asisten AI
  const sendMessage = async (content, bookFilter = null, onSessionCreated = null) => {
    // Menyimpan referensi ID sesi aktif
    let sessionId = currentSessionId;
    // Jika belum ada sesi chat aktif (memulai chat baru pertama kali)
    if (!sessionId) {
      // Buat sesi baru secara otomatis dengan judul potongan teks pesan pertama (40 karakter)
      const newSession = await createSession(content.slice(0, 40));
      // Set ID sesi baru tersebut sebagai target pengiriman pesan
      sessionId = newSession.id;
      // Picu callback onSessionCreated jika tersedia untuk memperbarui rute halaman web
      if (onSessionCreated) onSessionCreated(sessionId);
    }

    // Melakukan Optimistic UI update (menampilkan pesan user di layar terlebih dahulu sebelum server membalas)
    // Membuat ID pesan sementara berbasis penanda waktu unik
    const tempId = `temp-${Date.now()}`;
    // Menyusun objek pesan user buatan
    const newUserMsg = { id: tempId, role: 'user', content, created_at: new Date().toISOString() };
    // Menambahkan pesan user sementara ke dalam daftar pesan layar
    setMessages(prev => [...prev, newUserMsg]);
    // Set status mengirim aktif (menampilkan indikator loading tombol/input)
    setIsSending(true);

    try {
      // Mengirim request pengiriman pesan asinkron ke server API
      const data = await chatApi.sendMessage(sessionId, content, bookFilter);
      // Jika berhasil, ganti pesan sementara (tempId) dengan pesan resmi user dan pesan jawaban AI dari server
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        data.user_message,
        data.ai_message
      ]);
      
      // Jika ini adalah pesan perdana di sesi baru, ubah judul sesi lokal agar sinkron dengan input pertama
      if (messages.length === 0) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: content.slice(0, 80) } : s));
      }
      
      // Mengembalikan ID sesi aktif
      return sessionId;
    } catch (error) {
      // Cetak error ke konsol
      console.error('Error sending message:', error);
      // Jika gagal terkirim, hapus pesan sementara dari layar agar tidak menyesatkan user
      setMessages(prev => prev.filter(m => m.id !== tempId));
      // Lempar kembali error
      throw error;
    } finally {
      // Matikan indikator status mengirim
      setIsSending(false);
    }
  };

  // Efek samping untuk memuat daftar sesi chat ketika penyedia konteks di-load pertama kali
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    // Menyediakan seluruh state obrolan dan fungsi pemrosesan ke anak-anak komponen
    <ChatContext.Provider 
      value={{ 
        sessions, 
        currentSessionId, 
        messages, 
        isLoadingSessions, 
        isLoadingMessages, 
        isSending,
        loadSession,
        createSession,
        deleteSession,
        renameSession,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook kustom useChat untuk memudahkan integrasi data obrolan di berbagai halaman web
export const useChat = () => useContext(ChatContext);
