import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import ListingDetail from './pages/public/ListingDetail';
import SearchResults from './pages/public/SearchResults';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import UsersManager from './pages/admin/UsersManager';
import ListingsManager from './pages/admin/ListingsManager';
import ItinerariesManager from './pages/admin/ItinerariesManager';
import './App.css';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/listings/:travelid" element={<ListingDetail />} />
          
          {/* Auth Routes */}
          <Route path="/user/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/user" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><UsersManager /></ProtectedRoute>} />
          <Route path="/listings" element={<ProtectedRoute><ListingsManager /></ProtectedRoute>} />
          <Route path="/itineraries" element={<ProtectedRoute><ItinerariesManager /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;