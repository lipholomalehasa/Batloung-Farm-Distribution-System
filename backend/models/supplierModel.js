
const { pool } = require('../config/db');

// Register a new supplier
async function createSupplier(supplier) {
    const { business_name, contact_person, phone, province, address } = supplier;

    const [result] = await pool.query(
        `INSERT INTO suppliers
        (business_name, contact_person, phone, province, address)
        VALUES (?, ?, ?, ?, ?)`,
        [business_name, contact_person, phone, province, address]
    );

    return result;
}

// Retrieve all suppliers
async function getAllSuppliers() {
    const [rows] = await pool.query(
        'SELECT * FROM suppliers'
    );

    return rows;
}

// Retrieve a supplier by ID
async function getSupplierById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM suppliers WHERE supplier_id = ?',
        [id]
    );

    return rows[0];
}

// Update supplier information
async function updateSupplier(id, supplier) {
    const { business_name, contact_person, phone, province, address } = supplier;

    const [result] = await pool.query(
        `UPDATE suppliers
        SET business_name = ?,
            contact_person = ?,
            phone = ?,
            province = ?,
            address = ?
        WHERE supplier_id = ?`,
        [business_name, contact_person, phone, province, address, id]
    );

    return result;
}

// Delete a supplier
async function deleteSupplier(id) {
    const [result] = await pool.query(
        'DELETE FROM suppliers WHERE supplier_id = ?',
        [id]
    );

    return result;
}

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};
