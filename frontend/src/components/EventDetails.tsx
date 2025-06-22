'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  createdBy?: {
    name: string;
    email: string;
  };
  image?: string | null;
}

const DUMMY_IMAGE = '/dummy.jpg';

export default function EventDetails({ eventId }: { eventId: number | string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingMessage, setBookingMessage] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${eventId}`);
        
        if(res.status === 200){
           const { id, title, description, slots, createdBy, image } = res.data;
           setEvent({ 
             id, 
             title, 
             description, 
             slots: Array.isArray(slots) ? slots : [],
             createdBy,
             image
           });
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

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) return;
    
    setBookingStatus('loading');
    
    try {
      const response = await api.post(`/events/${eventId}/bookings`, {
        slotId: selectedSlot
      });
      
      if (response.status === 200 || response.status === 201) {
        setBookingStatus('success');
        setBookingMessage('Thank you for booking! Your seat has been confirmed.');
      }
    } catch (error: any) {
      setBookingStatus('error');
      // Use the exact message from backend
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        setBookingMessage(backendMessage);
      } else {
        setBookingMessage('Something went wrong. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Event</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (bookingStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-white">B</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">BookMySlot</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-8 text-lg">{bookingMessage}</p>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Booking Details</h3>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Event:</span>
                    <span className="font-medium text-green-900">{event?.title}</span>
                  </div>
                  {(() => {
                    const slot = event?.slots.find(s => s.id === selectedSlot);
                    return slot ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-green-700">Date:</span>
                          <span className="font-medium text-green-900">
                            {new Date(slot.start_time).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Time:</span>
                          <span className="font-medium text-green-900">
                            {new Date(slot.start_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Back to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setBookingStatus('idle');
                    setSelectedSlot(null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Book Another Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookingStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-white">B</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">BookMySlot</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Failed</h1>
              <p className="text-gray-600 mb-8 text-lg">{bookingMessage}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-red-800 mb-3">What might have happened?</h3>
                <div className="text-left space-y-2 text-red-700">
                  <p>• The selected time slot may be fully booked</p>
                  <p>• You may have already booked this slot</p>
                  <p>• The event or slot may no longer be available</p>
                  <p>• There might be a network connection issue</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setBookingStatus('idle');
                    setSelectedSlot(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                href="/" 
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={(event?.image) || DUMMY_IMAGE}
              alt={event?.title || 'Event Title Image'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium inline-block mb-3">
                Event Details
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event?.title || 'Untitled Event'}</h1>
              {event && event.createdBy && (
                <div className="flex items-center text-white/90">
                  <span className="mr-1">👤</span>
                  <span className="text-sm">Organized by {event.createdBy.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">{event?.description || 'No description available.'}</p>
            </div>

            {/* Available Slots */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Time Slots</h2>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                  {event?.slots.length || 0} slots available
                </div>
              </div>

              {event?.slots.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No slots available</h3>
                  <p className="text-gray-600">Check back later for new time slots</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {event?.slots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedSlot === slot.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(slot.start_time).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(slot.start_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {slot.max_bookings} spots
                          </p>
                          <p className="text-xs text-gray-500">available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedSlot ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium mb-1">Selected Slot</p>
                    {(() => {
                      const slot = event?.slots.find(s => s.id === selectedSlot);
                      return slot ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(slot.start_time).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(slot.start_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <button
                    onClick={handleBookSlot}
                    disabled={bookingStatus === 'loading'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 shadow-sm flex items-center justify-center"
                  >
                    {bookingStatus === 'loading' ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Booking...
                      </>
                    ) : (
                      'Book This Slot'
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🎫</span>
                  </div>
                  <p className="text-gray-600 text-sm">Select a time slot to continue with booking</p>
                </div>
              )}

              {/* Event Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{event?.slots.length || 0}</p>
                    <p className="text-xs text-gray-600">Total Slots</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {event ? event.slots.reduce((sum, slot) => sum + slot.max_bookings, 0) : 0}
                    </p>
                    <p className="text-xs text-gray-600">Total Capacity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}