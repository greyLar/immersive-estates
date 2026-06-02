import React, { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brokerage: '',
    address: '',
    shootDate: '',
    shootTime: '',
    instructions: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // 1. Create or get lead first
      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          brokerage: formData.brokerage,
          lead_source: 'booking_form'
        }),
      });

      const leadData = await leadResponse.json();
      if (!leadData.success) {
        throw new Error('Failed to create lead');
      }

      const leadId = leadData.lead.id;

      // 2. Create booking with leadId
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          property_address: formData.address,
          access_instructions: formData.instructions,
          preferred_date: formData.shootDate,
          preferred_time: formData.shootTime,
        }),
      });

      const bookingData = await bookingResponse.json();
      if (bookingData.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          brokerage: '',
          address: '',
          shootDate: '',
          shootTime: '',
          instructions: '',
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setStatus('error');
    }
  };

  return (
    <div id="contact" className="bg-gray-50 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24 border-t border-gray-200">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Book Your Shoot</h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            Fill out the form below and we'll confirm your booking within the hour.
          </p>
        </div>
        <div className="mt-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="brokerage" className="block text-sm font-medium text-gray-700">Brokerage</label>
              <input
                type="text"
                name="brokerage"
                id="brokerage"
                required
                value={formData.brokerage}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Property Address</label>
              <input
                type="text"
                name="address"
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="shootDate" className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <input
                type="date"
                name="shootDate"
                id="shootDate"
                required
                value={formData.shootDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="shootTime" className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <input
                type="time"
                name="shootTime"
                id="shootTime"
                required
                value={formData.shootTime}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Access Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                rows="4"
                value={formData.instructions}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary border px-4 py-2 outline-none text-gray-900 bg-white"
                placeholder="Lockbox code, gate instructions, etc."
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition"
              >
                {status === 'sending' ? 'Sending...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
          {status === 'success' && (
            <p className="mt-4 text-center text-green-600 font-medium">Booking submitted successfully! We will contact you shortly.</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-center text-red-600 font-medium">There was an error submitting your booking. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
