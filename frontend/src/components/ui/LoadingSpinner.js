import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '2rem',
    minHeight: '200px'
  }}>
    <div style={{ 
      border: '4px solid rgba(0,0,0,0.1)', 
      borderTop: '4px solid #3498db', 
      borderRadius: '50%', 
      width: '40px', 
      height: '40px', 
      animation: 'spin 1s linear infinite' 
    }} />
    <p style={{ marginTop: '1rem', color: '#666' }}>{message}</p>
    
    {/* Inline keyframes animation */}
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;