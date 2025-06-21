import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutClient from '../components/LogoutClient';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
        <h2 className="text-xl font-semibold">📅 BookMySlot</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">👤</span>
          <LogoutClient />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>You are authenticated and can access dashboard features here.</p>
      </div>
    </>
  );
}
