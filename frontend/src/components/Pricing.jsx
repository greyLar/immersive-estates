import React from 'react';

const Pricing = () => {
  const tiers = [
    {
      name: 'Essential 360°',
      price: 'Starting at $199',
      features: ['5 Immersive 360° Photos', 'Direct File Delivery', 'Zillow/MLS Ready', '24h Turnaround'],
    },
    {
      name: 'Full Immersive Tour',
      price: 'Starting at $349',
      features: ['15 Immersive 360° Photos', 'Interactive Virtual Tour', 'Embeddable Web Link', 'Floor Plan View', '48h Turnaround'],
      featured: true,
    },
    {
      name: 'Enterprise / Luxury',
      price: 'Call for Pricing',
      features: ['Unlimited 360° Photos', 'Guided Video Tour', 'Branded Agent Page', 'Priority Scheduling', 'Marketing Kit'],
    },
  ];

  return (
    <div id="pricing" className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-center">Simple, Professional Pricing</h2>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">High-end 360° photography at competitive rates.</p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {tiers.map((tier) => (
            <div key={tier.name} className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${tier.featured ? 'border-secondary ring-2 ring-secondary' : 'border-gray-200'}`}>
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{tier.name}</h2>
                <p className="mt-4">
                  <span className="text-3xl font-extrabold text-gray-900">{tier.price}</span>
                </p>
                <a
                  href="#contact"
                  className={`mt-8 block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-center text-white ${tier.featured ? 'bg-secondary hover:bg-amber-700' : 'bg-primary hover:bg-blue-900'}`}
                >
                  Book a Shoot
                </a>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide">What's included</h3>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
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
