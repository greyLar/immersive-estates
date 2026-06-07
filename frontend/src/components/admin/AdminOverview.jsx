import React, { useState, useEffect } from 'react';

const AdminOverview = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading metrics...</div>;

  const cards = [
    { label: 'Total Leads', value: metrics.total_leads, color: 'text-blue-400' },
    { label: 'Hot Leads', value: metrics.hot_leads, color: 'text-red-400' },
    { label: 'Conversion', value: metrics.conversion_rate, color: 'text-green-400' },
    { label: 'Avg Listings', value: metrics.avg_listings_per_lead, color: 'text-[#B8966A]' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => (
        <div key={card.label} className="bg-[#171714] p-6 rounded-lg border border-[#B8966A]/10 shadow-lg">
          <p className="text-sm opacity-60 mb-2 uppercase tracking-wider">{card.label}</p>
          <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminOverview;
