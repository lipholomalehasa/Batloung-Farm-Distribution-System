
const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reportController');

// Get outstanding balances for all vendors
router.get('/vendor-balances', reportController.getVendorBalances);

// Get the top five most frequently sold fruits
router.get('/top-selling-fruits', reportController.getTopSellingFruits);

// Get total revenue within a selected date range
router.get('/total-revenue', reportController.getTotalRevenue);

// Get the vendor with the highest number of boxes sold
router.get('/top-vendor', reportController.getTopVendor);

module.exports = router;
