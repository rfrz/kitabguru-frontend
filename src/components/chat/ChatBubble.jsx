import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '../../utils/utils';
import MediaButtons from './MediaButtons';

export default function ChatBubble({ message, isLast }) {
  const isUser = message.role === 'user';
  
  return (
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
        <div className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed">
          {message.content}
        </div>
        
        {/* Render Citations if AI and metadata exists */}
        {!isUser && message.metadata?.citations && message.metadata.citations.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Sumber Referensi:</p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              {message.metadata.citations.map((cit, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary/70 mt-0.5">•</span>
                  <span>
                    <span className="font-medium text-foreground/80">{cit.title}</span> 
                    {cit.page ? ` (Hal. ${cit.page})` : ''} 
                    <span className="italic opacity-80 ml-1">- {cit.author}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

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

        {/* Media Buttons for AI Messages without media */}
        {!isUser && !message.metadata?.media_type && (
          <div className="mt-4 pt-3 border-t border-border/50 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity duration-300">
            <MediaButtons sessionId={message.session_id} messageId={message.id} />
          </div>
        )}
      </div>
    </div>
  );
}
