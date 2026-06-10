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
    // Just clear current session to show welcome screen
    loadSession(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r bg-gray-50 dark:bg-gray-800 flex flex-col h-full">
      <div className="p-4 border-b">
        <Button onClick={handleNewChat} className="w-full flex items-center gap-2" variant="default">
          <PlusCircle size={18} />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoadingSessions ? (
          <div className="text-center text-sm text-gray-500 py-4">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">No recent chats</div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                currentSessionId === session.id 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                if (editingId !== session.id) loadSession(session.id);
              }}
            >
              {editingId === session.id ? (
                <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing(e, session.id);
                      if (e.key === 'Escape') cancelEditing(e);
                    }}
                    className="flex-1 bg-white dark:bg-gray-800 text-sm px-2 py-1 rounded border dark:border-gray-600 focus:outline-none"
                  />
                  <button onClick={(e) => saveEditing(e, session.id)} className="text-green-600 p-1"><Check size={14} /></button>
                  <button onClick={cancelEditing} className="text-red-500 p-1"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare size={16} />
                    <span className="truncate text-sm">{session.title || 'Untitled Chat'}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => startEditing(e, session)}
                      className="text-gray-500 hover:text-blue-500 p-1"
                      title="Rename chat"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      className="text-gray-500 hover:text-red-500 p-1"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t space-y-2">
        {user?.role === 'admin' && (
          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 dark:text-gray-300" onClick={() => navigate('/admin')}>
            <Settings size={18} />
            Admin Dashboard
          </Button>
        )}
        <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 dark:text-gray-300" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
