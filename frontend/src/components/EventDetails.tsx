'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Slot {
  id: number;
  start_time: string;
  max_bookings: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  slots: Slot[];
}

export default function EventDetails({ eventId }: { eventId: number | string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${eventId}`);
        
        if(res.status === 200){
           const { id, title, description, slots } = res.data;
           setEvent({ id, title, description, slots: Array.isArray(slots) ? slots : [] });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return null;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-6">{event.description}</p>

      <h2 className="text-xl font-semibold mb-2">Available Slots</h2>
      <ul>
        {event.slots.map((slot) => (
          <li key={slot.id} className="mb-2">
            {new Date(slot.start_time).toLocaleString()} - Max bookings: {slot.max_bookings}
          </li>
        ))}
      </ul>
    </div>
  );
}
