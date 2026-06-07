import React, { useState, useEffect } from 'react';

const AdminContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchContent = () => {
    fetch('/api/admin/content', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSections(data.sections || []);
        setLoading(false);
      });
  };

  useEffect(fetchContent, []);

  const handleSave = async (section, content) => {
    await fetch(`/api/admin/content/${section}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    alert(`${section} updated!`);
    fetchContent();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      {sections.map(s => (
        <ContentSection 
          key={s.section} 
          section={s.section} 
          initialContent={s.content} 
          onSave={handleSave} 
        />
      ))}
    </div>
  );
};

const ContentSection = ({ section, initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#171714] p-8 rounded-lg border border-[#B8966A]/20 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold uppercase tracking-widest text-[#B8966A]">{section} Section</h3>
        <button 
          onClick={() => onSave(section, content)}
          className="bg-[#B8966A] text-[#0E0E0E] px-6 py-2 rounded font-bold hover:bg-[#D4B68A] transition"
        >
          Save Changes
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 opacity-70 capitalize">{key}</label>
            {typeof value === 'string' && value.length > 50 ? (
              <textarea
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2 h-32"
              />
            ) : (
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full bg-[#0E0E0E] border border-[#B8966A]/30 rounded px-4 py-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
