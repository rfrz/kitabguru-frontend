import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import Sidebar from '../../components/layout/Sidebar';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import MediaButtons from '../../components/chat/MediaButtons';

export default function ChatPage() {
  const { user } = useAuth();
  const { currentSessionId, messages, isLoadingMessages } = useChat();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-14 border-b flex items-center justify-between px-6 bg-white dark:bg-gray-900 z-10">
          <h1 className="font-semibold text-lg">KitabGuru Chat</h1>
          <div className="flex items-center space-x-4">
            {currentSessionId && <MediaButtons sessionId={currentSessionId} />}
            <span className="text-sm text-gray-500">{user?.username}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentSessionId ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Welcome to KitabGuru</h2>
                <p>Select a session or start a new chat to begin asking questions.</p>
              </div>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Send a message to start the conversation!
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
}
