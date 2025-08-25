// This is the main entry point for our backend application.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Middleware Setup
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// Define a simple root route for testing
app.get('/', (req, res) => {
  res.send('Invoice Portal API is running...');
});

// Import and use routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/invoices', require('./src/routes/invoiceRoutes'));


// Define the port the server will run on
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));