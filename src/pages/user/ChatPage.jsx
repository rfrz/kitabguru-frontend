import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Sync URL to State: If URL changes, load that session
  useEffect(() => {
    const targetSessionId = sessionId || null;
    if (targetSessionId !== currentSessionId) {
      loadSession(targetSessionId);
    }
  }, [sessionId, currentSessionId, loadSession]);



  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative bg-dot-pattern bg-fixed">
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">KG</span>
            </div>
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
