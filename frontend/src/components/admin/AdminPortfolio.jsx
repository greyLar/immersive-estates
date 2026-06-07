import React, { useState, useEffect, useRef } from 'react';

const AdminPortfolio = () => {
  const [properties, setProperties] = useState([]);
  const [editing, setEditing] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const fileInputRef = useRef(null);
  const roomFileInputRef = useRef(null);

  const fetchPortfolio = () => {
    fetch('/api/admin/portfolio', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProperties(data.portfolio || []);
        setLoading(false);
      });
  };

  useEffect(fetchPortfolio, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      address: formData.get('address'),
      description: formData.get('description'),
      published: formData.get('published') === 'on'
    };

    const res = await fetch('/api/admin/portfolio', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    setEditing(null);
    fetchPortfolio();
  };

  const handleUpdate = async (id, data) => {
    await fetch(`/api/admin/portfolio/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    fetchPortfolio();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    await fetch(`/api/admin/portfolio/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setSelectedProperty(null);
    fetchPortfolio();
  };

  const uploadThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    await fetch(`/api/admin/portfolio/${selectedProperty.id}/thumbnail`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    fetchPortfolio();
  };

  const addRoom = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const roomName = prompt('Room Name? (e.g. Master Bedroom)');
    if (!roomName) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomName', roomName);

    await fetch(`/api/admin/portfolio/${selectedProperty.id}/rooms`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    // Refresh to show new room
    fetchPortfolio();
  };

  const deleteRoom = async (roomIndex) => {
    if (!window.confirm('Delete this room?')) return;
    await fetch(`/api/admin/portfolio/${selectedProperty.id}/rooms/${roomIndex}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPortfolio();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {!selectedProperty ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Portfolio Properties</h3>
            <button
              onClick={() => setEditing({})}
              className="bg-[#B8966A] text-[#0E0E0E] px-4 py-2 rounded font-bold"
            >
              + Add Property
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div 
                key={p.id} 
                className="bg-[#171714] rounded-lg border border-[#B8966A]/20 overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => setSelectedProperty(p)}
              >
                <div className="h-48 bg-[#0E0E0E] relative">
                  {p.thumbnail ? (
                    <img src={`/uploads/${p.thumbnail}`} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-20">No Image</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${p.published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#B8966A] truncate">{p.title}</h4>
                  <p className="text-xs opacity-60 truncate">{p.address}</p>
                  <p className="text-xs mt-2 opacity-40">{p.rooms?.length || 0} Rooms</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedProperty(null)} className="opacity-60 hover:opacity-100 transition">← Back</button>
            <h3 className="text-2xl font-bold text-[#B8966A]">{selectedProperty.title}</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#171714] p-6 rounded-lg border border-[#B8966A]/20">
                <h4 className="text-sm font-bold opacity-60 uppercase mb-4 tracking-wider">Thumbnail</h4>
                <div className="aspect-video bg-[#0E0E0E] rounded border border-[#B8966A]/10 overflow-hidden mb-4 flex items-center justify-center">
                  {selectedProperty.thumbnail ? (
                    <img src={`/uploads/${selectedProperty.thumbnail}`} alt="thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <span className="opacity-20">No Image</span>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full border border-[#B8966A]/30 text-sm py-2 rounded hover:bg-[#B8966A]/10 transition"
                >
                  Change Thumbnail
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={uploadThumbnail} accept="image/*" />
              </div>

              <div className="bg-[#171714] p-6 rounded-lg border border-[#B8966A]/20">
                <h4 className="text-sm font-bold opacity-60 uppercase mb-4 tracking-wider">Property Info</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs opacity-50 mb-1">Status</label>
                    <select 
                      className="w-full bg-[#0E0E0E] border border-[#B8966A]/20 rounded px-2 py-1 text-sm"
                      value={selectedProperty.published ? '1' : '0'}
                      onChange={(e) => handleUpdate(selectedProperty.id, { published: e.target.value === '1' })}
                    >
                      <option value="1">Published</option>
                      <option value="0">Draft</option>
                    </select>
                  </div>
                  <button onClick={() => handleDelete(selectedProperty.id)} className="text-red-400 text-xs hover:underline">Delete Property</button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-[#171714] p-6 rounded-lg border border-[#B8966A]/20">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold opacity-60 uppercase tracking-wider">Rooms (360° Photos)</h4>
                <button 
                  onClick={() => roomFileInputRef.current.click()}
                  className="bg-[#B8966A] text-[#0E0E0E] px-4 py-1 rounded text-xs font-bold"
                >
                  + Add Room
                </button>
                <input type="file" ref={roomFileInputRef} className="hidden" onChange={addRoom} accept="image/*" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProperty.rooms?.map((room, idx) => (
                  <div key={idx} className="bg-[#0E0E0E] rounded border border-[#B8966A]/10 overflow-hidden group">
                    <div className="aspect-video relative">
                      <img src={`/uploads/${room.filename}`} alt={room.name} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => deleteRoom(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{room.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#171714] p-8 rounded-lg border border-[#B8966A]/30 max-w-md w-full">
            <h4 className="text-lg font-bold mb-4">New Property</h4>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" name="title" placeholder="Title" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2" required />
              <input type="text" name="address" placeholder="Address" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2" />
              <textarea name="description" placeholder="Description" className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2 h-24"></textarea>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="published" defaultChecked={true} />
                <span>Publish Immediately</span>
              </label>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 opacity-70">Cancel</button>
                <button type="submit" className="bg-[#B8966A] text-[#0E0E0E] px-6 py-2 rounded font-bold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
