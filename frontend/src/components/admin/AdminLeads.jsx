import React, { useState, useEffect } from 'react';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchLeads = () => {
    fetch('/api/leads', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      });
  };

  useEffect(fetchLeads, []);

  const handleQualify = async (id) => {
    await fetch(`/api/leads/${id}/qualify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchLeads();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warm': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#171714] rounded-lg border border-[#B8966A]/20 overflow-hidden shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-[#B8966A]/10">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Agent</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Brokerage</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Status</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Vol</th>
            <th className="px-6 py-3 text-sm font-semibold opacity-70">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#B8966A]/10">
          {leads.map(lead => (
            <React.Fragment key={lead.id}>
              <tr 
                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                className="hover:bg-[#B8966A]/5 cursor-pointer transition"
              >
                <td className="px-6 py-4 font-medium">{lead.name}</td>
                <td className="px-6 py-4 opacity-80">{lead.brokerage}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(lead.lead_status)}`}>
                    {lead.lead_status}
                  </span>
                </td>
                <td className="px-6 py-4 opacity-80">{lead.monthly_listings}</td>
                <td className="px-6 py-4 text-xs opacity-60">{lead.lead_source}</td>
              </tr>
              {expanded === lead.id && (
                <tr>
                  <td colSpan="5" className="bg-[#0E0E0E]/50 px-6 py-8 border-y border-[#B8966A]/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs opacity-50 uppercase mb-1">Contact Info</p>
                        <p className="mb-1">📧 {lead.email}</p>
                        <p>📞 {lead.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-50 uppercase mb-1">Internal Notes</p>
                        <textarea 
                          className="w-full bg-[#171714] border border-[#B8966A]/20 rounded p-2 text-sm h-24"
                          defaultValue={lead.notes}
                        ></textarea>
                      </div>
                      <div className="flex flex-col justify-end items-start space-y-4">
                        <button 
                          onClick={() => handleQualify(lead.id)}
                          className="bg-[#B8966A] text-[#0E0E0E] px-4 py-2 rounded font-bold text-sm"
                        >
                          ⚡ Re-Qualify Lead
                        </button>
                        <p className="text-[10px] opacity-40">Created: {new Date(lead.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeads;
