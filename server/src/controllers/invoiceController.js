// This controller will handle all logic related to invoices.

const Invoice = require('../models/invoiceModel');
const Counter = require('../models/counterModel');
const mongoose = require('mongoose');

// --- Helper Function to get the next sequence number ---
async function getNextSequenceValue(sequenceName) {
    // Find the document for the given sequenceName and increment its 'seq' value by 1.
    // The { new: true, upsert: true } options mean that if a document for the sequenceName
    // doesn't exist, it will be created. 'new: true' ensures the updated document is returned.
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}


// --- Helper Function to generate the invoice number ---
const generateInvoiceNumber = async (invoiceData) => {
    const { company, placeOfSupplyState, bookingDate, client } = invoiceData;

    // We need state code, for now, we'll use the first two letters of the state
    const stateCode = placeOfSupplyState.substring(0, 2).toUpperCase();

    const date = new Date(bookingDate);
    // Get last two digits of the year (e.g., 25 for 2025)
    const year = date.getFullYear().toString().slice(-2);
    // Get month, pad with leading zero if needed (e.g., 08 for August)
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dateCode = `${year}${month}`;

    // Handle special case for Ericsson
    if (client && client.toLowerCase() === 'ericsson') {
        const sequence = await getNextSequenceValue(`ERICSSON-${company}-${stateCode}-${dateCode}`);
        const sequencePadded = sequence.toString().padStart(2, '0'); // e.g., 01
        return `${company}${stateCode}ER${dateCode}${sequencePadded}`;
    }

    // Standard format
    const sequence = await getNextSequenceValue(`${company}-${stateCode}-${dateCode}`);
    const sequencePadded = sequence.toString().padStart(3, '0'); // e.g., 001

    return `${company}${stateCode}${dateCode}${sequencePadded}`;
};


// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private (Admin, Executive)
const createInvoice = async (req, res) => {
    // For now, we use mock data. In a real application, this would come from req.body
    // after validation. We are simulating the multi-step form data being sent at once.

    // --- MOCK DATA SIMULATION ---
    // In a real frontend, you would collect this data from your forms
    // and send it in the request body. We are hardcoding it here for demonstration.
    // TODO: Replace this mock data with `const data = req.body;`
    const mockInvoiceData = {
        // Step 1 data
        billFrom: 'Delhi',
        placeOfSupplyState: 'Haryana',
        company: 'UFL', // 'UFL' or 'UFC'
        bookingDate: new Date(), // Use today's date
        client: 'Some Other Client', // Set to 'Ericsson' to test the special case

        // Step 2 data
        sellerDetails: { name: 'United Facilities & Logistics', address: 'Delhi Office', gstin: '07...' },
        buyerDetails: { name: 'Test Buyer Inc.', address: 'Gurgaon Office', gstin: '06...' },

        // Step 3 data
        taxpayerType: 'Regular', // 'Regular' or 'SEZ Unit'
        lutBondNumber: '', // Required if SEZ Unit and GST 0
        gstPercentage: 18,

        // Items
        items: [
            { description: 'Service A', quantity: 2, rate: 100, amount: 200 },
            { description: 'Service B', quantity: 1, rate: 300, amount: 300 },
        ],
        totalAmount: 590, // 500 + 18% GST
    };
    // --- END OF MOCK DATA ---

    try {
        const data = mockInvoiceData; // Use the mock data for now

        // 1. Generate Invoice Number
        const invoiceNumber = await generateInvoiceNumber(data);

        // 2. Check for duplicate invoice on the same day (as per requirements)
        // This is a simplified check. A more robust check might be needed.
        const startOfDay = new Date(data.bookingDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(data.bookingDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingInvoice = await Invoice.findOne({
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            company: data.company,
            placeOfSupplyState: data.placeOfSupplyState
        });

        // For this simulation, we'll comment out the error to allow creation.
        // if (existingInvoice) {
        //     return res.status(400).json({ message: `An invoice already exists for this date. Please try the next available date.` });
        // }


        // 3. Create and save the new invoice
        const newInvoice = new Invoice({
            ...data,
            invoiceNumber,
            createdBy: req.user._id, // Attach the logged-in user's ID
        });

        const createdInvoice = await newInvoice.save();

        // 4. TODO: Generate and save PDF here.
        // We'll leave this part commented for now.
        // generateAndSavePDF(createdInvoice);

        res.status(201).json(createdInvoice);

    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Server error while creating invoice' });
    }
};


// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({}).populate('createdBy', 'username');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
};