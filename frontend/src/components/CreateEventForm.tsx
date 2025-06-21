'use client';

import { useState } from 'react';
import api from '@/lib/api'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateEventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState([{ start_time: '', max_bookings: 1 }]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSlotChange = (index: number, field: string, value: string | number) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([...slots, { start_time: '', max_bookings: 1 }]);
  };

  const removeSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/events', { title, description, slots, image: imageUrl });
      toast.success('Event created successfully!');
      router.push('/');
    } catch (err: any) {
      console.error('Failed to create event', err);
  
      // Show toast error with message from server if available
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">BookMySlot</h1>
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h2>
          <p className="text-gray-600">Set up your booking event with time slots and details</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Event Details Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-xl font-bold">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter your event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Event Description *
                </label>
                <textarea
                  placeholder="Describe your event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 resize-none"
                  required
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-xl font-bold">🖼️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Event Image</h3>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Event Image
                </label>
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="text-3xl mb-2">📸</span>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                    <p className="text-sm text-blue-600 font-medium">Uploading image...</p>
                  </div>
                )}

                {imageUrl && (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt="Event preview" 
                      className="w-full max-w-md h-48 object-cover rounded-xl shadow-sm" 
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        ✓ Uploaded
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-green-600 text-xl font-bold">⏰</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Time Slots</h3>
                </div>
                <button
                  type="button"
                  onClick={addSlot}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  + Add Slot
                </button>
              </div>

              <div className="space-y-4">
                {slots.map((slot, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Slot #{index + 1}</h4>
                      {slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlot(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Date & Time *
                        </label>
                        <input
                          type="datetime-local"
                          value={slot.start_time}
                          onChange={(e) => handleSlotChange(index, 'start_time', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Max Bookings *
                        </label>
                        <input
                          type="number"
                          value={slot.max_bookings}
                          onChange={(e) => handleSlotChange(index, 'max_bookings', Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          min={1}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={uploading || isSubmitting}
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}