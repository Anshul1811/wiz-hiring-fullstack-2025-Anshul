import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import Dashboard from '../components/Dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Check token presence and validity
  if (!token || !verifyToken(token)) {
    redirect('/login');
  }

  return <Dashboard token={token} />;
}