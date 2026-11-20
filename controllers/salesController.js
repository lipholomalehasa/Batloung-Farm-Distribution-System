
const salesModel = require('../models/salesModel');

// Get selling prices for all box sizes
async function getBoxPrices(req, res) {
    try {
        const prices = await salesModel.getBoxPrices();

        res.status(200).json({
            success: true,
            data: prices
        });

    } catch (error) {
        console.error('Get box prices error:', error);

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve box prices.'
        });
    }
}

// Get all sales for Sales History
async function getAllSales(req, res) {
    try {
        const sales = await salesModel.getAllSales();

        res.status(200).json({
            success: true,
            data: sales
        });

    } catch (error) {
        console.error('Get all sales error:', error);

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve sales history.'
        });
    }
}

// Register a new sale
async function createSale(req, res) {
    try {
        const {
            vendor_id,
            sale_date,
            items,
            payment_method = 'CREDIT',
            amount_paid = 0
        } = req.body;

        if (
            !vendor_id ||
            !sale_date ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Vendor, sale date and at least one fruit item are required.'
            });
        }

        for (const item of items) {
            if (
                !item.fruit_id ||
                !item.packaging_size ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a fruit, packaging size and valid quantity.'
                });
            }
        }

        const saleData = {
            vendor_id,
            sale_date,
            items,
            payment_method,
            amount_paid
        };

        const result = await salesModel.createSale(saleData);

        res.status(201).json({
            success: true,
            message: 'Sale recorded successfully.',
            data: result
        });

    } catch (error) {
        console.error('Create sale error:', error);

        res.status(400).json({
            success: false,
            message: error.message || 'Failed to record sale.'
        });
    }
}

// Record an additional payment
async function recordPayment(req, res) {
    try {
        const saleId = req.params.id;

        const {
            amount_paid,
            payment_method
        } = req.body;

        if (!saleId || !Number.isInteger(Number(saleId))) {
            return res.status(400).json({
                success: false,
                message: 'A valid sale ID is required.'
            });
        }

        if (
            amount_paid === undefined ||
            amount_paid === null ||
            amount_paid === '' ||
            !Number.isFinite(Number(amount_paid)) ||
            Number(amount_paid) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Payment amount must be greater than zero.'
            });
        }

        if (!['CASH', 'MOBILE_MONEY'].includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message: 'Additional payments must be made using Cash or Mobile Money.'
            });
        }

        const result = await salesModel.recordPayment(saleId, {
            amount_paid: Number(amount_paid),
            payment_method
        });

        res.status(200).json({
            success: true,
            message: 'Payment recorded successfully.',
            data: result
        });

    } catch (error) {
        console.error('Record payment error:', error);

        res.status(400).json({
            success: false,
            message: error.message || 'Failed to record payment.'
        });
    }
}

// Export controller functions
module.exports = {
    getBoxPrices,
    getAllSales,
    createSale,
    recordPayment
};
