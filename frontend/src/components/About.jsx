import React from 'react';

const About = () => {
  return (
    <div id="about" className="bg-[#0E0E0E] py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          <div className="relative">
            <h2 className="text-[#B8966A] text-sm font-bold uppercase tracking-[0.4em] mb-4">Our Mission</h2>
            <p className="text-4xl font-black text-[#F2EDE4] sm:text-5xl leading-tight">
              AI-Driven Sales, <br />
              <span className="text-[#B8966A]">Human-Grade Art.</span>
            </p>
            <div className="mt-8 space-y-6 text-lg text-[#F2EDE4]/60 leading-relaxed">
              <p>
                ImmersiveEstates was founded on a simple principle: real estate agents should spend their time closing deals, not hunting for leads or managing photo shoots.
              </p>
              <p>
                Our proprietary AI system works 24/7 to identify high-potential listings and automate the outreach process, while our network of professional photographers captures stunning 360° tours that sell homes faster.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-[#B8966A]/10 pt-10">
              <div>
                <p className="text-3xl font-black text-[#B8966A]">24h</p>
                <p className="text-xs font-bold text-[#F2EDE4]/40 uppercase tracking-widest mt-1">Average Turnaround</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#B8966A]">300%</p>
                <p className="text-xs font-bold text-[#F2EDE4]/40 uppercase tracking-widest mt-1">Engagement Boost</p>
              </div>
            </div>
          </div>
          <div className="mt-16 lg:mt-0 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#B8966A]/20">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Modern office"
                className="w-full h-[500px] object-cover grayscale-[50%] hover:grayscale-0 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0E0E0E] via-transparent to-transparent opacity-60"></div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-8 -left-8 bg-[#171714] p-8 rounded-2xl border border-[#B8966A]/30 shadow-2xl hidden md:block">
              <p className="text-[#B8966A] text-2xl font-black">1,000+</p>
              <p className="text-[#F2EDE4]/40 text-[10px] font-bold uppercase tracking-widest mt-1">Tours Delivered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
