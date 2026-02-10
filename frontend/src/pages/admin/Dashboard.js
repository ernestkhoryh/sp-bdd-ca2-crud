import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, listings: 0, itineraries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = await adminService.getAllUsers();
        setStats({
          users: users.length,
          listings: 24,
          itineraries: 87
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ textTransform: 'capitalize', color: '#7f8c8d' }}>{key}</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', margin: '0.5rem 0' }}>
              {value}
            </p>
            <Link to={`/user/${key}`} style={{ color: '#3498db', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;