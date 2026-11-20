const express = require('express');

const router = express.Router();

const stockController = require('../controllers/stockController');

// Retrieve all stock
router.get('/', stockController.getAllStock);

// Retrieve stock for one fruit
router.get('/fruit/:id', stockController.getStockByFruitId);

// Identify fruits with low stock
router.get('/low-stock', stockController.getLowStock);

module.exports = router;