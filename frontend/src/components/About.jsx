import React from 'react';

const About = () => {
  return (
    <div id="about" className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-base text-secondary font-semibold tracking-wide uppercase">About Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Excellence in Immersive Real Estate Media
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            ImmersiveEstates was founded with one goal: to help real estate professionals leverage the power of 360° technology to sell homes faster.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900">Innovation</h3>
            <p className="mt-2 text-base text-gray-500">
              We use the latest 360° cameras and AI-powered processing to deliver stunning virtual tours.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900">Efficiency</h3>
            <p className="mt-2 text-base text-gray-500">
              Our 24-hour turnaround means your listing hits the market with professional media faster.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900">Quality</h3>
            <p className="mt-2 text-base text-gray-500">
              Every shoot is vetted for professional lighting, crisp detail, and immersive perspective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
