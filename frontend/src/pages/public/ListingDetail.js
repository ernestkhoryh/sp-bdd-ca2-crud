import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const ListingDetail = () => {
  const { travelid } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [editData, setEditData] = useState({
    day: '',
    activity: ''
  });
  const [createData, setCreateData] = useState({
    day: '',
    activity: ''
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for edit, 1 for create

  // Helper function for API calls
  const apiCall = async (url, options = {}) => {
    const method = (options.method || 'GET').toLowerCase();
    const requestConfig = {
      url,
      method,
      headers: options.headers || {},
    };

    if (options.body !== undefined) {
      requestConfig.data =
        typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    }
    
    try {
      const response = await api.request(requestConfig);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const statusText = error.response?.statusText || error.message;
      throw new Error(`HTTP error! status: ${status}, message: ${statusText}`);
    }
  };

  useEffect(() => {
    console.log('ListingDetail mounted with travelid:', travelid);
    if (travelid) {
      fetchListingDetails();
    } else {
      console.error('No travelid parameter found in URL');
    }
  }, [travelid]);

  const fetchListingDetails = async () => {
    try {
      console.log('Fetching listing details for travelid:', travelid);
      
      // Fetch the travel listing details
      const listingData = await apiCall(`/travel-listings/${travelid}`);
      console.log('Listing data received:', listingData);
      setListing(listingData);

      // Fetch the itineraries for this travel listing
      const itinerariesData = await apiCall(`/travel-listings/${travelid}/itineraries`);
      console.log('Itineraries data received:', itinerariesData);
      setItineraries(itinerariesData);
    } catch (error) {
      console.error('Error fetching listing details:', error);
      alert(`Error fetching listing details: ${error.message}`);
    }
  };

  const handleItineraryClick = (itinerary) => {
    setSelectedItinerary(itinerary);
    setEditData({
      day: itinerary.day,
      activity: typeof itinerary.activity === 'string' ? itinerary.activity : JSON.stringify(itinerary.activity)
    });
    setActiveTab(0); // Switch to edit tab
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateChange = (field, value) => {
    setCreateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      // Prepare the data in the format your backend expects
      const itineraryData = {
        travelID: selectedItinerary.travelID,
        day: parseInt(editData.day),
        activity: editData.activity
      };

      // Update the itinerary
      await apiCall(`/itineraries/${selectedItinerary.itineraryID}`, {
        method: 'PUT',
        body: JSON.stringify(itineraryData)
      });
      
      // Refresh the itineraries
      const itinerariesData = await apiCall(`/travel-listings/${travelid}/itineraries`);
      setItineraries(itinerariesData);
      
      setEditDialogOpen(false);
      setSelectedItinerary(null);
      setEditData({ day: '', activity: '' });
    } catch (error) {
      console.error('Error updating itinerary:', error);
      alert(`Error updating itinerary: ${error.message}`);
    }
  };

  const handleCreateItinerary = async () => {
    try {
      // Create new itinerary for this travel listing
      const newItineraryData = {
        day: parseInt(createData.day),
        activity: createData.activity
      };

      await apiCall(`/travel-listings/${travelid}/itinerary`, {
        method: 'POST',
        body: JSON.stringify(newItineraryData)
      });
      
      // Refresh the itineraries
      const itinerariesData = await apiCall(`/travel-listings/${travelid}/itineraries`);
      setItineraries(itinerariesData);
      
      setCreateDialogOpen(false);
      setCreateData({ day: '', activity: '' });
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert(`Error creating itinerary: ${error.message}`);
    }
  };

  const handleDelete = async (itineraryID) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await apiCall(`/itineraries/${itineraryID}`, {
          method: 'DELETE'
        });
        
        // Refresh the itineraries
        const itinerariesData = await apiCall(`/travel-listings/${travelid}/itineraries`);
        setItineraries(itinerariesData);
      } catch (error) {
        console.error('Error deleting itinerary:', error);
        alert(`Error deleting itinerary: ${error.message}`);
      }
    }
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setCreateDialogOpen(false);
    setSelectedItinerary(null);
    setEditData({ day: '', activity: '' });
    setCreateData({ day: '', activity: '' });
  };

  if (!travelid) {
    return <div>No listing ID provided in the URL</div>;
  }

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {listing.title}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<CloseIcon />}
            onClick={() => navigate('/')}
          >
            Back to Listings
          </Button>
        </Box>
        
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {listing.country}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {listing.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Itineraries
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              setCreateDialogOpen(true);
              setActiveTab(1); // Switch to create tab
            }}
          >
            Add Itinerary
          </Button>
        </Box>
        
        <List>
          {itineraries.map((itinerary) => (
            <React.Fragment key={itinerary.itineraryID}>
              <ListItem
                disablePadding
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemButton onClick={() => handleItineraryClick(itinerary)}>
                  <ListItemText
                    primary={`Day ${itinerary.day}`}
                    secondary={
                      typeof itinerary.activity === 'string'
                        ? itinerary.activity
                        : JSON.stringify(itinerary.activity)
                    }
                  />
                </ListItemButton>
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItineraryClick(itinerary);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(itinerary.itineraryID);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        
        {itineraries.length === 0 && (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            No itineraries found for this travel listing.
          </Typography>
        )}
      </Paper>

      {/* Edit/Create Itinerary Dialog */}
      <Dialog open={editDialogOpen || createDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editDialogOpen ? `Edit Itinerary - Day ${selectedItinerary?.day}` : 'Create New Itinerary'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Edit" />
            <Tab label="Create" />
          </Tabs>
          
          {activeTab === 0 && editDialogOpen && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Day"
                type="number"
                value={editData.day}
                onChange={(e) => handleEditChange('day', parseInt(e.target.value))}
                margin="normal"
                inputProps={{ min: 1 }}
              />
              <TextField
                fullWidth
                label="Activity"
                multiline
                rows={4}
                value={editData.activity}
                onChange={(e) => handleEditChange('activity', e.target.value)}
                margin="normal"
                helperText="Enter the activity details for this day"
              />
            </Box>
          )}
          
          {activeTab === 1 && createDialogOpen && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Day"
                type="number"
                value={createData.day}
                onChange={(e) => handleCreateChange('day', parseInt(e.target.value))}
                margin="normal"
                inputProps={{ min: 1 }}
                helperText="Day number for this itinerary"
              />
              <TextField
                fullWidth
                label="Activity"
                multiline
                rows={4}
                value={createData.activity}
                onChange={(e) => handleCreateChange('activity', e.target.value)}
                margin="normal"
                helperText="Enter the activity details for this day"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {activeTab === 0 && editDialogOpen && (
            <Button 
              onClick={handleSaveEdit} 
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          )}
          {activeTab === 1 && createDialogOpen && (
            <Button 
              onClick={handleCreateItinerary} 
              variant="contained"
              color="primary"
            >
              Create Itinerary
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListingDetail;
