const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String },
  role: { type: String, default: 'user' }, // Optional role field
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
