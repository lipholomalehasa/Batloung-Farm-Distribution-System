const { pool } = require('../config/db');

// Register a new vendor
async function createVendor(vendor) {
    const { vendor_name, phone_number, location, registration_date } = vendor;

    const [result] = await pool.query(
        `INSERT INTO vendors
        (vendor_name, phone_number, location, registration_date)
        VALUES (?, ?, ?, ?)`,
        [vendor_name, phone_number, location, registration_date]
    );

    return result;
}

// Retrieve all vendors
async function getAllVendors() {
    const [rows] = await pool.query(
        'SELECT * FROM vendors'
    );

    return rows;
}

// Search vendors by name or phone number
async function searchVendors(search) {
    const [rows] = await pool.query(
        `SELECT * FROM vendors
        WHERE vendor_name LIKE ?
        OR phone_number LIKE ?`,
        [`%${search}%`, `%${search}%`]
    );

    return rows;
}

// Update vendor information
async function updateVendor(id, vendor) {
    const { vendor_name, phone_number, location, registration_date } = vendor;

    const [result] = await pool.query(
        `UPDATE vendors
        SET vendor_name = ?,
            phone_number = ?,
            location = ?,
            registration_date = ?
        WHERE vendor_id = ?`,
        [vendor_name, phone_number, location, registration_date, id]
    );

    return result;
}

module.exports = {
    createVendor,
    getAllVendors,
    searchVendors,
    updateVendor
};