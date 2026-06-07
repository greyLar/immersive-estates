import React, { useState, useEffect } from 'react';

const Pricing = () => {
  const [tiers, setTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/pricing');
        const data = await response.json();
        if (data.tiers && data.tiers.length > 0) {
          setTiers(data.tiers.map(t => ({
            ...t,
            features: typeof t.features === 'string' ? JSON.parse(t.features) : t.features
          })));
        } else {
          // Fallback if no tiers in DB
          setTiers([
            {
              name: 'Essential 360°',
              price: '$199',
              features: ['5 Immersive 360° Photos', 'Direct File Delivery', 'Zillow/MLS Ready', '24h Turnaround'],
            },
            {
              name: 'Full Immersive Tour',
              price: '$349',
              features: ['15 Immersive 360° Photos', 'Interactive Virtual Tour', 'Embeddable Web Link', 'Floor Plan View', '48h Turnaround'],
              featured: true,
            },
            {
              name: 'Enterprise / Luxury',
              price: 'Call for Pricing',
              features: ['Unlimited 360° Photos', 'Guided Video Tour', 'Branded Agent Page', 'Priority Scheduling', 'Marketing Kit'],
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch pricing:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, []);

  return (
    <div id="pricing" className="bg-[#171714] py-24 border-y border-[#B8966A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#B8966A] text-sm font-bold uppercase tracking-[0.4em] mb-4">Investment</h2>
          <p className="text-4xl font-black text-[#F2EDE4] sm:text-5xl">Simple, Transparent Pricing</p>
          <p className="mt-6 text-[#F2EDE4]/60 text-lg max-w-2xl mx-auto">High-end 360° photography at competitive rates to help you win more listings.</p>
        </div>
        
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 lg:max-w-7xl lg:mx-auto">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-[#B8966A] animate-pulse font-bold tracking-widest">LOADING PLANS...</div>
          ) : tiers.map((tier) => (
            <div key={tier.name} className={`relative flex flex-col rounded-2xl border transition-all duration-500 ${tier.featured ? 'bg-[#1e1e1a] border-[#B8966A] shadow-[0_0_50px_rgba(184,150,106,0.1)] scale-105 z-10' : 'bg-[#0E0E0E] border-white/5 hover:border-[#B8966A]/30'}`}>
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B8966A] text-[#0E0E0E] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="p-10">
                <h3 className="text-sm font-bold text-[#B8966A] uppercase tracking-widest mb-2">{tier.name}</h3>
                <div className="flex items-baseline text-[#F2EDE4]">
                  <span className="text-5xl font-black tracking-tight">{tier.price.startsWith('$') ? tier.price : `$${tier.price}`}</span>
                </div>
                <p className="mt-4 text-xs text-[#F2EDE4]/40 h-8 line-clamp-2">{tier.description || 'Professional photography package'}</p>
                <a
                  href="#contact"
                  className={`mt-10 block w-full py-4 px-4 rounded-xl text-sm font-black text-center transition duration-500 shadow-xl ${tier.featured ? 'bg-[#B8966A] text-[#0E0E0E] hover:bg-[#D4B68A]' : 'bg-[#171714] text-[#F2EDE4] border border-[#B8966A]/20 hover:border-[#B8966A]'}`}
                >
                  Book This Shoot
                </a>
              </div>
              <div className="px-10 pb-10 flex-1">
                <p className="text-[10px] font-bold text-[#F2EDE4]/30 uppercase tracking-widest mb-6">What's included</p>
                <ul className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-[#B8966A]/10 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-[#B8966A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#F2EDE4]/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
