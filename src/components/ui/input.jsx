// Mengimpor React untuk membangun komponen input
import React from 'react';
// Mengimpor fungsi penggabung kelas CSS kustom (cn)
import { cn } from '../../utils/utils';

// Membuat komponen Input menggunakan forwardRef agar ref form-handling (seperti react-hook-form) dapat ditransmisikan
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    // Merender tag input HTML standar
    <input
      // Menentukan tipe input secara dinamis (seperti text, password, email)
      type={type}
      // Menerapkan styling default untuk input teks yang responsif dan mendukung skema warna gelap/terang
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // Menambahkan kelas kustom tambahan jika dikirim melalui props
        className
      )}
      // Meneruskan referensi ke elemen input DOM asli
      ref={ref}
      // Menyebarkan sisa properti lainnya (seperti value, onChange, placeholder, dll)
      {...props}
    />
  );
});
// Menentukan displayName untuk keperluan debugging komponen React
Input.displayName = "Input";

// Mengekspor komponen Input agar dapat digunakan di modul halaman form
export { Input };
