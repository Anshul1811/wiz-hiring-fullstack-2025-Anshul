export const dynamic = 'force-dynamic';


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import Dashboard from '../components/Dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || localStorage.getItem('token'); 

  // Check token presence and validity
  if (!token || !verifyToken(token)) {
     console.log(token, 'This is the token receoved');
    redirect('/login');
  }

  return <Dashboard token={token} />;
}