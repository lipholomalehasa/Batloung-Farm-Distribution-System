const stockModel = require('../models/stockModel');

// Retrieve all stock
async function getAllStock(req, res) {
    try {
        const stock = await stockModel.getAllStock();

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve stock.',
            error: error.message
        });
    }
}

// Retrieve stock for one fruit
async function getStockByFruitId(req, res) {
    try {
        const stock = await stockModel.getStockByFruitId(req.params.id);

        if (stock.length === 0) {
            return res.status(404).json({
                message: 'No stock records found for this fruit.'
            });
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve fruit stock.',
            error: error.message
        });
    }
}

// Identify fruits with low stock
async function getLowStock(req, res) {
    try {
        const threshold = Number(req.query.threshold);

        if (
            req.query.threshold === undefined ||
            !Number.isInteger(threshold) ||
            threshold < 0
        ) {
            return res.status(400).json({
                message: 'Please provide a valid stock threshold.'
            });
        }

        const stock = await stockModel.getLowStock(threshold);

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve low stock.',
            error: error.message
        });
    }
}

module.exports = {
    getAllStock,
    getStockByFruitId,
    getLowStock
};