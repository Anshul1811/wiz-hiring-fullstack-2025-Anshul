import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateEventForm from '../../components/CreateEventForm'; // adjust path as needed

export default async function CreateEventPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <CreateEventForm />
    </div>
  );
}