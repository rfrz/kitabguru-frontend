// Mengimpor React beserta hooks useState dan useMemo untuk efisiensi render
import React, { useState, useMemo } from 'react';
// Mengimpor ikon User dan Bot dari lucide-react untuk avatar chat
import { User, Bot } from 'lucide-react';
// Mengimpor fungsi cn untuk penggabungan kelas CSS secara kondisional
import { cn } from '../../utils/utils';
// Mengimpor komponen tombol media (MediaButtons) untuk generate image/video
import MediaButtons from './MediaButtons';
// Mengimpor ReactMarkdown untuk merender format markdown ke elemen HTML
import ReactMarkdown from 'react-markdown';
// Mengimpor plugin remarkGfm agar markdown mendukung tabel, coret teks, checklist, dll
import remarkGfm from 'remark-gfm';
// Mengimpor modal sitasi (CitationModal) untuk menampilkan detail potongan kitab rujukan
import CitationModal from './CitationModal';

// Komponen Balon Chat (ChatBubble) untuk menampilkan pesan user atau asisten AI
export default function ChatBubble({ message, isLast, readOnly = false }) {
  // Mengecek apakah pesan dikirim oleh user
  const isUser = message.role === 'user';
  // State untuk melacak item sitasi rujukan yang sedang diklik/dipilih oleh user
  const [selectedCitation, setSelectedCitation] = useState(null);
  
  // Mengonversi pola teks sitasi seperti [S1] atau [s2] menjadi format link markdown internal: [1](#cit-1)
  const processedContent = (message.content || '').replace(/\[[Ss]\s*(\d+)\]/g, '[$1](#cit-$1)');
  
  // Menetapkan pemetaan khusus (custom rendering) untuk elemen-elemen HTML di dalam ReactMarkdown
  const markdownComponents = useMemo(() => ({
    // Kustomisasi tag a (hyperlink/link rujukan)
    a: ({ href, children, ...props }) => {
      // Memeriksa apakah link tersebut merupakan link sitasi rujukan internal (diawali '#cit-')
      const isCitation = href?.startsWith('#cit-');
      // Jika ya, render sebagai tombol interaktif untuk membuka popup detail kitab
      if (isCitation) {
        // Mengonversi string nomor bab ke angka indeks array (1-indexed ke 0-indexed)
        const citationIndex = parseInt(href.replace('#cit-', ''), 10) - 1;
        // Mengambil objek data sitasi dari list metadata sumber RAG
        const citationData = message.metadata?.sources?.[citationIndex];
        
        return (
          <button 
            type="button"
            // Saat tombol sitasi diklik
            onClick={(e) => {
              // Mencegah perubahan URL hash halaman
              e.preventDefault();
              // Jika data sitasi tersedia
              if (citationData) {
                // Set data sitasi terpilih untuk membuka modal popup
                setSelectedCitation(citationData);
              }
            }}
            // Tampilan tombol teks sitasi melayang kecil di atas (superscript)
            className="text-primary hover:text-primary/80 font-bold text-xs align-super mx-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm" 
            title={citationData ? `Sumber: ${citationData.metadata?.title}` : `Citation ${children}`}
          >
            {/* Menampilkan angka sitasi, contoh: [1] */}
            [{children}]
          </button>
        );
      }
      // Jika berupa link web eksternal biasa, render sebagai tag jangkar (a) standar
      return (
        <a 
          href={href} 
          className="text-primary hover:underline font-medium break-all" 
          // Membuka di tab baru browser
          target="_blank" 
          // Mencegah celah keamanan tab baru (security best practices)
          rel="noopener noreferrer" 
          {...props}
        >
          {children}
        </a>
      );
    },
    // Kustomisasi paragraf (p)
    p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
    // Kustomisasi heading 1, 2, dan 3
    h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 text-foreground/90">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2.5 text-foreground/90">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-foreground/90">{children}</h3>,
    // Kustomisasi list bulat (ul) dan list angka (ol)
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    // Kustomisasi blok kutipan (blockquote) dengan pembatas garis kiri warna primer
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4 bg-muted/20 py-1 rounded-r-md">
        {children}
      </blockquote>
    ),
    // Kustomisasi blok kode (code / pre)
    code: ({ className, children, ...props }) => {
      // Memeriksa apakah blok kode memiliki penanda bahasa pemrograman (language-xxx)
      const match = /language-(\w+)/.exec(className || '');
      // Menandai kode inline jika tidak ada penanda bahasa
      const isInline = !match && !className;
      return isInline ? (
        // Tampilan kode inline
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground/90" {...props}>
          {children}
        </code>
      ) : (
        // Tampilan blok pre-formatted code dengan scroll horizontal
        <pre className="bg-muted/50 border border-border/40 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm">
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    },
    // Kustomisasi tabel HTML agar responsif
    table: ({ children }) => (
      <div className="overflow-x-auto my-6 border border-border/50 rounded-xl">
        <table className="min-w-full divide-y divide-border/50 text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-border/40 bg-card">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-foreground/85 border-b border-border/50">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-foreground/80 border-b border-border/40">{children}</td>,
  }), [message.metadata?.sources]);

  return (
    <>
      {/* Struktur utama balon chat dengan animasi masuk */}
      <div className={cn(
        "flex gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300", 
        // Mengubah arah layout menjadi kanan-ke-kiri jika pengirimnya adalah user
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar penunjuk pengirim (User / Bot) */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-background z-10",
          isUser ? "bg-primary" : "bg-gradient-to-br from-indigo-500 to-purple-600"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        {/* Kontainer isi pesan dengan warna disesuaikan pengirim */}
        <div className={cn(
          "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm relative group",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-card text-card-foreground rounded-tl-sm border border-border/50"
        )}>
          <div className="font-sans text-[15px] leading-relaxed">
            {isUser ? (
              // Tampilkan teks biasa dengan pre-wrap jika pengirimnya user
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              // Render format markdown jika pengirimnya asisten AI
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {processedContent}
              </ReactMarkdown>
            )}
          </div>

          {/* Menampilkan berkas gambar terlampir jika tipe media adalah 'image' */}
          {message.metadata?.media_type === 'image' && message.metadata?.url && (
            <div className="mt-4">
              <div className="rounded-xl overflow-hidden shadow-sm border border-border/50 bg-muted/30 relative">
                <img 
                  src={message.metadata.url} 
                  alt="Generated Media" 
                  className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer" 
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Menampilkan player video jika tipe media adalah 'video' */}
          {message.metadata?.media_type === 'video' && message.metadata?.url && (
            <div className="mt-4">
              <div className="rounded-xl overflow-hidden shadow-sm border border-border/50 bg-black relative animate-in fade-in zoom-in-95 duration-300">
                <video 
                  src={message.metadata.url} 
                  controls 
                  className="w-full h-auto aspect-video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* Tombol pembuat media (MediaButtons) untuk pesan asisten AI yang belum memiliki lampiran media */}
          {!isUser && !message.metadata?.media_type && !readOnly && (
            <div className="mt-4 pt-3 border-t border-border/50 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity duration-300">
              <MediaButtons sessionId={message.session_id} messageId={message.id} />
            </div>
          )}
        </div>
      </div>
      
      {/* Modal Popup detail rujukan sitasi */}
      <CitationModal 
        citation={selectedCitation} 
        isOpen={!!selectedCitation} 
        onClose={() => setSelectedCitation(null)} 
      />
    </>
  );
}
