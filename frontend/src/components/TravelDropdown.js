import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { travelService } from '../services/api';

const TravelDropdown = ({ 
  label = "Select Travel Listing",
  value = "",
  onChange,
  required = false,
  disabled = false,
  fullWidth = true,
  showSearch = true,
  onSelect
}) => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = listings.filter(listing =>
        (listing.title && listing.title.toLowerCase().includes(searchLower)) ||
        (listing.location && listing.location.toLowerCase().includes(searchLower)) ||
        (listing.travelid && listing.travelid.toString().includes(searchTerm)) ||
        (listing.description && listing.description.toLowerCase().includes(searchLower))
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  }, [searchTerm, listings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await travelService.readAllTravelListings();
      const data = response.data.data || response.data || [];
      
      // Sort by TravelID
      const sortedData = data.sort((a, b) => {
        if (a.travelid && b.travelid) {
          return a.travelid - b.travelid;
        }
        return 0;
      });
      
      setListings(sortedData);
      setFilteredListings(sortedData);
    } catch (err) {
      console.error('Failed to fetch travel listings:', err);
      setError('Failed to load travel listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedListing = listings.find(listing => 
      listing.travelid === selectedId || listing.id === selectedId
    );
    
    if (onChange) {
      onChange(event);
    }
    
    if (onSelect && selectedListing) {
      onSelect(selectedListing);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getListingDisplay = (listing) => {
    if (!listing) return '';
    
    const id = listing.travelid || listing.id;
    const title = listing.title || 'Untitled';
    const location = listing.location ? ` - ${listing.location}` : '';
    
    return `#${id}: ${title}${location}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={24} />
        <span>Loading travel listings...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormControl 
        fullWidth={fullWidth} 
        required={required} 
        disabled={disabled || loading}
        sx={{ mb: 2 }}
      >
        <InputLabel id="travel-dropdown-label">{label}</InputLabel>
        <Select
          labelId="travel-dropdown-label"
          id="travel-dropdown"
          value={value}
          label={label}
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          
          {showSearch && (
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          )}
          
          {filteredListings.length === 0 ? (
            <MenuItem disabled>
              No listings found
            </MenuItem>
          ) : (
            filteredListings.map((listing) => {
              const id = listing.travelid || listing.id;
              return (
                <MenuItem key={id} value={id}>
                  {getListingDisplay(listing)}
                </MenuItem>
              );
            })
          )}
        </Select>
      </FormControl>
      
      {value && (
        <Box sx={{ 
          mt: 1, 
          p: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          border: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Selected Listing Details:
          </Typography>
          {(() => {
            const selected = listings.find(l => 
              (l.travelid || l.id) === value
            );
            
            if (!selected) return null;
            
            return (
              <Box sx={{ pl: 1 }}>
                <Typography variant="body2">
                  <strong>Title:</strong> {selected.title || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {selected.location || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {selected.duration || 'N/A'} days
                </Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> ${selected.price || 'N/A'}
                </Typography>
                {selected.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Description:</strong> {selected.description.length > 100 
                      ? `${selected.description.substring(0, 100)}...` 
                      : selected.description}
                  </Typography>
                )}
              </Box>
            );
          })()}
        </Box>
      )}
    </Box>
  );
};

export default TravelDropdown;