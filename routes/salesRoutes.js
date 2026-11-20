
const express = require('express');
const router = express.Router();

const salesController = require('../controllers/salesController');

// Get selling prices for box sizes
router.get('/prices', salesController.getBoxPrices);

// Get all sales for Sales History
router.get('/', salesController.getAllSales);

// Register a new sale
router.post('/', salesController.createSale);

// Record an additional payment for a sale
router.post('/:id/payment', salesController.recordPayment);

module.exports = router;
