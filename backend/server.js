

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const cors = require('cors');
// const User = require('./models/admin');
// const Restaurant=require('./models/restaurant')
// const restaurantRouter = express.Router();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(async () => {
//   console.log('MongoDB connected successfully');
  
//   // Create admin user if not exists
//   await User.createAdminIfNotExists();
// })
// .catch(err => console.error('MongoDB connection error:', err));

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173', 
//   credentials: true
// }));
// app.use(express.json());

// // Session Configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_very_secret_key',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI,
//     collectionName: 'sessions'
//   }),
//   cookie: {
//     secure: process.env.NODE_ENV === 'production', 
//     maxAge: 1000 * 60 * 60 * 24 // 24 hours
//   }
// }));

// // Authentication Routes
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check if user is admin
//     if (user.role !== 'ADMIN') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Create session
//     req.session.userId = user._id;

//     res.json({ 
//       message: 'Admin login successful',
//       user: { 
//         id: user._id, 
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during login', error: error.message });
//   }
// });

// // Admin-specific route to get user information
// app.get('/api/admin/users', async (req, res) => {
//   try {
//     // Ensure only admin can access this route
//     if (!req.session.userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const admin = await User.findById(req.session.userId);
//     if (!admin || admin.role !== 'ADMIN') {
//       return res.status(403).json({ message: 'Admin access required' });
//     }

//     // Fetch all users (excluding passwords)
//     const users = await User.find({}).select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// });


//   // POST a new restaurant
// restaurantRouter.post('/', async (req, res) => {
//     try {
//         const newRestaurant = new Restaurant(req.body);
//         const savedRestaurant = await newRestaurant.save();
//         res.status(201).json(savedRestaurant);
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating restaurant', error: error.message });
//     }
// });

// // GET all restaurants
// restaurantRouter.get('/', async (req, res) => {
//     try {
//         const restaurants = await Restaurant.find();
//         res.json(restaurants);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
//     }
// });

// // GET a restaurant by ID
// restaurantRouter.get('/:id', async (req, res) => {
//     try {
//         const restaurant = await Restaurant.findById(req.params.id);
//         if (!restaurant) {
//             return res.status(404).json({ message: 'Restaurant not found' });
//         }
//         res.json(restaurant);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
//     }
// });

// // Update a restaurant by ID
// restaurantRouter.put('/:id', async (req, res) => {
//     try {
//         const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });
//         if (!updatedRestaurant) {
//             return res.status(404).json({ message: 'Restaurant not found' });
//         }
//         res.json(updatedRestaurant);
//     } catch (error) {
//         res.status(400).json({ message: 'Error updating restaurant', error: error.message });
//     }
// });

// // Delete a restaurant by ID
// restaurantRouter.delete('/:id', async (req, res) => {
//     try {
//         const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
//         if (!deletedRestaurant) {
//             return res.status(404).json({ message: 'Restaurant not found' });
//         }
//         res.json({ message: 'Restaurant deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
//     }
// });

// // Mount the router
// app.use('/api/restaurants', restaurantRouter);




// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const User = require('./models/admin');
const Restaurant = require('./models/restaurant');

const app = express();
const PORT = process.env.PORT || 5000;


const fs = require('fs');


// Before your multer configuration
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Create admin user if not exists
    await User.createAdminIfNotExists();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_very_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.session.userId = user._id;
    res.json({
      message: 'Admin login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Admin-specific route to get user information
app.get('/api/admin/users', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const admin = await User.findById(req.session.userId);
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Restaurant Routes
const restaurantRouter = express.Router();

// POST a new restaurant with images
// restaurantRouter.post('/', upload.array('images', 10), async (req, res) => {
//   try {
//     const imagePaths = req.files.map(file => file.path); // Get paths of uploaded images
//     const restaurantData = {
//       ...req.body,
//       images: imagePaths // Save image paths in the restaurant
//     };

//     const newRestaurant = new Restaurant(restaurantData);
//     const savedRestaurant = await newRestaurant.save();
//     res.status(201).json(savedRestaurant);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating restaurant', error: error.message });
//   }
// });
restaurantRouter.post('/', upload.array('images', 10), async (req, res) => {
    try {
      const imagePaths = req.files.map(file => file.path);
      
      // Parse menu from body
      const menu = req.body.menu ? JSON.parse(req.body.menu) : [];
  
      const restaurantData = {
        ...req.body,
        menu: menu.map(item => ({
          name: item.name,
          image: item.image
        })),
        images: imagePaths
      };
  
      const newRestaurant = new Restaurant(restaurantData);
      const savedRestaurant = await newRestaurant.save();
      res.status(201).json(savedRestaurant);
    } catch (error) {
      console.error('Restaurant creation error:', error);
      res.status(400).json({ 
        message: 'Error creating restaurant', 
        error: error.message 
      });
    }
  });

// GET all restaurants
restaurantRouter.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
});

// GET a restaurant by ID
restaurantRouter.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
});

// Update a restaurant by ID
restaurantRouter.put('/:id', upload.array('images', 10), async (req, res) => {
    try {
      const imagePaths = req.files ? req.files.map(file => file.path) : [];
      
      // Parse menu from body
      const menu = req.body.menu ? JSON.parse(req.body.menu) : [];
  
      const restaurantData = {
        ...req.body,
        menu: menu.map(item => ({
          name: item.name,
          image: item.image
        })),
        images: imagePaths.length > 0 ? imagePaths : undefined
      };
  
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.params.id, 
        restaurantData, 
        {
          new: true,
          runValidators: true,
        }
      );
  
      if (!updatedRestaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(updatedRestaurant);
    } catch (error) {
      console.error('Restaurant update error:', error);
      res.status(400).json({ 
        message: 'Error updating restaurant', 
        error: error.message 
      });
    }
  });

// Delete a restaurant by ID
restaurantRouter.delete('/:id', async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
  }
});

// Mount the router
app.use('/api/restaurants', restaurantRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
