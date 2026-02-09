import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import { travelService } from '../services/api';

const ItineraryModal = ({ open, onClose, travelid, travelTitle }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        setError('');
        // FIX: Use the correct API method for itineraries
        const response = await travelService.readItinerariesbyTravelid(travelid);
        
        // Handle different response structures
        if (response && response.data) {
          // Check if data is array or object with data property
          const data = Array.isArray(response.data) 
            ? response.data 
            : (response.data.data || []);
          
          setItineraries(data);
        } else {
          setItineraries([]);
        }
      } catch (err) {
        console.error('Failed to fetch itineraries:', err);
        setError('Failed to load itineraries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (open && travelid) {
      fetchItineraries();
    }
  }, [open, travelid]);

  const handleViewFullDetails = () => {
    onClose();
    // Navigate to full itinerary page
    window.location.href = `/travel/${travelid}/itineraries`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="div">
              {travelTitle || 'Travel Package'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Travel ID: {travelid}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading itineraries...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : itineraries.length === 0 ? (
          <Alert severity="info">
            No itineraries found for this travel package.
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Package Itinerary ({itineraries.length} days)
            </Typography>
            
            <List sx={{ width: '100%' }}>
              {itineraries.map((itinerary, index) => (
                <React.Fragment key={itinerary.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 60 }}>
                      <Chip 
                        icon={<CalendarTodayIcon />}
                        label={itinerary.day}
                        color="primary"
                        size="medium"
                      />
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="div">
                            {itinerary.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {itinerary.time && (
                              <Chip 
                                icon={<AccessTimeIcon />}
                                label={itinerary.time}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {itinerary.location && (
                              <Chip 
                                icon={<PlaceIcon />}
                                label={itinerary.location}
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {itinerary.description}
                          </Typography>
                          
                          {itinerary.activities && itinerary.activities.length > 0 && (
                            <>
                              <Typography variant="subtitle2" color="text.primary" gutterBottom>
                                Activities:
                              </Typography>
                              <Box component="ul" sx={{ pl: 2, mt: 0, mb: 0 }}>
                                {itinerary.activities.map((activity, i) => (
                                  <li key={i}>
                                    <Typography variant="body2" component="span">
                                      • {activity}
                                    </Typography>
                                  </li>
                                ))}
                              </Box>
                            </>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  {index < itineraries.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button 
          onClick={handleViewFullDetails} 
          variant="contained"
          disabled={itineraries.length === 0}
        >
          View Full Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItineraryModal;