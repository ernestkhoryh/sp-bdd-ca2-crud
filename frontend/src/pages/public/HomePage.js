import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicService } from '../../api/publicService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await publicService.getAllTravelListings();
        console.log('Loaded listings:', data); // Debug log
        setListings(data);
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleListingClick = (travelid) => {
    console.log('Navigating to listing:', travelid); // Debug log
    if (travelid) {
      navigate(`/listings/${travelid}`);
    } else {
      console.error('Invalid travelid:', travelid);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Helper to format price safely
  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return 'N/A';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return 'N/A';
    return num.toFixed(2);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Travel Listings</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            name="search"
            placeholder="Search by description..."
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button
            type="submit"
            style={{ padding: '0.75rem 1.5rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Search
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {listings.map(listing => {
          const priceDisplay = formatPrice(listing.price);
          const travelid = listing.travelid || listing.travelID; // Handle both cases
          
          return (
            <div
              key={travelid || listing.title} // Fallback to title if no ID
              className="card"
              onClick={() => handleListingClick(travelid)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{listing.title || `Listing #${travelid}`}</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                {listing.description?.substring(0, 100)}...
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#2ecc71', fontWeight: 'bold' }}>
                ${priceDisplay}
                <span>⭐ {listing.rating || 'N/A'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;