import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">
                New for Real Estate Agents
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900">Sell Properties Faster with</span>
                <span className="block text-primary">360° Immersive Photo Tours</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Professional 360° photography that puts buyers inside the home. High-end imagery, fast turnaround, and guaranteed to increase listing engagement.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <p className="text-base font-medium text-gray-900">
                Book a professional shoot today and sell faster.
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
                  className="block w-full py-3 text-base rounded-md placeholder-gray-500 shadow-sm focus:ring-secondary focus:border-secondary sm:flex-1 border-gray-300 border px-4 text-gray-900 bg-white"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="mt-3 w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:mt-0 sm:ml-3 sm:flex-shrink-0 sm:inline-flex sm:items-center sm:w-auto"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <img
                  className="w-full h-80 object-cover"
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  alt="Luxury home 360 tour preview"
                />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
                  <svg className="h-20 w-20 text-secondary opacity-90" fill="currentColor" viewBox="0 0 84 84">
                    <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                    <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1274 55.5039 40.3359Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
