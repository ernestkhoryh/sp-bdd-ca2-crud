import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import TravelDropdown from '../components/TravelDropdown';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const TravelSelection = () => {
  const [selectedTravelId, setSelectedTravelId] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [recentSelections, setRecentSelections] = useState([]);

  const handleTravelSelect = (listing) => {
    setSelectedListing(listing);
    
    // Add to recent selections (limit to 5)
    if (listing) {
      setRecentSelections(prev => {
        const filtered = prev.filter(item => 
          (item.travelID || item.id) !== (listing.travelID || listing.id)
        );
        return [listing, ...filtered].slice(0, 5);
      });
    }
  };

  const handleViewItineraries = () => {
    if (selectedTravelId) {
      alert(`View itineraries for Travel ID: ${selectedTravelId}`);
      // In real app: navigate to itineraries page
      // navigate(`/travel/${selectedTravelId}/itineraries`);
    }
  };

  const handleEditTravel = () => {
    if (selectedTravelId) {
      alert(`Edit travel listing: ${selectedTravelId}`);
      // navigate(`/admin/travel/${selectedTravelId}/edit`);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Travel Listings Selector
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Browse and select travel packages by Travel ID
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column - Selection */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TravelExploreIcon />
                Select Travel Listing
              </Typography>
              
              <TravelDropdown
                label="Travel Listing"
                value={selectedTravelId}
                onChange={(e) => setSelectedTravelId(e.target.value)}
                onSelect={handleTravelSelect}
                required
                showSearch={true}
              />
              
              {selectedListing && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Selected Package Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <InfoIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Title:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 3 }}>
                        {selectedListing.title || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Location:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 3 }}>
                        {selectedListing.location || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Duration:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 3 }}>
                        {selectedListing.duration || 'N/A'} days
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AttachMoneyIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Price:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 3 }}>
                        {formatCurrency(selectedListing.price)}
                      </Typography>
                    </Grid>
                    
                    {selectedListing.description && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Description:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="body2">
                            {selectedListing.description}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleViewItineraries}
                      disabled={!selectedTravelId}
                    >
                      View Itineraries
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={handleEditTravel}
                      disabled={!selectedTravelId}
                    >
                      Edit Listing
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Recent & Actions */}
          <Grid item xs={12} md={4}>
            {/* Quick Stats */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => alert('Create new travel listing')}
                >
                  Create New Listing
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => window.location.reload()}
                >
                  Refresh List
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => {
                    setSelectedTravelId('');
                    setSelectedListing(null);
                  }}
                >
                  Clear Selection
                </Button>
              </Box>
            </Paper>

            {/* Recent Selections */}
            {recentSelections.length > 0 && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recently Viewed
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentSelections.map((listing) => {
                    const id = listing.travelID || listing.id;
                    return (
                      <Card key={id} variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box>
                              <Typography variant="subtitle2" noWrap sx={{ maxWidth: 150 }}>
                                {listing.title || 'Untitled'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {id}
                              </Typography>
                            </Box>
                            <Chip 
                              label={listing.location || 'N/A'} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: 0 }}>
                          <Button 
                            size="small" 
                            fullWidth
                            onClick={() => {
                              setSelectedTravelId(id);
                              setSelectedListing(listing);
                            }}
                          >
                            Select
                          </Button>
                        </CardActions>
                      </Card>
                    );
                  })}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Tip:</strong> Use the search bar in the dropdown to quickly find listings by Travel ID, title, or location.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default TravelSelection;