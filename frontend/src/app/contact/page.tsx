'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
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
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission will be implemented with backend integration
  };

  return (
    <Layout>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Contactez-<span className="text-emerald-600">nous</span>
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Une question, une suggestion ou un partenariat ? Notre équipe est à votre écoute.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="signalement">Signalement</SelectItem>
                          <SelectItem value="partenariat">Partenariat</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        rows={5}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Votre message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-sm text-gray-600">contact@myhouz.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Téléphone</p>
                      <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Adresse</p>
                      <p className="text-sm text-gray-600">12 Rue de la Rénovation<br />75001 Paris, France</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Horaires d&apos;ouverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Lundi – Vendredi : 9h – 18h</p>
                      <p>Samedi : 10h – 16h</p>
                      <p>Dimanche : Fermé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suivez-nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors">
                      <Facebook className="h-5 w-5 text-gray-600 hover:text-emerald-600" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors">
                      <Twitter className="h-5 w-5 text-gray-600 hover:text-emerald-600" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors">
                      <Instagram className="h-5 w-5 text-gray-600 hover:text-emerald-600" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors">
                      <Linkedin className="h-5 w-5 text-gray-600 hover:text-emerald-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
