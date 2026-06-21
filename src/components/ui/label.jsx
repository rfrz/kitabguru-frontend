// Mengimpor React untuk membangun komponen label
import React from 'react';
// Mengimpor primitif Label dari Radix UI untuk fungsionalitas label aksesibilitas web (WAI-ARIA) yang andal
import * as LabelPrimitive from '@radix-ui/react-label';
// Mengimpor cva untuk pengelolaan kelas variasi CSS
import { cva } from 'class-variance-authority';
// Mengimpor fungsi penggabung kelas CSS kustom (cn)
import { cn } from '../../utils/utils';

// Menentukan gaya dasar untuk label teks, termasuk interaksi dengan komponen peer di sebelahnya (seperti checkbox/input)
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Membuat komponen Label menggunakan forwardRef agar referensi input label terikat dengan benar
const Label = React.forwardRef(({ className, ...props }, ref) => (
  // Merender Root primitif Label Radix UI
  <LabelPrimitive.Root
    // Meneruskan referensi DOM
    ref={ref}
    // Menggabungkan kelas CSS bawaan dari labelVariants dan kelas kustom tambahan
    className={cn(labelVariants(), className)}
    // Menyebarkan sisa properti (misalnya htmlFor untuk mengikat ID input)
    {...props}
  />
));
// Menyamakan nama tampilan (displayName) komponen Label dengan komponen primitif bawaan Radix
Label.displayName = LabelPrimitive.Root.displayName;

// Mengekspor komponen Label agar dapat digunakan di modul halaman form
export { Label };
