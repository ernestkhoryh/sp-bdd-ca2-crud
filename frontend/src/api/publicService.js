import api from './axiosConfig';

export const publicService = {
  getAllTravelListings: () => api.get('/travel-listings').then(res => res.data),
  
  getTravelListingByTravelid: (travelid) => 
    api.get(`/travel-listings/${travelid}`).then(res => res.data),
  
  searchTravellistingsByDescriptionSubstring: (substring) => 
    api.get(`/travel-listings/search?description=${encodeURIComponent(substring)}`)
      .then(res => res.data),
  
  getItinerariesByTravelid: (travelid) => 
    api.get(`/travel-listings/${travelid}/itineraries`).then(res => res.data)
};