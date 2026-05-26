import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/chat';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await chatApi.getSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const loadSession = useCallback(async (sessionId) => {
    if (!sessionId) return;
    setIsLoadingMessages(true);
    setCurrentSessionId(sessionId);
    try {
      const data = await chatApi.getSession(sessionId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createSession = async (title = 'New Chat') => {
    try {
      const data = await chatApi.createSession(title);
      setSessions([data, ...sessions]);
      setCurrentSessionId(data.id);
      setMessages([]);
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await chatApi.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const sendMessage = async (content, bookFilter = null) => {
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = await createSession(content.slice(0, 40));
      sessionId = newSession.id;
    }

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const newUserMsg = { id: tempId, role: 'user', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, newUserMsg]);
    setIsSending(true);

    try {
      const data = await chatApi.sendMessage(sessionId, content, bookFilter);
      // Replace temp message and add AI response
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        data.user_message,
        data.ai_message
      ]);
      
      // Update session title locally if it was the first message
      if (messages.length === 0) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: content.slice(0, 80) } : s));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <ChatContext.Provider 
      value={{ 
        sessions, 
        currentSessionId, 
        messages, 
        isLoadingSessions, 
        isLoadingMessages, 
        isSending,
        loadSession,
        createSession,
        deleteSession,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
