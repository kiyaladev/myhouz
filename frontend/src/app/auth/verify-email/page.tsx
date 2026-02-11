'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant');
        return;
      }

      try {
        const response = await api.post('/users/verify-email', { token });
        if (response.success) {
          setStatus('success');
          setMessage('Votre email a été vérifié avec succès !');
        } else {
          setStatus('error');
          setMessage(response.message || 'Erreur lors de la vérification');
        }
      } catch {
        setStatus('error');
        setMessage('Une erreur est survenue. Le lien peut être expiré ou invalide.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Vérification en cours...
                </h2>
                <p className="text-gray-500">
                  Veuillez patienter pendant que nous vérifions votre email.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Email vérifié !
                </h2>
                <p className="text-gray-500 mb-6">{message}</p>
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => router.push('/auth/login')}
                  >
                    Se connecter
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/')}
                  >
                    Retour à l&apos;accueil
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Échec de la vérification
                </h2>
                <p className="text-gray-500 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link href="/auth/login">
                    <Button className="w-full">
                      Se connecter
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Besoin d&apos;un nouveau lien ?{' '}
                    <Link href="/auth/resend-verification" className="text-emerald-600 hover:underline">
                      Renvoyer l&apos;email de vérification
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </Layout>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
