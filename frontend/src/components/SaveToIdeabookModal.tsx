'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface Ideabook {
  _id: string;
  name: string;
  itemCount?: number;
}

interface SaveToIdeabookModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'project' | 'product';
  itemId: string;
}

export default function SaveToIdeabookModal({
  isOpen,
  onClose,
  itemType,
  itemId,
}: SaveToIdeabookModalProps) {
  const [ideabooks, setIdeabooks] = useState<Ideabook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeabooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Ideabook[]>('/ideabooks');
      if (response.success && response.data) {
        setIdeabooks(response.data);
      }
    } catch {
      setError('Impossible de charger vos carnets.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
      setError(null);
      setNewName('');
      fetchIdeabooks();
    }
  }, [isOpen, fetchIdeabooks]);

  const saveToIdeabook = async (ideabookId: string) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await api.post(`/ideabooks/${ideabookId}/items`, {
        type: itemType,
        itemId,
      });
      if (response.success) {
        setSuccessMessage('Élément enregistré avec succès !');
      } else {
        setError(response.message || 'Erreur lors de l\'enregistrement.');
      }
    } catch {
      setError('Erreur lors de l\'enregistrement.');
    }
  };

  const handleCreateAndSave = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const createResponse = await api.post<Ideabook>('/ideabooks', {
        name: newName.trim(),
        isPublic: false,
      });
      if (createResponse.success && createResponse.data) {
        const newIdeabook = createResponse.data;
        setIdeabooks((prev) => [...prev, newIdeabook]);
        setNewName('');
        await saveToIdeabook(newIdeabook._id);
      } else {
        setError(createResponse.message || 'Erreur lors de la création du carnet.');
      }
    } catch {
      setError('Erreur lors de la création du carnet.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer dans un carnet d&apos;idées</DialogTitle>
          <DialogDescription>
            Choisissez un carnet existant ou créez-en un nouveau.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-gray-500">Chargement de vos carnets...</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {ideabooks.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">
                Vous n&apos;avez pas encore de carnet d&apos;idées.
              </p>
            ) : (
              ideabooks.map((ideabook) => (
                <button
                  key={ideabook._id}
                  onClick={() => saveToIdeabook(ideabook._id)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{ideabook.name}</span>
                  {ideabook.itemCount !== undefined && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({ideabook.itemCount} élément{ideabook.itemCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}

        <div className="border-t pt-4 mt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Créer un nouveau carnet</p>
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du carnet"
              className="flex-1"
            />
            <Button
              onClick={handleCreateAndSave}
              disabled={!newName.trim() || isCreating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isCreating ? 'Création...' : 'Créer et enregistrer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
