import React, { useState } from 'react';
import ErrorMessage from '../../components/ui/ErrorMessage';

const ItinerariesManager = () => {
  const [formData, setFormData] = useState({
    travelid: '',
    day_number: '',
    activity: '',
    description: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult({ success: true, message: 'Backend itinerary endpoints not yet implemented' });
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Itineraries Management</h1>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>{formData.itineraryid ? 'Update Itinerary' : 'Create New Itinerary'}</h2>

        {error && <ErrorMessage error={error} />}
        {result && (
          <div style={{ padding: '1rem', backgroundColor: result.success ? '#e8f5e9' : '#ffebee', color: result.success ? '#2e7d32' : '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!formData.itineraryid && (
            <div style={{ marginBottom: '1rem' }}>
              <label>Travel ID</label>
              <input
                type="number"
                value={formData.travelid}
                onChange={(e) => setFormData(prev => ({ ...prev, travelid: e.target.value }))}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label>Day Number</label>
            <input
              type="number"
              value={formData.day_number}
              onChange={(e) => setFormData(prev => ({ ...prev, day_number: e.target.value }))}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Activity</label>
            <input
              value={formData.activity}
              onChange={(e) => setFormData(prev => ({ ...prev, activity: e.target.value }))}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ background: '#3498db', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItinerariesManager;