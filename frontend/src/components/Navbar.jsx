import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#171714] border-b border-[#B8966A]/20 fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#B8966A] tracking-tighter">ImmersiveEstates</Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/#services" className="text-[#F2EDE4]/70 hover:text-[#B8966A] px-3 py-2 text-sm font-medium transition">Services</a>
            <Link to="/portfolio" className="text-[#F2EDE4]/70 hover:text-[#B8966A] px-3 py-2 text-sm font-medium transition">Portfolio</Link>
            <a href="/#pricing" className="text-[#F2EDE4]/70 hover:text-[#B8966A] px-3 py-2 text-sm font-medium transition">Pricing</a>
            <a href="/#about" className="text-[#F2EDE4]/70 hover:text-[#B8966A] px-3 py-2 text-sm font-medium transition">About</a>
            <a href="/#contact" className="bg-[#B8966A] text-[#0E0E0E] px-4 py-2 rounded font-bold text-sm hover:bg-[#D4B68A] transition">Book a Shoot</a>
          </div>
          <div className="md:hidden flex items-center">
            <button className="text-[#F2EDE4]">
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
