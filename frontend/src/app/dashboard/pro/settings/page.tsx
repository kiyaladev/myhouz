'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Save,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';

export default function ProSettingsPage() {
  const [companyForm, setCompanyForm] = useState({
    companyName: 'Design & Rénovation SAS',
    siret: '123 456 789 00012',
    description: 'Cabinet d\'architecture d\'intérieur spécialisé dans la rénovation et la décoration haut de gamme.',
    website: 'https://design-renovation.fr',
    phone: '01 23 45 67 89',
    email: 'contact@design-renovation.fr',
  });

  const [addressForm, setAddressForm] = useState({
    street: '15 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    interventionRadius: '50',
  });

  const [services, setServices] = useState([
    'Architecture d\'intérieur',
    'Rénovation complète',
    'Décoration',
    'Aménagement',
  ]);

  const [newService, setNewService] = useState('');

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setServices(services.filter((s) => s !== service));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profil Professionnel</h1>
              <p className="mt-1 text-gray-500">Gérez les informations de votre entreprise</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  Informations de l&apos;entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                    <Input
                      id="companyName"
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siret">SIRET</Label>
                    <Input
                      id="siret"
                      value={companyForm.siret}
                      onChange={(e) => setCompanyForm({ ...companyForm, siret: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="website" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Site web
                    </Label>
                    <Input
                      id="website"
                      value={companyForm.website}
                      onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone" className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Téléphone
                    </Label>
                    <Input
                      id="companyPhone"
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> E-mail pro
                    </Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </CardContent>
            </Card>

            {/* Address & Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Adresse et zone d&apos;intervention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Adresse</Label>
                  <Input
                    id="street"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="radius">Rayon d&apos;intervention (km)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={addressForm.interventionRadius}
                      onChange={(e) => setAddressForm({ ...addressForm, interventionRadius: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Services proposés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                    >
                      {service}
                      <button
                        onClick={() => removeService(service)}
                        className="ml-1 text-emerald-600 hover:text-emerald-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un service..."
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addService()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={addService}
                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                  >
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
