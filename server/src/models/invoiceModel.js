// Defines the schema for the Invoice collection.

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  // Step 1 Data
  billFrom: { type: String, required: true },
  placeOfSupplyState: { type: String, required: true },
  company: { type: String, enum: ['UFL', 'UFC'], required: true },
  bookingDate: { type: Date, required: true },
  client: { type: String, default: '' }, // Special case for 'Ericsson'

  // Step 2 Data
  sellerDetails: {
    name: String,
    address: String,
    gstin: String
  },
  buyerDetails: {
    name: String,
    address: String,
    gstin: String
  },

  // Step 3 Data
  taxpayerType: {
    type: String,
    enum: ['Regular', 'SEZ Unit'],
    required: true
  },
  lutBondNumber: {
    type: String,
    // Required only if taxpayer is 'SEZ Unit' and GST is 0
    required: function() {
      return this.taxpayerType === 'SEZ Unit' && this.gstPercentage === 0;
    }
  },
  gstPercentage: {
    type: Number,
    default: 0
  },

  // Other details
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked'
  },
  // Path to the stored PDF file
  pdfPath: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;