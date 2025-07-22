"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface TutorProfile {
  id: string;
  user: {
    name: string;
  };
  subjects: string[];
  hourlyRate: number;
  bio: string;
  rating: number;
  reviewCount: number;
  availability: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    student: {
      user: {
        name: string;
      };
    };
    createdAt: string;
  }[];
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function TutorDetailPage() {
  const params = useParams();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchTutorDetails();
  }, []);

  const fetchTutorDetails = async () => {
    try {
      const response = await fetch(`/api/tutors/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tutor details');

      const data = await response.json();
      setTutor(data);
    } catch (error) {
      setError('Failed to load tutor details');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimeSlots = (date: Date) => {
    if (!tutor) return [];

    const dayOfWeek = date.getDay();
    const dayAvailability = tutor.availability.filter(
      slot => slot.dayOfWeek === dayOfWeek
    );

    const slots: string[] = [];
    dayAvailability.forEach(availability => {
      const [startHour, startMinute] = availability.startTime.split(':');
      const [endHour, endMinute] = availability.endTime.split(':');
      
      let currentTime = new Date(date);
      currentTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
      
      const endTime = new Date(date);
      endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      while (currentTime < endTime) {
        slots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        currentTime.setMinutes(currentTime.getMinutes() + 60); // 1-hour slots
      }
    });

    return slots;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setBookingError('');
    setBookingSuccess('');
    setIsBooking(true);

    try {
      const [hours, minutes] = selectedTime.split(':');
      const startTime = new Date(selectedDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tutorId: tutor?.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to book session');

      setBookingSuccess('Session booked successfully!');
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      setBookingError('Failed to book session. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !tutor) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error || 'Tutor not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {tutor.user.name}
            </h1>
            <div className="flex items-center text-gray-600">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{tutor.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{tutor.reviewCount} reviews</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${tutor.hourlyRate}/hr
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            About Me
          </h2>
          <p className="text-gray-600 whitespace-pre-line">
            {tutor.bio}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Subjects
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map(subject => (
              <span
                key={subject}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Book a Session
          </h2>

          {bookingError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {bookingError}
            </div>
          )}

          {bookingSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
              {bookingSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate?.toISOString().split('T')[0] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const date = new Date(e.target.value);
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <select
                  value={selectedTime || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(e.target.value)}
                  className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a time</option>
                  {getAvailableTimeSlots(selectedDate).map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Button
            onClick={handleBooking}
            disabled={isBooking}
            className="w-full mt-4"
          >
            {isBooking ? 'Booking...' : 'Book Session'}
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Reviews
          </h2>
          <div className="space-y-4">
            {tutor.reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {review.student.user.name}
                    </span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-gray-600">{review.rating}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}

            {tutor.reviews.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No reviews yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 