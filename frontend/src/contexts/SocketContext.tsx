'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  onNotification: (handler: (notification: NotificationPayload) => void) => () => void;
  onNotificationCount: (handler: (data: { count: number }) => void) => () => void;
  onNewMessage: (handler: (message: unknown) => void) => () => void;
  onConversationUpdated: (handler: (data: { conversationId: string }) => void) => () => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  emitTyping: (conversationId: string, isTyping: boolean) => void;
}

interface NotificationPayload {
  _id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
  sender?: string;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  onNotification: () => () => {},
  onNotificationCount: () => () => {},
  onNewMessage: () => () => {},
  onConversationUpdated: () => () => {},
  joinConversation: () => {},
  leaveConversation: () => {},
  emitTyping: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    // Extract base URL (remove /api suffix)
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    const socket = io(baseUrl, {
      auth: { token },
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  const onNotification = useCallback((handler: (notification: NotificationPayload) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('notification:new', handler);
    return () => { socket.off('notification:new', handler); };
  }, []);

  const onNotificationCount = useCallback((handler: (data: { count: number }) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('notification:count', handler);
    return () => { socket.off('notification:count', handler); };
  }, []);

  const onNewMessage = useCallback((handler: (message: unknown) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('message:new', handler);
    return () => { socket.off('message:new', handler); };
  }, []);

  const onConversationUpdated = useCallback((handler: (data: { conversationId: string }) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('conversation:updated', handler);
    return () => { socket.off('conversation:updated', handler); };
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join:conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave:conversation', conversationId);
  }, []);

  const emitTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit(isTyping ? 'typing:start' : 'typing:stop', conversationId);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onNotification,
        onNotificationCount,
        onNewMessage,
        onConversationUpdated,
        joinConversation,
        leaveConversation,
        emitTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
