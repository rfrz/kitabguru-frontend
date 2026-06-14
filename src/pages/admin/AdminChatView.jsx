import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import ChatBubble from '../../components/chat/ChatBubble';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminChatView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await adminApi.getSession(id);
        setSession(data.session);
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load chat session details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      <main className="flex-1 flex flex-col h-full relative bg-dot-pattern bg-fixed">
        {/* Header */}
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
              <span>Back to Admin</span>
            </Button>
            <div className="h-4 w-[1px] bg-border/50" />
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm tracking-tight text-foreground/90">
                {session?.title || 'Viewing Chat Session'}
              </h1>
              <span className="text-[10px] text-muted-foreground">
                Session ID: {id}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <ShieldAlert size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Read Only View</span>
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar relative z-0">
          {loading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary/50" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center text-destructive p-4">
              <p className="font-medium text-center">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/admin')}>
                Back to Dashboard
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p className="text-sm opacity-80">This session has no messages.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              {messages.map((msg, idx) => (
                <ChatBubble 
                  key={msg.id} 
                  message={msg} 
                  isLast={idx === messages.length - 1} 
                  readOnly={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer/Indicator */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto flex justify-center">
            <div className="px-4 py-3 bg-muted border border-border rounded-full shadow-sm text-xs text-muted-foreground flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>You are viewing this chat in read-only administrator mode. Responses cannot be sent.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
