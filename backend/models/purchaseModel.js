const { pool } = require('../config/db');

// Register a purchase and update stock
async function createPurchase(purchase) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { supplier_id, purchase_date, items } = purchase;

        let totalAmount = 0;

        // Calculate the total purchase amount
        for (const item of items) {
            totalAmount += item.quantity * item.unit_cost;
        }

        // Save the main purchase record
        const [purchaseResult] = await connection.query(
            `INSERT INTO purchases
            (supplier_id, purchase_date, total_amount)
            VALUES (?, ?, ?)`,
            [supplier_id, purchase_date, totalAmount]
        );

        const purchaseId = purchaseResult.insertId;

        // Save purchase details and increase stock
        for (const item of items) {
            const { fruit_id, quantity, unit_cost, packaging_size } = item;

            await connection.query(
                `INSERT INTO purchase_details
                (purchase_id, fruit_id, quantity, unit_cost, packaging_size)
                VALUES (?, ?, ?, ?, ?)`,
                [purchaseId, fruit_id, quantity, unit_cost, packaging_size]
            );

            await connection.query(
                `UPDATE stock
                SET available_quantity = available_quantity + ?
                WHERE fruit_id = ? AND packaging_size = ?`,
                [quantity, fruit_id, packaging_size]
            );
        }

        await connection.commit();

        return {
            purchase_id: purchaseId,
            total_amount: totalAmount
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    createPurchase
};