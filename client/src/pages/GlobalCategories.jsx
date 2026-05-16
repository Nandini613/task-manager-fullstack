import { useState, useEffect } from 'react';
import api from '../api';

const GlobalCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState('#6366f1');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, colorHex });
      setName('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Global Categories</h1>
        <p className="subtitle">Standardize organization across all projects</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px', maxWidth: '400px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px' }}>Create New Category</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Category Name (e.g. Frontend, Marketing)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="color" 
                value={colorHex} 
                onChange={e => setColorHex(e.target.value)} 
                style={{ padding: '0', width: '50px', height: '40px', cursor: 'pointer', border: 'none', background: 'none' }}
              />
              <span>Select Color</span>
            </div>
            <button type="submit" className="add-btn">Add Category</button>
          </form>
        </div>

        <div style={{ flex: '2', minWidth: '300px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignContent: 'flex-start' }}>
          {categories.map(cat => (
            <div key={cat._id} className="glass-panel" style={{ 
              width: '200px', 
              borderTop: `4px solid ${cat.colorHex}`,
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              gap: '24px'
            }}>
              <h3 style={{ fontSize: '1.1rem' }}>{cat.name}</h3>
              <button 
                onClick={() => handleDelete(cat._id)}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
                  border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={e => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                Delete
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="empty-state" style={{ width: '100%' }}>
              No categories created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCategories;
