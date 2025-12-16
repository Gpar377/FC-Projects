const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 15 }, // in minutes
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);