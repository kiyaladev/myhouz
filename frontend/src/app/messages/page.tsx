'use client';

import React, { useState, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { EmptyState } from '../../components/ui/empty-state';
import { Search, Send, MessageCircle, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  userName: string;
  userInitials: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    userName: 'Sophie Dubois',
    userInitials: 'SD',
    lastMessage: 'Bonjour, je suis disponible pour un rendez-vous la semaine prochaine.',
    timestamp: '10:32',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'other', text: 'Bonjour, j\'aimerais discuter de mon projet de rénovation.', timestamp: '09:15', isOwn: false },
      { id: 'm2', senderId: 'me', text: 'Bien sûr ! Pouvez-vous me donner plus de détails sur votre projet ?', timestamp: '09:20', isOwn: true },
      { id: 'm3', senderId: 'other', text: 'Il s\'agit d\'une rénovation complète de ma cuisine, environ 15m².', timestamp: '09:45', isOwn: false },
      { id: 'm4', senderId: 'me', text: 'D\'accord, je peux vous proposer un devis. Quand seriez-vous disponible pour une visite ?', timestamp: '10:00', isOwn: true },
      { id: 'm5', senderId: 'other', text: 'Bonjour, je suis disponible pour un rendez-vous la semaine prochaine.', timestamp: '10:32', isOwn: false },
    ],
  },
  {
    id: 'conv2',
    userName: 'Pierre Martin',
    userInitials: 'PM',
    lastMessage: 'Merci pour le devis, je reviens vers vous rapidement.',
    timestamp: '09:15',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Bonjour Pierre, voici le devis pour les travaux de plomberie.', timestamp: '08:30', isOwn: true },
      { id: 'm2', senderId: 'other', text: 'Merci pour le devis, je reviens vers vous rapidement.', timestamp: '09:15', isOwn: false },
    ],
  },
  {
    id: 'conv3',
    userName: 'Marie Larsson',
    userInitials: 'ML',
    lastMessage: 'Les plans sont prêts, je vous les envoie ce soir.',
    timestamp: 'Hier',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'other', text: 'J\'ai bien reçu les photos de votre jardin.', timestamp: 'Hier 14:00', isOwn: false },
      { id: 'm2', senderId: 'me', text: 'Super, quand pensez-vous avoir les plans ?', timestamp: 'Hier 14:30', isOwn: true },
      { id: 'm3', senderId: 'other', text: 'Les plans sont prêts, je vous les envoie ce soir.', timestamp: 'Hier 18:45', isOwn: false },
    ],
  },
  {
    id: 'conv4',
    userName: 'Thomas Bernard',
    userInitials: 'TB',
    lastMessage: 'Parfait, à lundi alors !',
    timestamp: 'Hier',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Bonjour Thomas, pouvons-nous planifier l\'installation de la cuisine ?', timestamp: 'Hier 10:00', isOwn: true },
      { id: 'm2', senderId: 'other', text: 'Oui, lundi prochain vous conviendrait ?', timestamp: 'Hier 11:00', isOwn: false },
      { id: 'm3', senderId: 'me', text: 'Parfait, à lundi alors !', timestamp: 'Hier 11:15', isOwn: true },
    ],
  },
  {
    id: 'conv5',
    userName: 'Camille Rousseau',
    userInitials: 'CR',
    lastMessage: 'Je vous envoie les échantillons de carrelage demain.',
    timestamp: 'Lun.',
    unreadCount: 3,
    messages: [
      { id: 'm1', senderId: 'other', text: 'Bonjour, suite à notre discussion sur la salle de bain...', timestamp: 'Lun. 09:00', isOwn: false },
      { id: 'm2', senderId: 'me', text: 'Oui, avez-vous trouvé les carreaux dont nous avions parlé ?', timestamp: 'Lun. 10:00', isOwn: true },
      { id: 'm3', senderId: 'other', text: 'Oui ! J\'ai trouvé plusieurs modèles qui pourraient vous plaire.', timestamp: 'Lun. 14:00', isOwn: false },
      { id: 'm4', senderId: 'other', text: 'Je vous envoie les photos pour que vous puissiez choisir.', timestamp: 'Lun. 14:02', isOwn: false },
      { id: 'm5', senderId: 'other', text: 'Je vous envoie les échantillons de carrelage demain.', timestamp: 'Lun. 16:30', isOwn: false },
    ],
  },
  {
    id: 'conv6',
    userName: 'Antoine Lefèvre',
    userInitials: 'AL',
    lastMessage: 'Le chantier avance bien, voici les photos du jour.',
    timestamp: 'Dim.',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'other', text: 'Les travaux de peinture commencent demain matin.', timestamp: 'Sam. 17:00', isOwn: false },
      { id: 'm2', senderId: 'me', text: 'Très bien, quelle couleur avez-vous choisie pour le salon ?', timestamp: 'Sam. 17:30', isOwn: true },
      { id: 'm3', senderId: 'other', text: 'Le blanc cassé comme convenu, avec l\'accent vert sauge sur le mur principal.', timestamp: 'Sam. 18:00', isOwn: false },
      { id: 'm4', senderId: 'other', text: 'Le chantier avance bien, voici les photos du jour.', timestamp: 'Dim. 16:00', isOwn: false },
    ],
  },
  {
    id: 'conv7',
    userName: 'Isabelle Moreau',
    userInitials: 'IM',
    lastMessage: 'Pouvez-vous me rappeler demain matin ?',
    timestamp: '23 mai',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'other', text: 'Bonjour, j\'aurais besoin de conseils pour l\'aménagement de ma terrasse.', timestamp: '23 mai 09:00', isOwn: false },
      { id: 'm2', senderId: 'me', text: 'Avec plaisir ! Quelle est la superficie de votre terrasse ?', timestamp: '23 mai 09:30', isOwn: true },
      { id: 'm3', senderId: 'other', text: 'Environ 25m². Pouvez-vous me rappeler demain matin ?', timestamp: '23 mai 10:00', isOwn: false },
    ],
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return mockConversations;
    const query = searchQuery.toLowerCase();
    return mockConversations.filter(
      (c) =>
        c.userName.toLowerCase().includes(query) ||
        c.lastMessage.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedConversation = useMemo(
    () => mockConversations.find((c) => c.id === selectedConversationId) ?? null,
    [selectedConversationId]
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the API
    setNewMessage('');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messagerie</h1>

        <Card className="overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversation list - hidden on mobile when a conversation is selected */}
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
                {filteredConversations.length === 0 ? (
                  <EmptyState
                    icon={<Search className="h-8 w-8" />}
                    title="Aucune conversation trouvée"
                    description="Essayez avec d'autres termes de recherche."
                  />
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                        selectedConversationId === conversation.id
                          ? 'bg-emerald-50 border-l-2 border-l-emerald-600'
                          : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                        {conversation.userInitials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-900 truncate">
                            {conversation.userName}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 flex-shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </button>
                  ))
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
                    <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                      {selectedConversation.userInitials}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {selectedConversation.userName}
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            message.isOwn
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isOwn ? 'text-emerald-100' : 'text-gray-400'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
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
                    />
                    <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="h-4 w-4" />
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
