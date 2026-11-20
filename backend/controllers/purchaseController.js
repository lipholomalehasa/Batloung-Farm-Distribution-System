const purchaseModel = require('../models/purchaseModel');

// Register a new purchase
async function createPurchase(req, res) {
    try {
        const { supplier_id, purchase_date, items } = req.body;

        if (!supplier_id || !purchase_date || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Supplier, purchase date and at least one fruit item are required.'
            });
        }

        for (const item of items) {
            const { fruit_id, quantity, unit_cost, packaging_size } = item;

            if (
                !fruit_id ||
                !Number.isInteger(quantity) ||
                quantity <= 0 ||
                unit_cost === undefined ||
                !Number.isFinite(Number(unit_cost)) ||
                Number(unit_cost) < 0 ||
                !['Small', 'Medium', 'Large'].includes(packaging_size)
            ) {
                return res.status(400).json({
                    message: 'Each purchase item must have a valid fruit, positive quantity, unit cost and packaging size.'
                });
            }
        }

        const result = await purchaseModel.createPurchase(req.body);

        res.status(201).json({
            message: 'Purchase recorded successfully.',
            purchase_id: result.purchase_id,
            total_amount: result.total_amount
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to record purchase.',
            error: error.message
        });
    }
}

module.exports = {
    createPurchase
};