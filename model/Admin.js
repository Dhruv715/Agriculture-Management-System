const mongoose = require('mongoose');
// Admin Schema
const adminSchema = new mongoose.Schema({
    Adminname: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model('Admin',adminSchema);