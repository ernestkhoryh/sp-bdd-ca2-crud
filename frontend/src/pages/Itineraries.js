import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { travelService } from '../services/api';

const Itineraries = () => {
  const { travelId } = useParams();
  const navigate = useNavigate();
  const [travelListing, setTravelListing] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch travel details
        const travelResponse = await travelService.getListingById(travelId);
        setTravelListing(travelResponse.data);
        
        // Fetch itineraries
        const itinerariesResponse = await travelService.getItineraries(travelId);
        setItineraries(itinerariesResponse.data || []);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load travel details and itineraries.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [travelId]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'Invalid price';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numAmount);
  };

  const handleEditItinerary = (itineraryId) => {
    alert(`Edit itinerary ${itineraryId} for travel ${travelId}`);
    // navigate(`/travel/${travelId}/itinerary/${itineraryId}/edit`);
  };

  const handleDeleteItinerary = (itineraryId) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      alert(`Delete itinerary ${itineraryId}`);
      // Implement delete logic
    }
  };

  const handleAddItinerary = () => {
    alert(`Add new itinerary for travel ${travelId}`);
    // navigate(`/travel/${travelId}/itinerary/new`);
  };

  if (loading && !travelListing) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading travel details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Button component={RouterLink} to="/" color="inherit">
            Home
          </Button>
          <Button component={RouterLink} to="/travel-listings" color="inherit">
            Travel Listings
          </Button>
          <Typography color="text.primary">Itineraries</Typography>
        </Breadcrumbs>

        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/travel-listings')}
          sx={{ mb: 3 }}
        >
          Back to Listings
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Travel Package Header */}
        {travelListing && (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {travelListing.title}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    icon={<PlaceIcon />} 
                    label={travelListing.country || 'Unknown location'} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    icon={<AccessTimeIcon />} 
                    label={travelListing.travelPeriod || 'N/A'} 
                    variant="outlined"
                  />
                  <Chip 
                    icon={<AttachMoneyIcon />} 
                    label={formatCurrency(travelListing.price)} 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {travelListing.description || 'No description available.'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  Travel ID: {travelId}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Itineraries Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Daily Itinerary
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleAddItinerary}
              startIcon={<EditIcon />}
            >
              Add Day
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : itineraries.length === 0 ? (
            <Alert severity="info">
              No itineraries found for this travel package. Add one to get started.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Day</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Activities</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itineraries.map((itinerary) => (
                    <TableRow key={itinerary.id || itinerary.itineraryID} hover>
                      <TableCell>
                        <Chip 
                          icon={<CalendarTodayIcon />}
                          label={itinerary.day || 'Day 1'}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {itinerary.time ? (
                          <Chip 
                            label={itinerary.time}
                            size="small"
                            variant="outlined"
                          />
                        ) : 'Full Day'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {itinerary.title || `Day ${itinerary.day} Activities`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {itinerary.description || 'No description provided'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {itinerary.activities && itinerary.activities.length > 0 ? (
                          <Box sx={{ maxWidth: 300 }}>
                            {itinerary.activities.map((activity, idx) => (
                              <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                                • {activity}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            No activities listed
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            color="primary"
                            size="small"
                            onClick={() => handleEditItinerary(itinerary.id || itinerary.itineraryID)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            size="small"
                            onClick={() => handleDeleteItinerary(itinerary.id || itinerary.itineraryID)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Summary Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Travel Package Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Days
                    </Typography>
                    <Typography variant="h5">
                      {travelListing?.travelPeriod?.match(/\d+/)?.[0] || itineraries.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Itinerary Items
                    </Typography>
                    <Typography variant="h5">
                      {itineraries.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Activities
                    </Typography>
                    <Typography variant="h5">
                      {itineraries.reduce((total, it) => total + (it.activities?.length || 0), 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Package Price
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {formatCurrency(travelListing?.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Itineraries;
