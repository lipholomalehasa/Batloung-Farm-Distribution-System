
const supplierModel = require('../models/supplierModel');

// Register a supplier
async function createSupplier(req, res) {
    try {
        const { business_name, contact_person, phone, province, address } = req.body;

        if (!business_name || !contact_person || !phone || !province || !address) {
            return res.status(400).json({
                message: 'All supplier fields are required.'
            });
        }

        const result = await supplierModel.createSupplier(req.body);

        res.status(201).json({
            message: 'Supplier registered successfully.',
            supplier_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to register supplier.',
            error: error.message
        });
    }
}

// Retrieve all suppliers
async function getAllSuppliers(req, res) {
    try {
        const suppliers = await supplierModel.getAllSuppliers();

        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve suppliers.',
            error: error.message
        });
    }
}

// Retrieve a supplier by ID
async function getSupplierById(req, res) {
    try {
        const supplier = await supplierModel.getSupplierById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: 'Supplier not found.'
            });
        }

        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve supplier.',
            error: error.message
        });
    }
}

// Update supplier information
async function updateSupplier(req, res) {
    try {
        const { business_name, contact_person, phone, province, address } = req.body;

        if (!business_name || !contact_person || !phone || !province || !address) {
            return res.status(400).json({
                message: 'All supplier fields are required.'
            });
        }

        const result = await supplierModel.updateSupplier(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Supplier not found.'
            });
        }

        res.status(200).json({
            message: 'Supplier updated successfully.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update supplier.',
            error: error.message
        });
    }
}

// Delete a supplier
async function deleteSupplier(req, res) {
    try {
        const result = await supplierModel.deleteSupplier(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Supplier not found.'
            });
        }

        res.status(200).json({
            message: 'Supplier deleted successfully.'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                message: 'This supplier cannot be deleted because it has recorded purchases.'
            });
        }

        res.status(500).json({
            message: 'Failed to delete supplier.',
            error: error.message
        });
    }
}

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};
