import React, { useState, useEffect } from 'react';
import { ExternalLink, Home, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        setProperties(data.portfolio || []);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (!isLoading && properties.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 bg-[#0E0E0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[#B8966A] text-sm font-bold uppercase tracking-[0.4em] mb-4 text-left">The Showcase</h2>
            <p className="text-4xl font-black text-[#F2EDE4] sm:text-5xl">Featured Properties</p>
            <p className="mt-6 text-[#F2EDE4]/60 text-lg leading-relaxed">
              Step inside our latest immersive 360° captures. Experience the true sense of space and luxury through our interactive viewer.
            </p>
          </div>
          <button 
            onClick={() => navigate('/portfolio')}
            className="text-[#B8966A] font-bold uppercase tracking-widest text-xs border-b-2 border-[#B8966A]/20 pb-1 hover:border-[#B8966A] transition"
          >
            View Entire Gallery →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-[#171714] rounded-2xl h-96 border border-[#B8966A]/10"></div>
            ))
          ) : properties.slice(0, 3).map((property) => (
            <div 
              key={property.id} 
              className="bg-[#171714] rounded-2xl overflow-hidden border border-[#B8966A]/10 hover:border-[#B8966A]/40 transition group cursor-pointer shadow-2xl"
              onClick={() => navigate(`/portfolio/${property.id}`)}
            >
              <div className="relative h-64 overflow-hidden">
                {property.thumbnail ? (
                  <img 
                    src={`/uploads/${property.thumbnail}`} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0E0E0E] flex items-center justify-center text-[#B8966A]/20">
                    <Home size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 backdrop-blur-[2px]">
                  <div className="bg-[#B8966A] text-[#0E0E0E] px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition duration-500">
                    Enter Tour <ExternalLink size={16} />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-[#B8966A] text-[#0E0E0E] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  360° Scan
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-[#F2EDE4] mb-2 group-hover:text-[#B8966A] transition">{property.title}</h3>
                <div className="flex items-center text-[#F2EDE4]/40 text-sm">
                  <MapPin size={14} className="mr-2 text-[#B8966A]" />
                  {property.address}
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#F2EDE4]/30 uppercase tracking-widest">{property.rooms?.length || 0} Interactive Rooms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
