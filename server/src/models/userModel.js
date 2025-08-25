// Defines the schema for the User collection in MongoDB.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Executive'], // Role must be one of these two values
    default: 'Executive',
  },
  // We can add more fields for permissions later
  permissions: {
      canCreateInvoice: { type: Boolean, default: true },
      canDeleteInvoice: { type: Boolean, default: false },
      canViewReports: { type: Boolean, default: false }
  }
}, { timestamps: true });


// Middleware to hash the password before saving a new user
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;