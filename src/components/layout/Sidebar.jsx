import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Button } from '../ui/button';
import { PlusCircle, MessageSquare, Trash2, LogOut, Settings, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { sessions, currentSessionId, loadSession, createSession, deleteSession, renameSession, isLoadingSessions } = useChat();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (e, session) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title || 'Untitled Chat');
  };

  const cancelEditing = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const saveEditing = async (e, sessionId) => {
    e.stopPropagation();
    if (editTitle.trim() && editTitle.trim() !== sessions.find(s => s.id === sessionId)?.title) {
      await renameSession(sessionId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r border-border bg-background/95 backdrop-blur-md flex flex-col h-full shrink-0 shadow-sm z-20 transition-all duration-300">
      <div className="p-4 border-b border-border">
        <Button 
          onClick={handleNewChat} 
          className="w-full flex items-center justify-center gap-2 rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
        >
          <PlusCircle size={18} />
          <span className="font-medium">New Chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {isLoadingSessions ? (
          <div className="text-center text-xs text-muted-foreground py-4 animate-pulse">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-4">No recent chats</div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                currentSessionId === session.id 
                  ? 'bg-secondary text-secondary-foreground shadow-sm font-medium' 
                  : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                if (editingId !== session.id) navigate(`/chat/${session.id}`);
              }}
            >
              {editingId === session.id ? (
                <div className="flex items-center gap-1.5 w-full animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing(e, session.id);
                      if (e.key === 'Escape') cancelEditing(e);
                    }}
                    className="flex-1 bg-background text-foreground text-sm px-2 py-1 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm transition-all"
                  />
                  <button onClick={(e) => saveEditing(e, session.id)} className="text-emerald-500 hover:text-emerald-600 p-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-md transition-colors"><Check size={14} /></button>
                  <button onClick={cancelEditing} className="text-rose-500 hover:text-rose-600 p-1 bg-rose-50 dark:bg-rose-950/30 rounded-md transition-colors"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 truncate">
                    <MessageSquare size={16} className={currentSessionId === session.id ? "text-primary" : "text-muted-foreground/70"} />
                    <span className="truncate text-[13px]">{session.title || 'Untitled Chat'}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                    <button 
                      onClick={(e) => startEditing(e, session)}
                      className="text-muted-foreground hover:text-primary p-1 rounded-md hover:bg-background/80 transition-colors"
                      title="Rename chat"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        deleteSession(session.id); 
                        if (currentSessionId === session.id) {
                          navigate('/chat');
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-background/80 transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border space-y-1 bg-background/50 backdrop-blur-sm">
        {user?.role === 'admin' && (
          <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate('/admin')}>
            <Settings size={16} />
            <span className="text-sm font-medium">Admin Dashboard</span>
          </Button>
        )}
        <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors" onClick={handleLogout}>
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
