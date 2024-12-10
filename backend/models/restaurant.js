// const mongoose = require('mongoose');

// const restaurantSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   images: [String],
//   menuUrl: String,
//   rating: Number,
//   reviews: [
//     {
//       user: String,
//       rating: Number,
//       date: Date,
//       comment: String,
//     },
//   ],
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String,
//     country: String,
//   },
//   contact: {
//     phone: String,
//     email: String,
//   },
//   operatingHours: Object,
//   cuisine: String,
//   priceRange: String,
//   location: {
//     latitude: Number,
//     longitude: Number,
//   },
//   amenities: [String],
//   reservationsAvailable: Boolean,
// });

// module.exports = mongoose.model('Restaurant', restaurantSchema);


// const mongoose = require('mongoose');

// const RestaurantSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   images: [String],
//   cuisine: {
//     type: String,
//     required: true,
//     trim: true
//   },  

//   address: {
//     street: {
//       type: String,
//       required: true
//     },
//     city: {
//       type: String,
//       required: true
//     },
//     state: {
//       type: String,
//       required: true
//     },
//     zipCode: {
//       type: String,
//       required: true
//     }
//   },
//   contactNumber: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   openingHours: {
//     monday: String,
//     tuesday: String,
//     wednesday: String,
//     thursday: String,
//     friday: String,
//     saturday: String,
//     sunday: String
//   },
//   priceRange: {
//     type: Number,
//     min: 1,
//     max: 5,
//     default: 3
//   },
//   rating: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0
//   },
//   reviews: [
//     {
//       user: String,
//       rating: Number,
//       date: Date,
//       comment: String,
//     },
//   ],
//   capacity: {
//     type: Number,
//     required: true
//   },
//   amenities: [{
//     type: String,
//     enum: [
//       'WiFi', 
//       'Parking', 
//       'Outdoor Seating', 
//       'Delivery', 
//       'Takeout', 
//       'Wheelchair Accessible', 
//       'Vegetarian Options', 
//       'Vegan Options'
//     ]
//   }],
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Restaurant', RestaurantSchema);

// const mongoose = require('mongoose');

// const RestaurantSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   cuisine: {
//     type: String,
//     required: true,
//   },
//   menu: [String],
//   rating: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0,
//   },
//     reviews: [
//         {
//           user: String,
//           rating: Number,
//           date: Date,
//           comment: String,
//         },
//       ],
//   images: {
//     type: [String], 
//   },
  
//   amenities: [{
//         type: String,
//         enum: [
//           'WiFi', 
//           'Parking', 
//           'Outdoor Seating', 
//           'Delivery', 
//           'Takeout', 
//           'Wheelchair Accessible', 
//           'Vegetarian Options', 
//           'Vegan Options'
//         ]
//       }],
//   reservations: {
//     type: Boolean,
//     default: false, 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Restaurant', RestaurantSchema);


const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  menu: [{
    name: { type: String, required: true },
    image: { type: String } 
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [
    {
      user: { type: String, required: true }, // Name of the user
      rating: { type: Number, min: 0, max: 5, required: true },
      date: { type: Date, default: Date.now },
      comment: { type: String, required: true },
    },
  ],
  images: {
    type: [String], // Array of URLs for multiple images
  },
  description: {
    type: String, // Short description of the restaurant
    required: true,
    trim: true,
  },
  pricePerReservation: { // Rename from priceToReserve
    type: Number,
    required: true,
    min: 0
  },
  dressCode: {
    type: String, // Dress code for the restaurant
    required: false,
    trim: true,
  },
  amenities: [
    {
      type: String,
      enum: [
        'WiFi',
        'Parking',
        'Outdoor Seating',
        'Delivery',
        'Takeout',
        'Wheelchair Accessible',
        'Vegetarian Options',
        'Vegan Options',
      ],
    },
  ],
  reservations: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
