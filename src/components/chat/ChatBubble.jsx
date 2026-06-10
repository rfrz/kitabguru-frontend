import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '../../utils/utils';
import MediaButtons from './MediaButtons';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex gap-4 w-full", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white",
        isUser ? "bg-blue-600" : "bg-emerald-600"
      )}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      
      <div className={cn(
        "max-w-[80%] rounded-2xl p-4 shadow-sm",
        isUser 
          ? "bg-blue-500 text-white rounded-tr-sm" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-700"
      )}>
        <div className="whitespace-pre-wrap font-sans leading-relaxed text-sm">
          {message.content}
        </div>
        
        {/* Render Citations if AI and metadata exists */}
        {!isUser && message.metadata?.citations && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold mb-2 opacity-80">Sumber Referensi:</p>
            <ul className="text-xs space-y-1 opacity-70">
              {message.metadata.citations.map((cit, idx) => (
                <li key={idx} className="list-disc list-inside">
                  {cit.title} (Hal. {cit.page}) - <i>{cit.author}</i>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Render Media if exists */}
        {message.metadata?.media_type === 'image' && message.metadata?.url && (
          <div className="mt-3">
            <img 
              src={message.metadata.url} 
              alt="Generated Media" 
              className="w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
            />
          </div>
        )}

        {/* Media Buttons for AI Messages without media */}
        {!isUser && !message.metadata?.media_type && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <MediaButtons sessionId={message.session_id} messageId={message.id} />
          </div>
        )}
      </div>
    </div>
  );
}
