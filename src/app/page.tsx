'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
        if (user) {
            router.replace(user.role === 'policy' ? '/dashboard/policy' : '/dashboard/citizen');
        } else {
            router.replace('/login');
        }
    }
  }, [router, loading, user]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex items-center space-x-2">
        <p className="text-lg font-semibold text-primary">Loading Saaf-Dilli...</p>
      </div>
    </div>
  );
}
