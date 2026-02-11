'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, FolderOpen, ShoppingBag, Users, MessageCircle, X } from 'lucide-react';

// Mock notifications for demo (will be replaced by API calls)
const mockNotifications = [
  { id: '1', type: 'message', title: 'Nouveau message', description: 'Pierre Durand vous a envoyé un message', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), link: '/messages' },
  { id: '2', type: 'review', title: 'Nouvel avis', description: 'Un client a laissé un avis sur votre profil', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), link: '/reviews' },
  { id: '3', type: 'project', title: 'Projet mis à jour', description: 'Votre projet « Cuisine moderne » a été publié', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), link: '/projects' },
  { id: '4', type: 'system', title: 'Bienvenue sur MyHouz', description: 'Complétez votre profil pour commencer', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), link: '/profile/edit' },
];

interface Suggestion {
  type: string;
  text: string;
  id: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

const typeIcons: Record<string, React.ReactNode> = {
  project: <FolderOpen className="h-4 w-4 text-blue-500" />,
  product: <ShoppingBag className="h-4 w-4 text-orange-500" />,
  professional: <Users className="h-4 w-4 text-emerald-500" />,
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/projects' },
    { name: 'Produits', href: '/products' },
    { name: 'Professionnels', href: '/professionals' },
    { name: 'Ideabooks', href: '/ideabooks' },
    { name: 'Articles', href: '/articles' },
    { name: 'Forum', href: '/forum' },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search suggestions with debounce
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/search/suggestions?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.data || []);
      }
    } catch {
      // Silently fail - suggestions are optional
      setSuggestions([]);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    setSearchQuery('');
    const typeRoutes: Record<string, string> = {
      project: '/projects/',
      product: '/products/',
      professional: '/professionals/',
    };
    const base = typeRoutes[suggestion.type] || '/search?q=';
    router.push(`${base}${suggestion.id}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MyHouz</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Recherche avec autocomplétion */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </form>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                    >
                      {typeIcons[suggestion.type] || <Search className="h-4 w-4 text-gray-400" />}
                      <span className="text-gray-700 truncate">{suggestion.text}</span>
                      <span className="ml-auto text-xs text-gray-400 capitalize">{suggestion.type}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setShowSuggestions(false);
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-emerald-600 hover:bg-emerald-50 border-t border-gray-100 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Rechercher « {searchQuery} »
                  </button>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Messages */}
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-emerald-600 p-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-gray-700 hover:text-emerald-600 p-2 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown panel */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">
                            Aucune notification
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <Link
                              key={notif.id}
                              href={notif.link}
                              onClick={() => {
                                markNotificationRead(notif.id);
                                setShowNotifications(false);
                              }}
                              className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                                !notif.read ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {!notif.read && (
                                  <span className="mt-1.5 w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                                )}
                                <div className={!notif.read ? '' : 'ml-5'}>
                                  <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
                                  <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="border-t border-gray-100">
                        <Link
                          href="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="block px-4 py-2.5 text-center text-sm text-emerald-600 hover:bg-gray-50 font-medium"
                        >
                          Voir toutes les notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Mon profil
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
                <Link href="/profile" className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-700">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/login?tab=register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/messages"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                    >
                      Messages
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                    >
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/login?tab=register"
                      className="block px-3 py-2 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-md"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}