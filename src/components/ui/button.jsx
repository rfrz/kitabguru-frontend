// Mengimpor React untuk membangun komponen
import React from 'react';
// Mengimpor Slot dari Radix UI untuk merender elemen anak sebagai pengganti tag button (asChild pattern)
import { Slot } from '@radix-ui/react-slot';
// Mengimpor cva (class-variance-authority) untuk mengelola variasi kelas CSS (styling)
import { cva } from 'class-variance-authority';
// Mengimpor fungsi penggabung kelas CSS kustom (cn)
import { cn } from '../../utils/utils';

// Menentukan variasi gaya kelas CSS default dan kustom tombol menggunakan helper cva
const buttonVariants = cva(
  // Kelas gaya dasar yang berlaku untuk semua tombol
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    // Konfigurasi beberapa variasi gaya tombol
    variants: {
      // Pilihan varian warna dan latar belakang tombol
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Pilihan variasi ukuran dimensi tombol
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Setelan bawaan jika properti variant atau size tidak didefinisikan saat pemanggilan komponen
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Membuat komponen Button menggunakan React.forwardRef agar ref dapat diteruskan ke elemen DOM asli
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  // Jika properti asChild bernilai true, gunakan komponen Slot, jika tidak gunakan tag html "button" biasa
  const Comp = asChild ? Slot : "button";
  return (
    // Render elemen tag terpilih dengan properti, kelas varian CSS, dan referensi diteruskan
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
// Memberikan nama tampilan (displayName) komponen untuk keperluan debugging React DevTools
Button.displayName = "Button";

// Mengekspor komponen Button dan variasi gayanya agar dapat diimpor di tempat lain
export { Button, buttonVariants };
