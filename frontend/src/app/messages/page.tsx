'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { EmptyState } from '../../components/ui/empty-state';
import { Search, Send, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  userType?: string;
}

interface MessageData {
  _id: string;
  sender: Participant;
  content: string;
  createdAt: string;
  edited?: boolean;
  attachments?: { type: string; url: string; name: string }[];
}

interface ConversationData {
  _id: string;
  participants: Participant[];
  subject: string;
  lastMessage?: { content: string; sender: { firstName: string; lastName: string }; createdAt: string };
  lastActivity: string;
  status: string;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'À l\'instant';
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get current user ID from token
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id || payload.sub);
      }
    } catch { /* not logged in */ }
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get<ConversationData[]>('/messages/conversations');
      if (res.success && res.data) {
        setConversations(res.data);
      }
    } catch {
      // API unavailable - keep current state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Poll for new conversations every 15s
  useEffect(() => {
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  // Load messages when conversation is selected
  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const res = await api.get<{ conversation: ConversationData; messages: MessageData[] }>(
        `/messages/conversations/${conversationId}`
      );
      if (res.success && res.data) {
        setMessages(res.data.messages);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId, loadMessages]);

  // Poll for new messages every 5s when a conversation is selected
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (selectedConversationId) {
      pollRef.current = setInterval(() => {
        loadMessages(selectedConversationId);
      }, 5000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedConversationId, loadMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const otherParticipant = c.participants.find((p) => p._id !== currentUserId);
      const name = otherParticipant
        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase()
        : '';
      return (
        name.includes(query) ||
        c.subject?.toLowerCase().includes(query) ||
        c.lastMessage?.content?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, conversations, currentUserId]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c._id === selectedConversationId) ?? null,
    [selectedConversationId, conversations]
  );

  const getOtherParticipant = (conversation: ConversationData): Participant | undefined => {
    return conversation.participants.find((p) => p._id !== currentUserId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || sending) return;

    setSending(true);
    try {
      const res = await api.post<MessageData>(`/messages/conversations/${selectedConversationId}/messages`, {
        content: newMessage.trim(),
      });
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data!]);
        setNewMessage('');
        loadConversations();
      }
    } catch {
      // Could show error toast
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    api.put(`/messages/conversations/${id}/read`).catch(() => {});
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messagerie</h1>

        <Card className="overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversation list */}
            <div
              className={`w-full md:w-96 md:min-w-[24rem] border-r border-gray-200 flex flex-col ${
                selectedConversationId ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <EmptyState
                    icon={<MessageCircle className="h-8 w-8" />}
                    title={searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                    description={searchQuery ? 'Essayez avec d\'autres termes.' : 'Contactez un professionnel pour démarrer une conversation.'}
                  />
                ) : (
                  filteredConversations.map((conversation) => {
                    const other = getOtherParticipant(conversation);
                    const name = other ? `${other.firstName} ${other.lastName}` : 'Utilisateur';
                    const initials = other ? getInitials(other.firstName, other.lastName) : '?';
                    return (
                      <button
                        key={conversation._id}
                        onClick={() => handleSelectConversation(conversation._id)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                          selectedConversationId === conversation._id
                            ? 'bg-emerald-50 border-l-2 border-l-emerald-600'
                            : ''
                        }`}
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-gray-900 truncate">
                              {name}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(conversation.lastActivity)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {conversation.lastMessage?.content || conversation.subject}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Message view */}
            <div
              className={`flex-1 flex flex-col ${
                selectedConversationId ? 'flex' : 'hidden md:flex'
              }`}
            >
              {selectedConversation ? (
                <>
                  {/* Conversation header */}
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {(() => {
                      const other = getOtherParticipant(selectedConversation);
                      return (
                        <>
                          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                            {other ? getInitials(other.firstName, other.lastName) : '?'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">
                              {other ? `${other.firstName} ${other.lastName}` : 'Utilisateur'}
                            </span>
                            {other?.userType && (
                              <Badge className="ml-2 text-xs" variant="secondary">
                                {other.userType === 'professionnel' ? 'Pro' : 'Particulier'}
                              </Badge>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                      </div>
                    ) : messages.length === 0 ? (
                      <EmptyState
                        icon={<MessageCircle className="h-8 w-8" />}
                        title="Aucun message"
                        description="Envoyez le premier message pour démarrer la conversation."
                      />
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.sender._id === currentUserId;
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                isOwn
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? 'text-emerald-100' : 'text-gray-400'
                                }`}
                              >
                                {formatTime(message.createdAt)}
                                {message.edited && ' (modifié)'}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-gray-200 flex items-center gap-2"
                  >
                    <Input
                      placeholder="Écrire un message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={sending || !newMessage.trim()}
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <EmptyState
                  icon={<MessageCircle className="h-12 w-12" />}
                  title="Aucune conversation sélectionnée"
                  description="Choisissez une conversation dans la liste pour afficher les messages."
                  className="h-full"
                />
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
