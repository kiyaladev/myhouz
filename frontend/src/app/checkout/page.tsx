'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Truck,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Package,
  Loader2,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const steps = [
  { number: 1, label: 'Adresse', icon: MapPin },
  { number: 2, label: 'Livraison', icon: Truck },
  { number: 3, label: 'Paiement', icon: CreditCard },
];

const shippingOptions = [
  {
    id: 'standard',
    label: 'Standard',
    delay: '5-7 jours ouvrés',
    price: 0,
    priceLabel: 'Gratuit',
  },
  {
    id: 'express',
    label: 'Express',
    delay: '2-3 jours ouvrés',
    price: 9.9,
    priceLabel: '9,90 €',
  },
  {
    id: 'express24',
    label: 'Express 24h',
    delay: '1 jour ouvré',
    price: 14.9,
    priceLabel: '14,90 €',
  },
];

const mockCartItems = [
  { id: 1, name: 'Lampe suspension industrielle', quantity: 1, price: 89.99 },
  { id: 2, name: 'Coussin en lin naturel', quantity: 2, price: 34.5 },
  { id: 3, name: 'Miroir mural rond doré', quantity: 1, price: 129.0 },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#111827',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

function StripeCardForm({ onBack, processing, onProcessing }: {
  onBack: () => void;
  processing: boolean;
  onProcessing: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    onProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onProcessing(false);
      return;
    }

    const { error: stripeError } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || 'Erreur de paiement');
      onProcessing(false);
      return;
    }

    // En production, on enverrait vers l'API backend pour créer une checkout session
    // Pour l'instant, simuler le succès et rediriger
    window.location.href = '/orders/confirmation?demo=true';
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <Label className="block mb-3">Informations de carte bancaire</Label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Paiement sécurisé par Stripe — vos données sont protégées
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={processing}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!stripe || processing}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            'Passer la commande'
          )}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    addressComplement: '',
    postalCode: '',
    city: '',
    country: 'France',
    phone: '',
  });

  const selectedShipping = shippingOptions.find((o) => o.id === shippingMethod) ?? shippingOptions[0];
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedShipping.price;
  const tva = (subtotal + shippingCost) * 0.2;
  const total = subtotal + shippingCost + tva;

  const formatPrice = (n: number) =>
    n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep > step.number
                          ? 'bg-emerald-600 text-white'
                          : currentStep === step.number
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        currentStep >= step.number ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-2 rounded ${
                        currentStep > step.number ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Step 1 — Adresse */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={address.firstName}
                          onChange={handleAddressChange}
                          placeholder="Jean"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={address.lastName}
                          onChange={handleAddressChange}
                          placeholder="Dupont"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={address.address}
                        onChange={handleAddressChange}
                        placeholder="12 rue de la Paix"
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressComplement">
                        Complément d&apos;adresse{' '}
                        <span className="text-gray-400 font-normal">(optionnel)</span>
                      </Label>
                      <Input
                        id="addressComplement"
                        name="addressComplement"
                        value={address.addressComplement}
                        onChange={handleAddressChange}
                        placeholder="Bâtiment, étage, code..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={address.postalCode}
                          onChange={handleAddressChange}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          placeholder="Paris"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          name="country"
                          value={address.country}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={address.phone}
                          onChange={handleAddressChange}
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="sameAsBilling"
                        checked={sameAsBilling}
                        onChange={(e) => setSameAsBilling(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="sameAsBilling" className="font-normal cursor-pointer">
                        Utiliser comme adresse de facturation
                      </Label>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                        Continuer
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2 — Livraison */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-emerald-600" />
                      Mode de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setShippingMethod(option.id)}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          shippingMethod === option.id
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              shippingMethod === option.id
                                ? 'border-emerald-600'
                                : 'border-gray-300'
                            }`}
                          >
                            {shippingMethod === option.id && (
                              <div className="w-3 h-3 rounded-full bg-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.delay}</p>
                          </div>
                        </div>
                        <span
                          className={`font-semibold ${
                            option.price === 0 ? 'text-emerald-600' : 'text-gray-900'
                          }`}
                        >
                          {option.priceLabel}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Retour
                      </Button>
                      <Button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                        Continuer
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3 — Paiement */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      Paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment method selector */}
                    <div className="flex gap-4">
                      {[
                        { id: 'card', label: 'Carte bancaire' },
                        { id: 'paypal', label: 'PayPal' },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex-1 py-3 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                            paymentMethod === method.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'card' && (
                      <Elements stripe={stripePromise}>
                        <StripeCardForm
                          onBack={prevStep}
                          processing={processing}
                          onProcessing={setProcessing}
                        />
                      </Elements>
                    )}

                    {paymentMethod === 'paypal' && (
                      <>
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">
                            Vous serez redirigé vers PayPal pour finaliser votre paiement.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Paiement sécurisé — vos données sont protégées
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button variant="outline" onClick={prevStep}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Retour
                          </Button>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            Passer la commande
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-emerald-600" />
                    Récapitulatif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {mockCartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-500">Qté : {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sous-total</span>
                      <span className="text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Livraison</span>
                      <span className={shippingCost === 0 ? 'text-emerald-600' : 'text-gray-900'}>
                        {shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">TVA (20%)</span>
                      <span className="text-gray-900">{formatPrice(tva)}</span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatPrice(total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
