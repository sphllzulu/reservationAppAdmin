// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Edit2, 
//   Trash2, 
//   Plus, 
//   Search 
// } from 'lucide-react';

// const RestaurantAdminManagement = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });

//   // Fetch restaurants
//   const fetchRestaurants = async (page = 1) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('/api/admin/restaurants', {
//         params: { 
//           page, 
//           searchQuery 
//         }
//       });

//       setRestaurants(response.data.restaurants || []);
//       setPagination({
//         currentPage: response.data.currentPage || 1,
//         totalPages: response.data.totalPages || 1
//       });
//     } catch (error) {
//       console.error('Error fetching restaurants', error);
//       setError('Failed to fetch restaurants. Please try again.');
//       setRestaurants([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants();
//   }, [searchQuery]);

//   // Open modal for adding/editing restaurant
//   const openModal = (restaurant = null) => {
//     setSelectedRestaurant(restaurant);
//     setIsModalOpen(true);
//   };

//   // Handle restaurant form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const restaurantData = {
//         name: e.target.name.value,
//         cuisine: e.target.cuisine.value,
//         address: {
//           street: e.target.street.value,
//           city: e.target.city.value,
//           state: e.target.state.value,
//           zipCode: e.target.zipCode.value
//         },
//         contactNumber: e.target.contactNumber.value,
//         email: e.target.email.value,
//         priceRange: parseInt(e.target.priceRange.value),
//         capacity: parseInt(e.target.capacity.value)
//       };

//       if (selectedRestaurant) {
//         // Update existing restaurant
//         await axios.put(`/api/admin/restaurants/${selectedRestaurant._id}`, restaurantData);
//       } else {
//         // Create new restaurant
//         await axios.post('/api/admin/restaurants', restaurantData);
//       }

//       // Refresh restaurants list
//       fetchRestaurants();
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error('Error saving restaurant', error);
//     }
//   };

//   // Delete restaurant
//   const deleteRestaurant = async (restaurantId) => {
//     if (window.confirm('Are you sure you want to delete this restaurant?')) {
//       try {
//         await axios.delete(`/api/admin/restaurants/${restaurantId}`);
//         fetchRestaurants();
//       } catch (error) {
//         console.error('Error deleting restaurant', error);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Restaurant Management</h1>

//       {/* Search and Add Button */}
//       <div className="flex justify-between mb-6">
//         <div className="relative flex-grow mr-4">
//           <input 
//             type="text" 
//             placeholder="Search restaurants..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded pl-10"
//           />
//           <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//         </div>
        
//         <button 
//           onClick={() => openModal()}
//           className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
//         >
//           <Plus className="mr-2" size={20} /> Add Restaurant
//         </button>
//       </div>

//       {/* Restaurants Table */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3 text-left">Cuisine</th>
//               <th className="px-4 py-3 text-left">City</th>
//               <th className="px-4 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {restaurants.map(restaurant => (
//               <tr key={restaurant._id} className="border-b">
//                 <td className="px-4 py-3">{restaurant.name}</td>
//                 <td className="px-4 py-3">{restaurant.cuisine}</td>
//                 <td className="px-4 py-3">{restaurant.address.city}</td>
//                 <td className="px-4 py-3">
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={() => openModal(restaurant)}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       <Edit2 size={20} />
//                     </button>
//                     <button 
//                       onClick={() => deleteRestaurant(restaurant._id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-6 space-x-4">
//         <button 
//           disabled={pagination.currentPage === 1}
//           onClick={() => fetchRestaurants(pagination.currentPage - 1)}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
        
//         <span className="px-4 py-2">
//           Page {pagination.currentPage} of {pagination.totalPages}
//         </span>
        
//         <button 
//           disabled={pagination.currentPage === pagination.totalPages}
//           onClick={() => fetchRestaurants(pagination.currentPage + 1)}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Modal for Add/Edit Restaurant */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-8 rounded-lg w-full max-w-md">
//             <h2 className="text-2xl mb-6">
//               {selectedRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 gap-4">
//                 <input 
//                   type="text" 
//                   name="name" 
//                   placeholder="Restaurant Name" 
//                   defaultValue={selectedRestaurant?.name}
//                   required 
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <input 
//                   type="text" 
//                   name="cuisine" 
//                   placeholder="Cuisine Type" 
//                   defaultValue={selectedRestaurant?.cuisine}
//                   required 
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <input 
//                   type="text" 
//                   name="street" 
//                   placeholder="Street Address" 
//                   defaultValue={selectedRestaurant?.address?.street}
//                   required 
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <div className="grid grid-cols-3 gap-2">
//                   <input 
//                     type="text" 
//                     name="city" 
//                     placeholder="City" 
//                     defaultValue={selectedRestaurant?.address?.city}
//                     required 
//                     className="w-full px-3 py-2 border rounded"
//                   />
//                   <input 
//                     type="text" 
//                     name="state" 
//                     placeholder="State" 
//                     defaultValue={selectedRestaurant?.address?.state}
//                     required 
//                     className="w-full px-3 py-2 border rounded"
//                   />
//                   <input 
//                     type="text" 
//                     name="zipCode" 
//                     placeholder="Zip Code" 
//                     defaultValue={selectedRestaurant?.address?.zipCode}
//                     required 
//                     className="w-full px-3 py-2 border rounded"
//                   />
//                 </div>
//                 <input 
//                   type="tel" 
//                   name="contactNumber" 
//                   placeholder="Contact Number" 
//                   defaultValue={selectedRestaurant?.contactNumber}
//                   required 
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <input 
//                   type="email" 
//                   name="email" 
//                   placeholder="Restaurant Email" 
//                   defaultValue={selectedRestaurant?.email}
//                   required 
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <div className="grid grid-cols-2 gap-2">
//                   <select 
//                     name="priceRange" 
//                     defaultValue={selectedRestaurant?.priceRange || 3}
//                     className="w-full px-3 py-2 border rounded"
//                   >
//                     <option value="1">$ - Budget</option>
//                     <option value="2">$$ - Moderate</option>
//                     <option value="3">$$$ - Upscale</option>
//                     <option value="4">$$$$ - Fine Dining</option>
//                   </select>
//                   <input 
//                     type="number" 
//                     name="capacity" 
//                     placeholder="Restaurant Capacity" 
//                     defaultValue={selectedRestaurant?.capacity}
//                     required 
//                     className="w-full px-3 py-2 border rounded"
//                   />
//                 </div>
                
//                 <div className="flex space-x-4">
//                   <button 
//                     type="submit" 
//                     className="flex-grow bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                   >
//                     {selectedRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
//                   </button>
//                   <button 
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-grow bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantAdminManagement;


// import React, { useState, useEffect } from 'react';
// import { 
//   Container, 
//   Typography, 
//   Grid, 
//   Card, 
//   CardMedia, 
//   CardContent, 
//   CardActions, 
//   Button, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogContentText, 
//   DialogActions 
// } from '@mui/material';
// import axios from 'axios';
// import RestaurantForm from './RestaurantForm'; // Import the form component

// const RestaurantManagement = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   const fetchRestaurants = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/restaurants');
//       setRestaurants(response.data);
//     } catch (error) {
//       console.error('Error fetching restaurants:', error);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const handleDelete = async () => {
//     if (selectedRestaurant) {
//       try {
//         await axios.delete(`http://localhost:3000/api/restaurants/${selectedRestaurant._id}`);
//         fetchRestaurants();
//         setDeleteDialogOpen(false);
//       } catch (error) {
//         console.error('Error deleting restaurant:', error);
//       }
//     }
//   };

//   const confirmDelete = (restaurant) => {
//     setSelectedRestaurant(restaurant);
//     setDeleteDialogOpen(true);
//   };

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ mb: 4 }}>Restaurant Management</Typography>
      
//       <RestaurantForm fetchRestaurants={fetchRestaurants} />

//       <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Existing Restaurants</Typography>
//       <Grid container spacing={3}>
//         {restaurants.map((restaurant) => (
//           <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
//             <Card>
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={restaurant.images[0] }
//                 alt={restaurant.name}
//               />
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   {restaurant.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {restaurant.cuisine} | Rating: {restaurant.rating}/5
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button 
//                   size="small" 
//                   color="primary"
//                   onClick={() => {/* Implement edit functionality */}}
//                 >
//                   Edit
//                 </Button>
//                 <Button 
//                   size="small" 
//                   color="error"
//                   onClick={() => confirmDelete(restaurant)}
//                 >
//                   Delete
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete {selectedRestaurant?.name}?
//             This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default RestaurantManagement;

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions
} from '@mui/material';
import axios from 'axios';
import RestaurantForm from './RestaurantForm'; 

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/restaurants');
      setRestaurants(response.data);
      
    } catch (error) {

      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async () => {
    if (selectedRestaurant) {
      try {
        await axios.delete(`http://localhost:3000/api/restaurants/${selectedRestaurant._id}`);
        fetchRestaurants();
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  const confirmDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditDialogOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>Restaurant Management</Typography>
      
      {/* Add New Restaurant */}
      <RestaurantForm fetchRestaurants={fetchRestaurants} />

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Existing Restaurants</Typography>
      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:3000/${restaurant.images[0]}`}
                alt={restaurant.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.cuisine} | Rating: {restaurant.rating}/5
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleEdit(restaurant)}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => confirmDelete(restaurant)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedRestaurant?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Restaurant</DialogTitle>
        <DialogContent>
          <RestaurantForm 
            fetchRestaurants={fetchRestaurants} 
            restaurant={selectedRestaurant} 
            onClose={() => setEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RestaurantManagement;
