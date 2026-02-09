// frontend\src\services\api.js


import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

// Create axios instance with base URL
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      console.log('Authentication error, clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect here to avoid conflicts
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  loginModelByCred: async (credentials) => {
    console.log('AuthService: Login attempt with', credentials.email);
    
    // Ensure we're sending the right structure
    const payload = {
      email: credentials.email,
      password: credentials.password
    };
    
    try {
      const response = await api.post('/user/login', payload);
      console.log('AuthService: Login successful', response.data);
      return response;
    } catch (error) {
      console.error('AuthService: Login failed', error);
      throw error;
    }
  },
  
  // logout: () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  // },
  
  // getCurrentUser: () => {
  //   try {
  //     const user = localStorage.getItem('user');
  //     return user ? JSON.parse(user) : null;
  //   } catch (error) {
  //     console.error('Error parsing user from localStorage:', error);
  //     return null;
  //   }
  // }
};

// User services
export const userService = {
  readAllUsers: () => api.get('/user'),
  readUserByUserid: (id) => api.get(`/user/${id}`),
  createUser: (userData) => api.post('/user', userData),
  updateUserByUserid: (id, userData) => api.put(`/user/${id}`, userData),
  dropUserByUserid: (id) => api.delete(`/user/${id}`),
};

// Travel services
export const travelService = {
  readAllTravelListings: async () => {
    console.log('TravelService: Fetching all listings');
    try {
      const response = await api.get('/travel-listings');
      console.log('TravelService: Got', response.data?.length, 'listings');
      return response;
    } catch (error) {
      console.error('TravelService: Error fetching listings', error);
      throw error;
    }
  },
  
  readTravelListingByTravelid: async (travelid) => api.get(`/travel-listings/${travelid}`),
  readItinerariesbyTravelid: async (travelid) => api.get(`/travel-listings/${travelid}/itineraries`),
  
  searchTravelListings: async (query) => {
    console.log('TravelService: Searching for', query);
    try {
      // Try different endpoints based on your backend
      const response = await api.get(`/travel-listings/search?q=${query}`);
      return response;
    } catch (error) {
      console.error('TravelService: Search failed', error);
      // Fallback to client-side filtering
      throw error;
    }
  },
  
};

// Add this new service
export const adminService = {
  // Create travel listing
  createTravelListing: async (listingData) => {
    console.log('AdminService: Creating travel listing', listingData);
    
    try {
      const response = await api.post('/travel-listings', listingData);
      console.log('AdminService: Travel listing created', response.data);
      return response;
    } catch (error) {
      console.error('AdminService: Error creating travel listing', error);
      throw error;
    }
  },

  // Update travel listing
  updateTravelListingByTravelid: async (travelid, listingData) => {
    console.log('AdminService: Updating travel listing', { travelid, listingData });
    
    try {
      const response = await api.put(`/travel-listings/${travelid}`, listingData);
      console.log('AdminService: Travel listing updated', response.data);
      return response;
    } catch (error) {
      console.error('AdminService: Error updating travel listing', error);
      throw error;
    }
  },

  // Delete travel listing
  dropTravelListingByTravelid: async (travelid) => {
    console.log('AdminService: Deleting travel listing', travelid);
    
    try {
      const response = await api.delete(`/travel-listings/${travelid}`);
      console.log('AdminService: Travel listing deleted', response.data);
      return response;
    } catch (error) {
      console.error('AdminService: Error deleting travel listing', error);
      throw error;
    }
  }
};