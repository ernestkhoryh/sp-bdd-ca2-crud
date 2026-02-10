import React, { useState } from 'react';
import ErrorMessage from '../../components/ui/ErrorMessage';

const ListingsManager = () => {
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    duration_days: '',
    rating: ''
  });
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setError('Backend endpoint for travel listings CRUD not yet implemented');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Travel Listings Management</h1>
        <button
          onClick={() => {
            setEditingListing('new');
            setFormData({ title: '', description: '', location: '', price: '', duration_days: '', rating: '' });
          }}
          style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add Listing
        </button>
      </div>

      {editingListing && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>{editingListing === 'new' ? 'Create New Listing' : 'Edit Listing'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label>Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label>Location</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label>Duration (days)</label>
              <input
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', resize: 'vertical' }}
              />
            </div>
            <div>
              <label>Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button onClick={handleSave} style={{ background: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
              Save
            </button>
            <button onClick={() => setEditingListing(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <p>Note: Full CRUD functionality requires admin endpoints in your backend:</p>
        <ul>
          <li>GET /admin/travel-listings</li>
          <li>POST /admin/travel-listings</li>
          <li>PUT /admin/travel-listings/:travelid</li>
          <li>DELETE /admin/travel-listings/:travelid</li>
        </ul>
      </div>
    </div>
  );
};

export default ListingsManager;