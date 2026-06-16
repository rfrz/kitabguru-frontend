import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, BookOpen, User, FileText } from 'lucide-react';

export default function CitationModal({ citation, isOpen, onClose }) {
  if (!citation) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pointer-events-none">
          <Dialog.Content className="pointer-events-auto flex flex-col w-full max-w-lg gap-4 border border-border/60 bg-background/95 backdrop-blur-xl p-6 shadow-2xl sm:rounded-2xl max-h-[85vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left pr-6 shrink-0">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2 text-foreground/90">
              <BookOpen size={18} className="text-primary" />
              {citation.metadata?.title || 'Sumber Referensi'}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
              {citation.metadata?.author && (
                <span className="flex items-center gap-1.5"><User size={14} /> {citation.metadata.author}</span>
              )}
              {citation.metadata?.chapter && (
                <span className="flex items-center gap-1.5"><FileText size={14} /> Bab: {citation.metadata.chapter}</span>
              )}
              {citation.metadata?.heading && citation.metadata.heading !== '-' && (
                <span className="flex items-center gap-1.5"><FileText size={14} /> Bagian: {citation.metadata.heading}</span>
              )}
              {citation.metadata?.page && (
                <span className="flex items-center gap-1.5"><FileText size={14} /> Hal. {citation.metadata.page}</span>
              )}
            </Dialog.Description>
          </div>
          
          <div className="mt-2 border-t border-border/50 pt-4 overflow-y-auto custom-scrollbar flex-1">
            {citation.document ? (
              <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap italic bg-muted/30 p-4 rounded-xl border border-border/40">
                "{citation.document}"
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic text-center py-8">
                Detail teks chunk tidak tersedia untuk referensi ini.
              </div>
            )}
          </div>

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
