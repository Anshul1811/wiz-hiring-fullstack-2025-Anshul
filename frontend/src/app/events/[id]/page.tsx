import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EventDetails from '../../../components/EventDetails';

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const { id } =  await params; 

  return <EventDetails eventId={id} />;
}
