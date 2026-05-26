import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Button } from '../ui/button';
import { PlusCircle, MessageSquare, Trash2, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { sessions, currentSessionId, loadSession, createSession, deleteSession, isLoadingSessions } = useChat();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
              onClick={() => loadSession(session.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={16} />
                <span className="truncate text-sm">{session.title || 'Untitled Chat'}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity p-1"
                title="Delete chat"
              >
                <Trash2 size={14} />
              </button>
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
