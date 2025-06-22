'use client';

import Link from 'next/link';
import LogoutClient from './LogoutClient';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

type Event = {
  id: string;
  title: string;
  description: string;
  createdBy: {
    name: string;
    email: string;
  };
  totalSlots: number;
  image?: string | null;
};

const DUMMY_IMAGE = '/dummy.jpg';

export default function Dashboard({ token }: { token: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/events', {
            headers: {
              Cookie: `token=${token}`,
            },
          });
        setEvents(res.data.events || []);
        } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">BookMySlot</h1>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/create-event" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Create Event
              </Link>

              <Link 
                href="/bookings" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                My Bookings
              </Link>

              
              <LogoutClient />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Book and Create your Events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading events...</p>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first event</p>
                <Link 
                  href="/create-event"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="group bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Event Image */}
                      <div className="md:w-48 h-32 relative overflow-hidden">
                        <Link href={`/events/${event.id}`}>
                          <img
                            src={event.image || DUMMY_IMAGE}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                          />
                        </Link>
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Event #{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <Link
                              href={`/events/${event.id}`}
                              className="group-hover:text-blue-600 transition-colors duration-200"
                            >
                              <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                {event.title}
                              </h4>
                            </Link>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          {/* Event Meta */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <span className="mr-1">👤</span>
                                <span>{event.createdBy.name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">🎫</span>
                                <span>{event.totalSlots} slots</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/events/${event.id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}