import React, { useState, useMemo } from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '../../utils/utils';
import MediaButtons from './MediaButtons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CitationModal from './CitationModal';

export default function ChatBubble({ message, isLast, readOnly = false }) {
  const isUser = message.role === 'user';
  const [selectedCitation, setSelectedCitation] = useState(null);
  
  const processedContent = (message.content || '').replace(/\[[Ss]\s*(\d+)\]/g, '[$1](#cit-$1)');
  
  const markdownComponents = useMemo(() => ({
    a: ({ href, children, ...props }) => {
      const isCitation = href?.startsWith('#cit-');
      if (isCitation) {
        const citationIndex = parseInt(href.replace('#cit-', ''), 10) - 1;
        const citationData = message.metadata?.sources?.[citationIndex];
        
        return (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (citationData) {
                setSelectedCitation(citationData);
              }
            }}
            className="text-primary hover:text-primary/80 font-bold text-xs align-super mx-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm" 
            title={citationData ? `Sumber: ${citationData.metadata?.title}` : `Citation ${children}`}
          >
            [{children}]
          </button>
        );
      }
      return (
        <a 
          href={href} 
          className="text-primary hover:underline font-medium break-all" 
          target="_blank" 
          rel="noopener noreferrer" 
          {...props}
        >
          {children}
        </a>
      );
    },
    p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
    h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 text-foreground/90">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2.5 text-foreground/90">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-foreground/90">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4 bg-muted/20 py-1 rounded-r-md">
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match && !className;
      return isInline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground/90" {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-muted/50 border border-border/40 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm">
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    },
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
      <div className={cn(
        "flex gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300", 
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-background z-10",
          isUser ? "bg-primary" : "bg-gradient-to-br from-indigo-500 to-purple-600"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div className={cn(
          "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm relative group",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-card text-card-foreground rounded-tl-sm border border-border/50"
        )}>
          <div className="font-sans text-[15px] leading-relaxed">
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {processedContent}
              </ReactMarkdown>
            )}
          </div>

          {/* Render Media if exists */}
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

          {/* Media Buttons for AI Messages without media - Hidden in readOnly */}
          {!isUser && !message.metadata?.media_type && !readOnly && (
            <div className="mt-4 pt-3 border-t border-border/50 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity duration-300">
              <MediaButtons sessionId={message.session_id} messageId={message.id} />
            </div>
          )}
        </div>
      </div>
      
      {/* Citation Modal */}
      <CitationModal 
        citation={selectedCitation} 
        isOpen={!!selectedCitation} 
        onClose={() => setSelectedCitation(null)} 
      />
    </>
  );
}
