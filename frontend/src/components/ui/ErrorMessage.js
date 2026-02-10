import React from 'react';

const ErrorMessage = ({ error, onRetry }) => (
  <div className="card" style={{ backgroundColor: '#ffebee', borderLeft: '4px solid #f44336', padding: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <span style={{ fontSize: '1.5rem', color: '#f44336' }}>⚠️</span>
      <div>
        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Error</p>
        <p style={{ color: '#666', marginBottom: '1rem' }}>{error.message || error || 'An unexpected error occurred'}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            style={{ 
              background: '#f44336', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ErrorMessage;