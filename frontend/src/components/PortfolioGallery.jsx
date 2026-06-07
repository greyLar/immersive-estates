import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const PortfolioGallery = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        setProperties(data.portfolio || []);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center text-[#B8966A]">
      <div className="w-12 h-12 border-4 border-[#B8966A]/20 border-t-[#B8966A] rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-[0.3em] text-xs">Loading Gallery</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F2EDE4] font-sans">
      <div className="pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-[#B8966A] text-sm font-bold uppercase tracking-[0.4em] mb-4">The Collection</h2>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Interactive <br/><span className="text-[#B8966A]">360° Portfolio</span></h1>
          <p className="text-[#F2EDE4]/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Experience the standard of luxury real estate marketing. Our immersive tours provide a true sense of space and flow.
          </p>
          <div className="w-24 h-1 bg-[#B8966A] mx-auto mt-12 opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {properties.map(p => (
            <Link 
              to={`/portfolio/${p.id}`} 
              key={p.id}
              className="bg-[#171714] rounded-3xl border border-[#B8966A]/10 overflow-hidden shadow-2xl hover:border-[#B8966A]/50 transition-all duration-500 group"
            >
              <div className="h-80 overflow-hidden relative">
                {p.thumbnail ? (
                  <img 
                    src={`/uploads/${p.thumbnail}`} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 grayscale-[20%] group-hover:grayscale-0" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#0E0E0E] flex items-center justify-center text-[#B8966A]/10 text-6xl font-black">360</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute top-6 right-6">
                  <div className="bg-[#B8966A] text-[#0E0E0E] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    {p.rooms?.length || 0} Rooms
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 backdrop-blur-[2px]">
                   <div className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs backdrop-blur-xl">
                     View Experience
                   </div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black text-[#F2EDE4] mb-2 group-hover:text-[#B8966A] transition duration-300">{p.title}</h3>
                <p className="text-sm text-[#F2EDE4]/40 flex items-center font-medium">
                  <span className="mr-2 text-[#B8966A]">📍</span> {p.address}
                </p>
                <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#B8966A] group-hover:translate-x-3 transition-transform duration-500">
                  Step Inside <span className="ml-3 text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {properties.length === 0 && (
          <div className="text-center py-24 bg-[#171714] rounded-3xl border border-dashed border-[#B8966A]/20">
            <p className="text-[#F2EDE4]/30 font-bold uppercase tracking-widest">No properties published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioGallery;
