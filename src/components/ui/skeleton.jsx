// Mengimpor React untuk membangun komponen skeleton loading
import React from 'react';
// Mengimpor fungsi penggabung kelas CSS kustom (cn)
import { cn } from '../../utils/utils';

/**
 * Komponen Skeleton digunakan untuk merender kotak abu-abu berdenyut (pulse)
 * sebagai representasi visual loading konten sebelum data aktual selesai diunduh.
 *
 * @param {string} className - Kelas CSS tambahan untuk menyesuaikan bentuk dan ukuran skeleton
 */
function Skeleton({ className, ...props }) {
  return (
    // Merender tag div dengan animasi pulse (berdenyut) dan warna latar belakang abu-abu (gelap/terang)
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)}
      // Menyebarkan sisa properti tambahan (seperti style atau aria-hidden)
      {...props}
    />
  );
}

// Mengekspor komponen Skeleton agar dapat diimpor di tempat lain
export { Skeleton };
