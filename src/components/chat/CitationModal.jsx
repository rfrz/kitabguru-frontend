// Mengimpor React
import React from 'react';
// Mengimpor komponen Dialog dari Radix UI untuk modal popup aksesibilitas standar (WAI-ARIA)
import * as Dialog from '@radix-ui/react-dialog';
// Mengimpor ikon X, BookOpen, User, dan FileText dari lucide-react untuk dekorasi modal
import { X, BookOpen, User, FileText } from 'lucide-react';

// Komponen Modal Sitasi (CitationModal) untuk menampilkan teks rujukan asal potongan kitab
export default function CitationModal({ citation, isOpen, onClose }) {
  // Jika objek data sitasi (citation) kosong, jangan render apapun
  if (!citation) return null;

  return (
    // Root Dialog Radix UI dikendalikan oleh properti isOpen dan callback onClose saat ditutup
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Latar belakang transparan gelap modal (overlay) dengan efek blur */}
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        {/* Kontainer tengah pembungkus posisi modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pointer-events-none">
          {/* Kotak konten modal utama dengan scroll, bayangan, kelengkungan sudut, dan animasi zoom */}
          <Dialog.Content className="pointer-events-auto flex flex-col w-full max-w-lg gap-4 border border-border/60 bg-background/95 backdrop-blur-xl p-6 shadow-2xl sm:rounded-2xl max-h-[85vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
            {/* Header info modal */}
            <div className="flex flex-col space-y-1.5 text-center sm:text-left pr-6 shrink-0">
              {/* Judul modal berupa judul kitab rujukan */}
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2 text-foreground/90">
              <BookOpen size={18} className="text-primary" />
              {citation.metadata?.title || 'Sumber Referensi'}
            </Dialog.Title>
            {/* Deskripsi metadata kitab (penulis, bab, judul bagian, nomor halaman jika ada) */}
            <Dialog.Description className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
              {/* Tampilkan nama penulis jika ada */}
              {citation.metadata?.author && (
                <span className="flex items-center gap-1.5"><User size={14} /> {citation.metadata.author}</span>
              )}
              {/* Tampilkan nomor bab jika ada */}
              {citation.metadata?.chapter && (
                <span className="flex items-center gap-1.5"><FileText size={14} /> Bab: {citation.metadata.chapter}</span>
              )}
              {/* Tampilkan nama sub-bab (heading) jika bukan nilai '-' */}
              {citation.metadata?.heading && citation.metadata.heading !== '-' && (
                <span className="flex items-center gap-1.5"><FileText size={14} /> Bagian: {citation.metadata.heading}</span>
              )}
              {/* Tampilkan nomor halaman jika ada */}
              {citation.metadata?.page && (
                <span className="flex items-center gap-1.5"><FileText size={14} /> Hal. {citation.metadata.page}</span>
              )}
            </Dialog.Description>
          </div>
          
          {/* Bagian isi konten teks potongan dokumen dengan scrollbar vertikal kustom */}
          <div className="mt-2 border-t border-border/50 pt-4 overflow-y-auto custom-scrollbar flex-1">
            {/* Jika teks kutipan asli tersedia, tampilkan di dalam kotak berlatar abu-abu bergaya tulisan miring (italic) */}
            {citation.document ? (
              <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap italic bg-muted/30 p-4 rounded-xl border border-border/40">
                "{citation.document}"
              </div>
            ) : (
              // Tampilkan pesan kosong jika teks tidak ada
              <div className="text-sm text-muted-foreground italic text-center py-8">
                Detail teks chunk tidak tersedia untuk referensi ini.
              </div>
            )}
          </div>

          {/* Tombol X di pojok kanan atas modal untuk menutup */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1.5 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
