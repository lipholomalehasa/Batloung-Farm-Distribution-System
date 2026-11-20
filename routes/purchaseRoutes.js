const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchaseController');

// Record a new purchase
router.post('/', purchaseController.createPurchase);

module.exports = router;