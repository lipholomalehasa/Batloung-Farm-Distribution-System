
const express = require('express');

const router = express.Router();

const supplierController = require('../controllers/supplierController');

// Register a supplier
router.post('/', supplierController.createSupplier);

// Retrieve all suppliers
router.get('/', supplierController.getAllSuppliers);

// Retrieve a supplier by ID
router.get('/:id', supplierController.getSupplierById);

// Update supplier information
router.put('/:id', supplierController.updateSupplier);

// Delete a supplier
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
