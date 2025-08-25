// This model is crucial for generating the unique, sequential part of the invoice number.
// It ensures that even with concurrent requests, we don't get duplicate numbers.

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  // _id will be a composite key like "UFL-DL-2508"
  _id: { type: String, required: true },
  // seq will store the last used sequence number for that key
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;