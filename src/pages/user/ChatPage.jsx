import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import Sidebar from '../../components/layout/Sidebar';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';

export default function ChatPage() {
  const { user } = useAuth();
  const { currentSessionId, messages, isLoadingMessages, loadSession } = useChat();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Handle responsive sidebar behavior on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync URL to State: If URL changes, load that session
  useEffect(() => {
    const targetSessionId = sessionId || null;
    if (targetSessionId !== currentSessionId) {
      loadSession(targetSessionId);
    }
  }, [sessionId, currentSessionId, loadSession]);



  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-full relative bg-dot-pattern bg-fixed min-w-0 transition-all duration-300">
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-base tracking-tight text-foreground/90">KitabGuru</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
              <span className="text-xs font-medium text-secondary-foreground/80">{user?.username}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar relative z-0">
          {!currentSessionId ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground animate-in fade-in duration-500 zoom-in-95">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                 <span className="text-primary/40 text-4xl font-bold">KG</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">Welcome to KitabGuru</h2>
              <p className="text-sm max-w-sm text-center opacity-80">
                Select an existing session from the sidebar or start a new chat to begin exploring.
              </p>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground animate-in fade-in duration-500">
               <div className="text-center">
                 <p className="text-sm opacity-80">This is the beginning of your chat.</p>
               </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              {messages.map((msg, idx) => (
                <ChatBubble key={msg.id} message={msg} isLast={idx === messages.length - 1} />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
}
