// Mengimpor React beserta hook useState untuk menyimpan input data pengguna baru
import React, { useState } from 'react';
// Mengimpor useNavigate untuk pengalihan halaman, dan Link untuk tautan balik ke halaman login
import { useNavigate, Link } from 'react-router-dom';
// Mengimpor hook autentikasi untuk memicu fungsi pendaftaran akun (register)
import { useAuth } from '../../contexts/AuthContext';
// Mengimpor komponen tombol kustom (Button)
import { Button } from '../../components/ui/button';
// Mengimpor komponen input kustom (Input)
import { Input } from '../../components/ui/input';
// Mengimpor komponen label kustom (Label)
import { Label } from '../../components/ui/label';
// Mengimpor komponen kartu kustom untuk wrapper form
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';

/**
 * Halaman RegisterPage menyediakan formulir pembuatan akun baru (pendaftaran).
 * Pengguna mengisi email, username, dan password untuk membuat profil di KitabGuru.
 */
export default function RegisterPage() {
  // State untuk menyimpan isian alamat email pengguna baru
  const [email, setEmail] = useState('');
  // State untuk menyimpan isian nama pengguna (username)
  const [username, setUsername] = useState('');
  // State untuk menyimpan isian kata sandi (password)
  const [password, setPassword] = useState('');
  // State penampung pesan kesalahan (error) dari proses server
  const [error, setError] = useState(null);
  // State indikator status pemrosesan pendaftaran akun (loading)
  const [isLoading, setIsLoading] = useState(false);
  // Mengambil fungsi registrasi dari konteks autentikasi
  const { register } = useAuth();
  // Navigasi router
  const navigate = useNavigate();

  // Fungsi asinkron penangan pengiriman data pendaftaran (submit form)
  const handleSubmit = async (e) => {
    // Mencegah halaman reload saat form dikirim
    e.preventDefault();
    // Mengaktifkan status loading tombol
    setIsLoading(true);
    // Mengosongkan pesan kesalahan lama
    setError(null);
    try {
      // Memanggil fungsi register dari AuthContext dengan membawa data email, username, dan password
      await register(email, username, password);
      // Jika berhasil dibuatkan akun dan terlogin otomatis, alihkan ke halaman chat utama
      navigate('/chat');
    } catch (err) {
      // Tampilkan pesan error detail dari server
      setError(err.response?.data?.detail || 'Failed to register');
    } finally {
      // Matikan indikator loading
      setIsLoading(false);
    }
  };

  return (
    // Kontainer penempat form di tengah layar browser
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {/* Kartu formulir pendaftaran */}
      <Card className="w-full max-w-sm">
        {/* Header kartu berisi judul halaman */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        {/* Form pendaftaran */}
        <form onSubmit={handleSubmit}>
          {/* Bagian isi kolom input */}
          <CardContent className="space-y-4">
            {/* Tampilkan bar merah pesan error jika state error tidak bernilai null */}
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
            {/* Input Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="johndoe" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            {/* Tombol submit buat akun */}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
            {/* Link beralih cepat ke halaman login jika pengguna sudah mempunyai akun */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
