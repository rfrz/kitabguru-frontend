import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ShieldAlert, Play, Pause, Volume2, User, Bot } from 'lucide-react';
import { cn } from '../../utils/utils';

export default function AdminIoTView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [audioElements, setAudioElements] = useState({});

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await adminApi.getIoTSession(id);
        setSession(data);
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load IoT session details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // Clean up audio elements on unmount
  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
      });
    };
  }, [audioElements]);

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
    try {
      const url = new URL(apiBase);
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      if (cleanPath.startsWith('/media')) {
        return `${url.origin}${cleanPath}`;
      }
      return `${url.origin}/media${cleanPath}`;
    } catch (e) {
      return path;
    }
  };

  const handlePlayPause = (msgId, path) => {
    const audioUrl = getMediaUrl(path);
    if (!audioUrl) return;

    if (playingId === msgId) {
      // Pause
      audioElements[msgId].pause();
      setPlayingId(null);
    } else {
      // Pause any existing playing audio
      if (playingId && audioElements[playingId]) {
        audioElements[playingId].pause();
      }

      let audio = audioElements[msgId];
      if (!audio) {
        audio = new Audio(audioUrl);
        audio.onended = () => {
          setPlayingId(null);
        };
        setAudioElements(prev => ({ ...prev, [msgId]: audio }));
      }

      audio.play().catch(e => console.error("Audio play failed:", e));
      setPlayingId(msgId);
    }
  };

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
                IoT Session: {session?.device_id || 'Viewing IoT Session'}
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
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={cn(
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
                        {msg.content}
                      </div>

                      {/* Render IoT Audio if exists */}
                      {msg.audio_path && (
                        <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center gap-3">
                          <button
                            onClick={() => handlePlayPause(msg.id, msg.audio_path)}
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm",
                              playingId === msg.id 
                                ? "bg-red-500 hover:bg-red-600 text-white" 
                                : "bg-primary/10 hover:bg-primary/20 text-primary"
                            )}
                          >
                            {playingId === msg.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                          </button>
                          <div className="flex-1 flex flex-col">
                            <span className="text-[11px] font-medium opacity-80 flex items-center gap-1">
                              <Volume2 size={12} />
                              Voice Recording
                            </span>
                            <span className="text-[9px] opacity-60 truncate">
                              {msg.audio_path.split('/').pop()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer/Indicator */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto flex justify-center">
            <div className="px-4 py-3 bg-muted border border-border rounded-full shadow-sm text-xs text-muted-foreground flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>You are viewing this IoT chat history in read-only administrator mode. Responses cannot be sent.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
