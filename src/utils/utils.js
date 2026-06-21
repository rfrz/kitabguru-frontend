// Mengimpor clsx untuk penggabungan nama kelas CSS bersyarat (conditional class names)
import { clsx } from "clsx";
// Mengimpor twMerge untuk menggabungkan kelas Tailwind CSS yang bertabrakan secara cerdas
import { twMerge } from "tailwind-merge";

/**
 * Fungsi cn (Class Name helper) digunakan secara global di seluruh komponen UI
 * untuk menggabungkan nama-nama kelas CSS dinamis dan memecahkan konflik kelas Tailwind.
 *
 * @param {...any} inputs - Daftar string, objek, atau array nama kelas CSS
 */
export function cn(...inputs) {
  // Menggabungkan kelas menggunakan clsx terlebih dahulu, lalu membersihkan konflik via twMerge
  return twMerge(clsx(inputs));
}
