import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { publicService } from '../../api/publicService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { Link } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const searchListings = async () => {
      try {
        setLoading(true);
        const data = await publicService.searchTravellistingsByDescriptionSubstring(query);
        setResults(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    searchListings();
  }, [query]);

  if (!query) {
    return (
      <div className="card">
        <p>Please enter a search term</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner message={`Searching for "${query}"...`} />;
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
        <h1>Search Results for "{query}"</h1>
        <p style={{ color: '#666' }}>{results.length} result(s) found</p>
      </div>

      {results.length === 0 ? (
        <div className="card">
          <p>No listings match your search criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {results.map(listing => {
            const priceDisplay = formatPrice(listing.price);
            const travelid = listing.travelid || listing.travelID;
            
            return (
              <Link
                key={travelid || listing.title}
                to={`/listings/${travelid}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card" style={{ cursor: 'pointer' }}>
                  <h3>{listing.title}</h3>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    {listing.description?.substring(0, 100)}...
                  </p>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#2ecc71', fontWeight: 'bold' }}>
                    ${priceDisplay}
                    <span>⭐ {listing.rating || 'N/A'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;