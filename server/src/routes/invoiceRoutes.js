const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoiceById } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes here are protected and require a valid token
router.use(protect);

// Route to create a new invoice (accessible by Admin and Executive)
router.post('/', authorize('Admin', 'Executive'), createInvoice);

// Route to get all invoices (accessible by Admin and Executive)
router.get('/', authorize('Admin', 'Executive'), getInvoices);

// Route to get a single invoice by ID
router.get('/:id', authorize('Admin', 'Executive'), getInvoiceById);

// Add routes for update, delete, and reports later
// router.put('/:id', authorize('Admin'), updateInvoice);
// router.delete('/:id', authorize('Admin'), deleteInvoice);
// router.get('/reports/revenue', authorize('Admin'), getRevenueReport);


module.exports = router;