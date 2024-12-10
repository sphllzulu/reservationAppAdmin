// import React, { useState } from 'react';
// import { Container, TextField, Button, Typography } from '@mui/material';
// import axios from 'axios';

// const RestaurantForm = ({ fetchRestaurants }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     phone: '',
//     cuisine: '',
//     rating: 0,
//     reservations: false,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post('http://localhost:3000/api/restaurants', formData)
//       .then(() => {
//         // fetchRestaurants();
//         setFormData({
//           name: '',
//           address: '',
//           phone: '',
//           cuisine: '',
//           rating: 0,
//           reservations: false,
//         });
//       })
//       .catch(error => console.error('Error creating restaurant:', error));
//   };

//   return (
//     <Container>
//       <Typography variant="h5" sx={{ mb: 2 }}>Add a Restaurant</Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           fullWidth
//           required
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Address"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           fullWidth
//           required
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Phone"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           fullWidth
//           required
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Cuisine"
//           name="cuisine"
//           value={formData.cuisine}
//           onChange={handleChange}
//           fullWidth
//           required
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Rating"
//           name="rating"
//           type="number"
//           value={formData.rating}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//         />
//         <Button type="submit" variant="contained" color="primary">Add Restaurant</Button>
//       </form>
//     </Container>
//   );
// };

// export default RestaurantForm;


import React, { useState,useEffect } from 'react';
import { Container, TextField, Button, Typography, Grid, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantForm = ({ fetchRestaurants, restaurant, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    cuisine: '',
    rating: 0,
    reservations: false,
    pricePerReservation: '',
    dressCode: '',
    description: '',
    menu: [{ name: '', image: '' }],
    images: [],
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate();
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        cuisine: restaurant.cuisine || '',
        rating: restaurant.rating || 0,
        pricePerReservation: restaurant.pricePerReservation || '',
        dressCode: restaurant.dressCode || '',
        description: restaurant.description || '',
        menu: restaurant.menu && restaurant.menu.length > 0 
          ? restaurant.menu 
          : [{ name: '', image: '' }],
        images: [], // Reset images for new upload
      });
    }
  }, [restaurant]);

  const handleMenuChange = (index, field, value) => {
    const updatedMenu = [...formData.menu];
    updatedMenu[index][field] = value;
    setFormData(prevData => ({ ...prevData, menu: updatedMenu }));
  };
  

  const addMenuItem = () => {
    setFormData(prevData => ({ 
      ...prevData, 
      menu: [...prevData.menu, { name: '', image: '' }] 
    }));
  };

  const removeMenuItem = (index) => {
    setFormData(prevData => ({
      ...prevData,
      menu: prevData.menu.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevData => ({ 
      ...prevData, 
      images: [...prevData.images, ...files] 
    }));
  };

// const handleSubmit = (e) => {
//     e.preventDefault();
  
//     const form = new FormData();
//     // Append all text fields
//     Object.keys(formData).forEach(key => {
//       if (key !== 'menu' && key !== 'images') {
//         form.append(key, formData[key]);
//       }
//     });
  
//     // Append menu as stringified JSON
//     form.append('menu', JSON.stringify(formData.menu));
  
//     // Append images
//     formData.images.forEach((image) => {
//       form.append('images', image);
//     });
  
//     axios.post('http://localhost:3000/api/restaurants', form, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//     .then((response) => {
//         navigate('/list');
//     })
//     .catch((error) => {
//       console.error('Error creating restaurant:', error.response?.data || error);
//     });
//   };
const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append all non-file, non-array fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'menu' && key !== 'images') {
        form.append(key, formData[key]);
      }
    });

    // Append menu as stringified JSON
    form.append('menu', JSON.stringify(formData.menu));

    // Append images if there are new images
    formData.images.forEach((image) => {
      form.append('images', image);
    });

    try {
      if (restaurant) {
        // Update existing restaurant
        await axios.put(`http://localhost:3000/api/restaurants/${restaurant._id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Create new restaurant
        await axios.post('http://localhost:3000/api/restaurants', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      // Fetch updated restaurants and close dialog
      fetchRestaurants();
      if (onClose) onClose();
      
      // Optional: show success snackbar
      setSnackbar({ 
        open: true, 
        message: restaurant ? 'Restaurant updated successfully' : 'Restaurant added successfully', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error saving restaurant:', error);
      
      // Show error snackbar
      setSnackbar({ 
        open: true, 
        message: 'Failed to save restaurant', 
        severity: 'error' 
      });
    }
  };

  
  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>Add a Restaurant</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Cuisine"
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Price per Reservation"
          name="pricePerReservation"
          value={formData.pricePerReservation}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Dress Code"
          name="dressCode"
          value={formData.dressCode}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>Menu</Typography>
        {formData.menu.map((item, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={5}>
              <TextField
                label="Dish Name"
                value={item.name}
                onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Dish Image URL"
                value={item.image}
                onChange={(e) => handleMenuChange(index, 'image', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={() => removeMenuItem(index)} color="error" variant="text">Remove</Button>
            </Grid>
          </Grid>
        ))}
        <Button onClick={addMenuItem} variant="outlined" sx={{ mb: 2 }}>Add Dish</Button>
        <Typography variant="h6" sx={{ mb: 1 }}>Images</Typography>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: '16px' }}
        />
        <Grid container spacing={2}>
          {formData.images.map((file, index) => (
            <Grid item xs={4} key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                style={{ width: '100%' }}
              />
            </Grid>
          ))}
        </Grid>
        <Button type="submit" variant="contained" color="primary">Add Restaurant</Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RestaurantForm;
