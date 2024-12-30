const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Ensure that every cart item is tied to a user
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1 if not specified
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Add createdAt and updatedAt timestamps
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
