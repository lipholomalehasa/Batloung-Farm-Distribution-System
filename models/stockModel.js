
const { pool } = require('../config/db');

// Retrieve all stock records
async function getAllStock() {
    const [rows] = await pool.query(
        `SELECT
            stock.stock_id,
            stock.fruit_id,
            fruits.fruit_name,
            stock.packaging_size,
            stock.available_quantity
        FROM stock
        INNER JOIN fruits
            ON stock.fruit_id = fruits.fruit_id
        ORDER BY fruits.fruit_name, stock.packaging_size`
    );

    return rows;
}

// Retrieve stock records for one fruit
async function getStockByFruitId(id) {
    const [rows] = await pool.query(
        `SELECT
            stock.stock_id,
            stock.fruit_id,
            fruits.fruit_name,
            stock.packaging_size,
            stock.available_quantity
        FROM stock
        INNER JOIN fruits
            ON stock.fruit_id = fruits.fruit_id
        WHERE stock.fruit_id = ?
        ORDER BY stock.packaging_size`,
        [id]
    );

    return rows;
}

// Retrieve fruits with low stock
async function getLowStock(threshold) {
    const [rows] = await pool.query(
        `SELECT
            stock.stock_id,
            stock.fruit_id,
            fruits.fruit_name,
            stock.packaging_size,
            stock.available_quantity
        FROM stock
        INNER JOIN fruits
            ON stock.fruit_id = fruits.fruit_id
        WHERE stock.available_quantity <= ?
        ORDER BY stock.available_quantity`
    , [threshold]);

    return rows;
}

// Export stock functions
module.exports = {
    getAllStock,
    getStockByFruitId,
    getLowStock
};
