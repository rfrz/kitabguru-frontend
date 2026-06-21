// Mengimpor React beserta hook useState untuk mengelola status input email dan password
import React, { useState } from 'react';
// Mengimpor useNavigate untuk mengalihkan halaman, dan Link untuk navigasi halaman pendaftaran
import { useNavigate, Link } from 'react-router-dom';
// Mengimpor hook autentikasi untuk memanggil fungsi masuk (login)
import { useAuth } from '../../contexts/AuthContext';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../../components/ui/button';
// Mengimpor komponen input teks kustom (Input)
import { Input } from '../../components/ui/input';
// Mengimpor komponen label teks kustom (Label)
import { Label } from '../../components/ui/label';
// Mengimpor komponen kartu kustom untuk menyusun layout formulir
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';

/**
 * Halaman LoginPage menyediakan formulir masuk bagi pengguna terdaftar.
 * Pengguna menginputkan email dan password untuk diautentikasi oleh server.
 */
export default function LoginPage() {
  // State menyimpan isian teks alamat email
  const [email, setEmail] = useState('');
  // State menyimpan isian teks password
  const [password, setPassword] = useState('');
  // State penampung pesan kesalahan (error) jika autentikasi gagal
  const [error, setError] = useState(null);
  // State penanda apakah proses login sedang berlangsung di server (loading)
  const [isLoading, setIsLoading] = useState(false);
  // Mengambil fungsi login asinkron dari AuthContext
  const { login } = useAuth();
  // Navigasi router
  const navigate = useNavigate();

  // Fungsi asinkron menangani pengiriman data formulir login saat disubmit
  const handleSubmit = async (e) => {
    // Mencegah browser melakukan muat ulang halaman (default form submit)
    e.preventDefault();
    // Mengaktifkan status loading proses
    setIsLoading(true);
    // Mengosongkan pesan error lama
    setError(null);
    try {
      // Memanggil fungsi login dari AuthContext dengan parameter email dan password
      await login(email, password);
      // Jika sukses, arahkan pengguna ke halaman obrolan utama (/chat)
      navigate('/chat');
    } catch (err) {
      // Menyimpan pesan kesalahan spesifik dari server ke state error
      setError(err.response?.data?.detail || 'Failed to login');
    } finally {
      // Menonaktifkan status loading setelah proses selesai dilakukan
      setIsLoading(false);
    }
  };

  return (
    // Wadah utama penempat kartu formulir di tengah layar
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {/* Kartu formulir masuk */}
      <Card className="w-full max-w-sm">
        {/* Header kartu berisi judul dan deskripsi singkat */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access KitabGuru
          </CardDescription>
        </CardHeader>
        {/* Formulir penginputan data */}
        <form onSubmit={handleSubmit}>
          {/* Konten kartu berupa input fields */}
          <CardContent className="space-y-4">
            {/* Render kondisional pesan error berwarna merah jika error tersedia */}
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{error}</div>}
            {/* Input Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {/* Input Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          {/* Bagian bawah kartu berisi tombol aksi */}
          <CardFooter className="flex flex-col space-y-4">
            {/* Tombol submit login */}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {/* Link alternatif untuk berpindah ke halaman pendaftaran (register) */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
