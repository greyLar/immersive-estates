import React, { useState, useEffect } from 'react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchBookings = () => {
    fetch('/api/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.bookings || []);
        setLoading(false);
      });
  };

  useEffect(fetchBookings, []);

  const handleAction = async (id, action) => {
    await fetch(`/api/bookings/${id}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchBookings();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#171714] rounded-lg border border-[#B8966A]/20 overflow-hidden shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-[#B8966A]/10">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Property Address</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Preferred Date/Time</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Status</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#B8966A]/10">
          {bookings.map(booking => (
            <tr key={booking.id} className="hover:bg-[#B8966A]/5 transition">
              <td className="px-6 py-4 font-medium">{booking.property_address}</td>
              <td className="px-6 py-4 text-sm opacity-80">
                {booking.preferred_date} @ {booking.preferred_time}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  booking.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {booking.status === 'pending' && (
                  <button 
                    onClick={() => handleAction(booking.id, 'confirm')}
                    className="bg-[#B8966A] text-[#0E0E0E] px-3 py-1 rounded text-xs font-bold"
                  >
                    Confirm
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => handleAction(booking.id, 'complete')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
