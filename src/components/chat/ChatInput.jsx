import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useChat } from '../../contexts/ChatContext';

export default function ChatInput() {
  const [content, setContent] = useState('');
  const { sendMessage, isSending } = useChat();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    const message = content;
    setContent('');
    if (textareaRef.current) textareaRef.current.style.height = 'inherit';
    
    try {
      await sendMessage(message);
    } catch (error) {
      setContent(message); // restore if failed
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end bg-background/80 backdrop-blur-xl rounded-2xl border border-border/60 shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2"
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan sesuatu..."
          className="w-full bg-transparent px-3 py-2.5 outline-none resize-none max-h-[150px] min-h-[44px] text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 custom-scrollbar"
          rows={1}
          disabled={isSending}
        />
        <div className="flex-shrink-0 mb-0.5 ml-2">
          <Button 
            type="submit" 
            size="icon"
            className="h-10 w-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
            disabled={!content.trim() || isSending}
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
