// Mengimpor React untuk membangun komponen
import React from 'react';
// Mengimpor fungsi penggabung kelas CSS kustom (cn)
import { cn } from '../../utils/utils';

// Komponen Card bertindak sebagai wadah pembungkus utama dengan border, latar belakang kartu, dan bayangan tipis
const Card = React.forwardRef(({ className, ...props }, ref) => (
  // Merender div penampung utama kartu
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props}
  />
));
// Menentukan displayName untuk kebutuhan debugging React DevTools
Card.displayName = "Card";

// Komponen CardHeader bertindak sebagai wadah header di bagian atas kartu (misalnya untuk judul/deskripsi)
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  // Merender div penampung area header
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
// Menentukan displayName komponen CardHeader
CardHeader.displayName = "CardHeader";

// Komponen CardTitle digunakan untuk merender teks judul tebal di dalam header kartu
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  // Merender tag h3 heading level 3 untuk judul
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
// Menentukan displayName komponen CardTitle
CardTitle.displayName = "CardTitle";

// Komponen CardDescription digunakan untuk menampilkan teks penjelasan sekunder di bawah judul kartu
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  // Merender tag p paragraf dengan warna teks abu-abu redup (muted)
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
// Menentukan displayName komponen CardDescription
CardDescription.displayName = "CardDescription";

// Komponen CardContent digunakan sebagai wadah area konten utama/isi di dalam kartu
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  // Merender div penampung isi konten
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
// Menentukan displayName komponen CardContent
CardContent.displayName = "CardContent";

// Komponen CardFooter diletakkan di bagian bawah kartu untuk aksi tombol atau link tambahan
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  // Merender div penampung bagian kaki kartu
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
// Menentukan displayName komponen CardFooter
CardFooter.displayName = "CardFooter";

// Mengekspor semua komponen kartu yang telah didefinisikan agar dapat digunakan secara modular
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
