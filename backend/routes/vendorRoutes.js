const express = require('express');

const router = express.Router();

const vendorController = require('../controllers/vendorController');

// Register a new vendor
router.post('/', vendorController.createVendor);

// Retrieve all vendors
router.get('/', vendorController.getAllVendors);

// Search vendors by name or phone number
router.get('/search', vendorController.searchVendors);

// Update vendor information
router.put('/:id', vendorController.updateVendor);

module.exports = router;