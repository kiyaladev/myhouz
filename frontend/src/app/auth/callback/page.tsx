'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      router.push(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      // Reload the page to trigger AuthContext to pick up the new token
      window.location.href = '/';
    } else {
      router.push('/auth/login?error=no_token');
    }
  }, [searchParams, router, updateUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
