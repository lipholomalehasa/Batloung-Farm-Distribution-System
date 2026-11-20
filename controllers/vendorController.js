const vendorModel = require('../models/vendorModel');

// Register a new vendor
async function createVendor(req, res) {
    try {
        const { vendor_name, phone_number, location, registration_date } = req.body;

        if (!vendor_name || !phone_number || !location || !registration_date) {
            return res.status(400).json({
                message: 'All vendor fields are required.'
            });
        }

        const result = await vendorModel.createVendor(req.body);

        res.status(201).json({
            message: 'Vendor registered successfully.',
            vendor_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to register vendor.',
            error: error.message
        });
    }
}

// Retrieve all vendors
async function getAllVendors(req, res) {
    try {
        const vendors = await vendorModel.getAllVendors();

        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve vendors.',
            error: error.message
        });
    }
}

// Search vendors by name or phone number
async function searchVendors(req, res) {
    try {
        const search = req.query.search;

        if (!search || !search.trim()) {
            return res.status(400).json({
                message: 'Please provide a vendor name or phone number to search.'
            });
        }

        const vendors = await vendorModel.searchVendors(search.trim());

        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to search vendors.',
            error: error.message
        });
    }
}

// Update vendor information
async function updateVendor(req, res) {
    try {
        const { vendor_name, phone_number, location, registration_date } = req.body;

        if (!vendor_name || !phone_number || !location || !registration_date) {
            return res.status(400).json({
                message: 'All vendor fields are required.'
            });
        }

        const result = await vendorModel.updateVendor(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Vendor not found.'
            });
        }

        res.status(200).json({
            message: 'Vendor updated successfully.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update vendor.',
            error: error.message
        });
    }
}

module.exports = {
    createVendor,
    getAllVendors,
    searchVendors,
    updateVendor
};