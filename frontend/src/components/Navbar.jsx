import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary">ImmersiveEstates</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#services" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Services</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">About</a>
            <a href="#contact" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Book a Shoot</a>
          </div>
          <div className="md:hidden flex items-center">
            {/* Mobile menu button would go here */}
            <button className="text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
