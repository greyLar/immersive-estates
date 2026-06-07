import React, { useState, useEffect } from 'react';

const AdminPricing = () => {
  const [tiers, setTiers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchTiers = () => {
    fetch('/api/admin/pricing', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTiers(data.tiers || []);
        setLoading(false);
      });
  };

  useEffect(fetchTiers, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      price: formData.get('price'),
      description: formData.get('description'),
      features: formData.get('features').split(',').map(f => f.trim()),
      featured: formData.get('featured') === 'on',
    };

    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? `/api/admin/pricing/${editing.id}` : '/api/admin/pricing';

    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    setEditing(null);
    fetchTiers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await fetch(`/api/admin/pricing/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTiers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Pricing Tiers</h3>
        <button
          onClick={() => setEditing({})}
          className="bg-[#B8966A] text-[#0E0E0E] px-4 py-2 rounded font-bold"
        >
          + Add Tier
        </button>
      </div>

      <div className="bg-[#171714] rounded-lg border border-[#B8966A]/20 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#B8966A]/10">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold opacity-70">Name</th>
              <th className="px-6 py-3 text-sm font-semibold opacity-70">Price</th>
              <th className="px-6 py-3 text-sm font-semibold opacity-70">Featured</th>
              <th className="px-6 py-3 text-sm font-semibold opacity-70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B8966A]/10">
            {tiers.map(tier => (
              <tr key={tier.id}>
                <td className="px-6 py-4 font-medium">{tier.name}</td>
                <td className="px-6 py-4">{tier.price}</td>
                <td className="px-6 py-4">{tier.featured ? '✅ Yes' : 'No'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setEditing(tier)} className="text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(tier.id)} className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#171714] p-8 rounded-lg border border-[#B8966A]/30 max-w-md w-full">
            <h4 className="text-lg font-bold mb-4">{editing.id ? 'Edit Tier' : 'Add New Tier'}</h4>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" name="name" defaultValue={editing.name} placeholder="Name" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2" required />
              <input type="text" name="price" defaultValue={editing.price} placeholder="Price (e.g. $199)" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2" required />
              <textarea name="description" defaultValue={editing.description} placeholder="Description" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2 h-24"></textarea>
              <input type="text" name="features" defaultValue={tierFeaturesToString(editing.features)} placeholder="Features (comma separated)" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="featured" defaultChecked={editing.featured} />
                <span>Featured Tier</span>
              </label>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 opacity-70">Cancel</button>
                <button type="submit" className="bg-[#B8966A] text-[#0E0E0E] px-6 py-2 rounded font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const tierFeaturesToString = (features) => {
  if (!features) return '';
  if (Array.isArray(features)) return features.join(', ');
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed.join(', ') : '';
  } catch (e) {
    return String(features);
  }
};

export default AdminPricing;
