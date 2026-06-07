import React from 'react';

const Services = () => {
  const services = [
    {
      title: '360° Photography',
      description: 'Ultra-high resolution equirectangular photos that capture every detail of a room.',
      icon: '📸',
    },
    {
      title: 'Virtual Tours',
      description: 'Interactive web-based walkthroughs that allow buyers to navigate from room to room.',
      icon: '🏠',
    },
    {
      title: 'Floor Plan Generation',
      description: 'Accurate 2D and 3D floor plans generated directly from our 360° scan data.',
      icon: '📐',
    },
    {
      title: 'Rapid Delivery',
      description: 'Final processed tours delivered within 24-48 hours of the shoot completion.',
      icon: '⚡',
    },
  ];

  return (
    <div id="services" className="bg-[#171714] py-24 border-y border-[#B8966A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#B8966A] text-sm font-bold uppercase tracking-[0.4em] mb-4">Our Expertise</h2>
          <p className="text-4xl font-black text-[#F2EDE4] sm:text-5xl">Elevate Your Listings</p>
          <div className="w-20 h-1 bg-[#B8966A] mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="text-4xl mb-6 bg-[#0E0E0E] w-20 h-20 rounded-2xl flex items-center justify-center border border-[#B8966A]/20 group-hover:border-[#B8966A] transition duration-500 transform group-hover:-translate-y-2">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#F2EDE4] mb-3 group-hover:text-[#B8966A] transition">{service.title}</h3>
              <p className="text-[#F2EDE4]/60 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
