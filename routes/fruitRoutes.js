
const express = require('express');
const router = express.Router();

const fruitController = require('../controllers/fruitController');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Fruit routes are working!' });
});

// Create fruit
router.post('/', fruitController.createFruit);

// Get all fruits
router.get('/', fruitController.getAllFruits);

// Get one fruit
router.get('/:id', fruitController.getFruitById);

// Update fruit
router.put('/:id', fruitController.updateFruit);

// Delete fruit
router.delete('/:id', fruitController.deleteFruit);

module.exports = router;
