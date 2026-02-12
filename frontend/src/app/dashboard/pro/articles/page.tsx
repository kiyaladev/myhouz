'use client';

import React, { useState } from 'react';
import Layout from '../../../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichEditor } from '@/components/ui/rich-editor';
import { FileText, Save, X } from 'lucide-react';

const categories = [
  { value: 'conseils', label: 'Conseils' },
  { value: 'tendances', label: 'Tendances' },
  { value: 'guides', label: 'Guides' },
  { value: 'interviews', label: 'Interviews' },
  { value: 'actualites', label: 'Actualités' },
  { value: 'diy', label: 'DIY' },
];

export default function ArticlesPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simule une sauvegarde
    setTimeout(() => {
      setIsSaving(false);
      alert('Article sauvegardé avec succès ! (simulation)');
    }, 1000);
  };

  const handleReset = () => {
    setTitle('');
    setCategory('');
    setTags('');
    setContent('');
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Rédiger un article</h1>
            <p className="text-sm text-muted-foreground">
              Partagez votre expertise avec la communauté MyHouz
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Nouvel article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l&apos;article</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : 10 astuces pour rénover votre cuisine"
                  required
                />
              </div>

              {/* Catégorie et Tags */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Ex : rénovation, cuisine, design"
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparez les tags par des virgules
                  </p>
                </div>
              </div>

              {/* Éditeur de contenu */}
              <div className="space-y-2">
                <Label>Contenu</Label>
                <RichEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Rédigez votre article ici..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Sauvegarde...' : 'Publier l\'article'}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  <X className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
}
