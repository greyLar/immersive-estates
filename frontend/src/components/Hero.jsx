import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-[#0E0E0E] pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-bold uppercase tracking-[0.3em] text-[#B8966A] sm:text-base lg:text-sm xl:text-base">
                Professional 360° Real Estate Media
              </span>
              <span className="mt-4 block text-5xl tracking-tighter font-black sm:text-6xl xl:text-7xl">
                <span className="block text-[#F2EDE4]">Sell Faster with</span>
                <span className="block text-[#B8966A]">Immersive Tours</span>
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#F2EDE4]/60 sm:mt-8 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
              Step inside the future of real estate marketing. High-end 360° imagery and interactive virtual tours designed to increase listing engagement by up to 300%.
            </p>
            <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <p className="text-sm font-bold text-[#F2EDE4]/40 uppercase tracking-widest mb-4">
                Enter your email for a free quote
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                if (!email) return;
                try {
                  const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, lead_source: 'hero_capture' }),
                  });
                  if (response.ok) {
                    alert('Thanks! We will reach out soon.');
                    e.target.reset();
                  }
                } catch (err) {
                  console.error(err);
                }
              }} className="mt-3 sm:flex">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full py-4 text-base rounded-lg placeholder-[#F2EDE4]/30 shadow-2xl focus:ring-[#B8966A] focus:border-[#B8966A] sm:flex-1 border-[#B8966A]/20 border px-6 text-[#F2EDE4] bg-[#171714] outline-none"
                  placeholder="agent@brokerage.com"
                />
                <button
                  type="submit"
                  className="mt-4 w-full px-8 py-4 border border-transparent text-base font-bold rounded-lg text-[#0E0E0E] bg-[#B8966A] shadow-xl hover:bg-[#D4B68A] focus:outline-none transition sm:mt-0 sm:ml-4 sm:flex-shrink-0 sm:inline-flex sm:items-center sm:w-auto"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
          <div className="mt-16 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md border border-[#B8966A]/10 overflow-hidden group">
              <div className="relative block w-full bg-[#171714] rounded-2xl overflow-hidden focus:outline-none">
                <img
                  className="w-full h-[450px] object-cover grayscale-[30%] group-hover:grayscale-0 transition duration-700 scale-105 group-hover:scale-100"
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  alt="Luxury home 360 tour preview"
                />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20" aria-hidden="true">
                  <div className="w-24 h-24 bg-[#B8966A] rounded-full flex items-center justify-center text-[#0E0E0E] shadow-2xl transform group-hover:scale-110 transition duration-500">
                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Interactive 360° Preview</p>
                  <p className="text-white/60 text-[10px]">1245 Luxury Way, Beverly Hills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-[#B8966A]/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default Hero;
