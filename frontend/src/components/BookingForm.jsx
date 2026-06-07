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
    <div id="contact" className="bg-[#171714] py-24 border-t border-[#B8966A]/10 px-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B8966A] rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[#B8966A] text-sm font-bold uppercase tracking-[0.4em] mb-4">Scheduling</h2>
          <p className="text-4xl font-black text-[#F2EDE4] sm:text-5xl">Book Your Shoot</p>
          <p className="mt-6 text-[#F2EDE4]/60 text-lg">
            Secure your session today. We'll confirm via email within minutes.
          </p>
        </div>

        <div className="bg-[#0E0E0E] rounded-3xl p-8 md:p-12 border border-[#B8966A]/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-10">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300"
                placeholder="john@brokerage.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300"
                placeholder="(555) 000-0000"
              />
            </div>
            <div>
              <label htmlFor="brokerage" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Brokerage</label>
              <input
                type="text"
                name="brokerage"
                id="brokerage"
                required
                value={formData.brokerage}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300"
                placeholder="RE/MAX Elite"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Property Address</label>
              <input
                type="text"
                name="address"
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300"
                placeholder="123 Luxury Lane, San Francisco, CA"
              />
            </div>
            <div>
              <label htmlFor="shootDate" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Preferred Date</label>
              <input
                type="date"
                name="shootDate"
                id="shootDate"
                required
                value={formData.shootDate}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300 [color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="shootTime" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Preferred Time</label>
              <input
                type="time"
                name="shootTime"
                id="shootTime"
                required
                value={formData.shootTime}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300 [color-scheme:dark]"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="instructions" className="block text-[10px] font-bold uppercase tracking-widest text-[#B8966A] mb-2">Access Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                rows="4"
                value={formData.instructions}
                onChange={handleChange}
                className="w-full bg-[#171714] border border-[#B8966A]/20 rounded-xl px-6 py-4 text-[#F2EDE4] focus:border-[#B8966A] outline-none transition duration-300"
                placeholder="Lockbox code, gate instructions, or special requests..."
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#B8966A] text-[#0E0E0E] py-5 rounded-xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#D4B68A] transition duration-500 disabled:opacity-50"
              >
                {status === 'sending' ? 'Processing...' : 'Confirm Shoot Request'}
              </button>
            </div>
          </form>
          {status === 'success' && (
            <div className="mt-8 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-center">
              <p className="text-green-400 font-bold">Booking submitted successfully! We will contact you shortly.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-8 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
              <p className="text-red-400 font-bold">Error submitting booking. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
