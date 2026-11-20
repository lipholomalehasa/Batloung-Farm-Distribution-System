
const { pool } = require('../config/db');

// Add a new fruit
async function createFruit(fruit) {
    const { fruit_name, description, status } = fruit;

    const [result] = await pool.query(
        `INSERT INTO fruits
        (fruit_name, description, status)
        VALUES (?, ?, ?)`,
        [fruit_name, description, status]
    );

    return result;
}

// Retrieve all fruits
async function getAllFruits() {
    const [rows] = await pool.query(
        'SELECT * FROM fruits'
    );

    return rows;
}

// Retrieve a fruit by ID
async function getFruitById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM fruits WHERE fruit_id = ?',
        [id]
    );

    return rows[0];
}

// Update fruit information
async function updateFruit(id, fruit) {
    const { fruit_name, description, status } = fruit;

    const [result] = await pool.query(
        `UPDATE fruits
         SET fruit_name = ?,
             description = ?,
             status = ?
         WHERE fruit_id = ?`,
        [fruit_name, description, status, id]
    );

    return result;
}

// Permanently delete a fruit and its related records
async function deleteFruit(id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check whether the fruit exists
        const [fruit] = await connection.query(
            'SELECT fruit_id FROM fruits WHERE fruit_id = ?',
            [id]
        );

        if (fruit.length === 0) {
            throw new Error('Fruit not found.');
        }

        // Delete related stock records
        await connection.query(
            'DELETE FROM stock WHERE fruit_id = ?',
            [id]
        );

        // Delete related purchase details
        await connection.query(
            'DELETE FROM purchase_details WHERE fruit_id = ?',
            [id]
        );

        // Delete related sales details
        await connection.query(
            'DELETE FROM sales_details WHERE fruit_id = ?',
            [id]
        );

        // Permanently delete the fruit
        const [result] = await connection.query(
            'DELETE FROM fruits WHERE fruit_id = ?',
            [id]
        );

        // Save all changes
        await connection.commit();

        return result;

    } catch (error) {
        // Undo all changes if something fails
        await connection.rollback();

        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {
    createFruit,
    getAllFruits,
    getFruitById,
    updateFruit,
    deleteFruit
};
