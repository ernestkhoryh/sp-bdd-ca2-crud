import api from './axiosConfig';

export const adminService = {
  // Users
  getAllUsers: () => api.get('/user').then(res => res.data),
  getUserByUserid: (userid) => api.get(`/user/${userid}`).then(res => res.data),
  createUser: (userData) => api.post('/user', userData).then(res => res.data),
  updateUser: (userid, userData) => api.put(`/user/${userid}`, userData).then(res => res.data),
  deleteUser: (userid) => api.delete(`/users${userid}`).then(res => res.data),
  
  // Travel Listings
  createTravelListing: (listingData) => api.post('/travel-listings', listingData).then(res => res.data),
  updateTravelListing: (travelid, listingData) => 
    api.put(`/travel-listings/${travelid}`, listingData).then(res => res.data),
  deleteTravelListing: (travelid) => api.delete(`/travel-listings/${travelid}`).then(res => res.data),
  
  // Itineraries
  createItinerary: (travelid, itineraryData) => 
    api.post(`/travel-listings/${travelid}/itineraries`, itineraryData).then(res => res.data),
  updateItinerary: (itineraryid, itineraryData) => 
    api.put(`/itineraries/${itineraryid}`, itineraryData).then(res => res.data),
  deleteItinerary: (itineraryid) => api.delete(`/itineraries/${itineraryid}`).then(res => res.data),

  updateItineraryByItineraryid: async (itineraryId, itineraryData) => {
    console.log('AdminService: Updating itinerary', { itineraryId, itineraryData });
    
    try {
      const response = await api.put(`/itineraries/${itineraryId}`, itineraryData);
      console.log('AdminService: Itinerary updated', response.data);
      return response;
    } catch (error) {
      console.error('AdminService: Error updating itinerary', error);
      throw error;
    }
  },

  dropItineraryByItineraryid: async (itineraryId) => {
    console.log('AdminService: Deleting itinerary', itineraryId);
    
    try {
      const response = await api.delete(`/itineraries/${itineraryId}`);
      console.log('AdminService: Itinerary deleted', response.data);
      return response;
    } catch (error) {
      console.error('AdminService: Error deleting itinerary', error);
      throw error;
    }
    }

};