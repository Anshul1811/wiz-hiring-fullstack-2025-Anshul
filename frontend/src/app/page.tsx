import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Dashboard from '../components/Dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  return <Dashboard token={token} />;
}