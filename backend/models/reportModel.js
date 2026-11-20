
const { pool } = require('../config/db');

// Get outstanding balances for all vendors
async function getVendorBalances() {
    const [rows] = await pool.query(
        `SELECT
            v.vendor_id,
            v.vendor_name,
            COALESCE(SUM(s.total_amount), 0) AS total_sales,
            COALESCE(SUM(s.amount_paid), 0) AS amount_paid,
            COALESCE(SUM(s.total_amount - s.amount_paid), 0) AS outstanding_balance
        FROM vendors v
        LEFT JOIN sales s ON v.vendor_id = s.vendor_id
        GROUP BY v.vendor_id, v.vendor_name
        ORDER BY outstanding_balance DESC`
    );

    return rows;
}

// Get the top five most frequently sold fruits
async function getTopSellingFruits() {
    const [rows] = await pool.query(
        `SELECT
            f.fruit_id,
            f.fruit_name,
            SUM(sd.quantity) AS total_quantity_sold
        FROM sales_details sd
        INNER JOIN fruits f ON sd.fruit_id = f.fruit_id
        GROUP BY f.fruit_id, f.fruit_name
        ORDER BY total_quantity_sold DESC
        LIMIT 5`
    );

    return rows;
}

// Get total revenue within a selected date range
async function getTotalRevenue(startDate, endDate) {
    const [rows] = await pool.query(
        `SELECT
            COALESCE(SUM(total_amount), 0) AS total_revenue,
            COUNT(sale_id) AS total_sales
        FROM sales
        WHERE sale_date BETWEEN ? AND ?`,
        [startDate, endDate]
    );

    return rows[0];
}

// Get the vendor with the highest number of boxes sold
async function getTopVendor() {
    const [rows] = await pool.query(
        `SELECT
            v.vendor_id,
            v.vendor_name,
            SUM(sd.quantity) AS total_boxes_sold
        FROM vendors v
        INNER JOIN sales s ON v.vendor_id = s.vendor_id
        INNER JOIN sales_details sd ON s.sale_id = sd.sale_id
        GROUP BY v.vendor_id, v.vendor_name
        ORDER BY total_boxes_sold DESC
        LIMIT 1`
    );

    return rows[0] || null;
}

// Export report functions
module.exports = {
    getVendorBalances,
    getTopSellingFruits,
    getTotalRevenue,
    getTopVendor
};
