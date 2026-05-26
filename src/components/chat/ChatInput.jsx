import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useChat } from '../../contexts/ChatContext';

export default function ChatInput() {
  const [content, setContent] = useState('');
  const { sendMessage, isSending } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    const message = content;
    setContent('');
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
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tanyakan sesuatu..."
        className="w-full bg-transparent px-4 py-3 outline-none resize-none max-h-32 min-h-[52px] text-sm text-gray-800 dark:text-gray-200"
        rows={1}
        disabled={isSending}
      />
      <div className="absolute right-2 bottom-1.5 flex items-center">
        <Button 
          type="submit" 
          size="icon"
          className="h-9 w-9 rounded-lg"
          disabled={!content.trim() || isSending}
        >
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </Button>
      </div>
    </form>
  );
}
