'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  if (!token) return null; 

  return <Dashboard token={token} />;
}
