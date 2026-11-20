
const reportModel = require('../models/reportModel');

// Get outstanding balances for all vendors
async function getVendorBalances(req, res) {
    try {
        const balances = await reportModel.getVendorBalances();

        res.status(200).json({
            message: 'Vendor balances retrieved successfully.',
            data: balances
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve vendor balances.',
            error: error.message
        });
    }
}

// Get the top five most frequently sold fruits
async function getTopSellingFruits(req, res) {
    try {
        const fruits = await reportModel.getTopSellingFruits();

        res.status(200).json({
            message: 'Top selling fruits retrieved successfully.',
            data: fruits
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve top selling fruits.',
            error: error.message
        });
    }
}

// Get total revenue within a selected date range
async function getTotalRevenue(req, res) {
    try {
        const { start_date, end_date } = req.query;

        // Validate the dates
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (
            !start_date ||
            !end_date ||
            !datePattern.test(start_date) ||
            !datePattern.test(end_date) ||
            new Date(start_date).toISOString().slice(0, 10) !== start_date ||
            new Date(end_date).toISOString().slice(0, 10) !== end_date
        ) {
            return res.status(400).json({
                message: 'Valid start_date and end_date are required in YYYY-MM-DD format.'
            });
        }

        if (start_date > end_date) {
            return res.status(400).json({
                message: 'Start date cannot be after end date.'
            });
        }

        const revenue = await reportModel.getTotalRevenue(
            start_date,
            end_date
        );

        res.status(200).json({
            message: 'Total revenue retrieved successfully.',
            data: revenue
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve total revenue.',
            error: error.message
        });
    }
}

// Get the vendor with the highest number of boxes sold
async function getTopVendor(req, res) {
    try {
        const vendor = await reportModel.getTopVendor();

        res.status(200).json({
            message: 'Top vendor retrieved successfully.',
            data: vendor
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve top vendor.',
            error: error.message
        });
    }
}

// Export controller functions
module.exports = {
    getVendorBalances,
    getTopSellingFruits,
    getTotalRevenue,
    getTopVendor
};
