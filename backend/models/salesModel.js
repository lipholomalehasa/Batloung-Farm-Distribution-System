
const { pool } = require('../config/db');

// Get the selling prices for all box sizes
async function getBoxPrices() {
    const [rows] = await pool.query(
        `SELECT box_size_id, size_name, weight_kg, selling_price
         FROM box_sizes
         ORDER BY box_size_id ASC`
    );

    return rows.map(row => ({
        ...row,
        selling_price: Number(row.selling_price)
    }));
}

// Register a sale and reduce stock
async function createSale(sale) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            vendor_id,
            sale_date,
            items,
            payment_method = 'CREDIT',
            amount_paid = 0
        } = sale;

        let totalAmount = 0;
        const saleItems = [];

        // Calculate each item's total using the database selling price
        for (const item of items) {
            const { fruit_id, packaging_size, quantity } = item;

            const [priceRows] = await connection.query(
                `SELECT selling_price
                 FROM box_sizes
                 WHERE size_name = ?`,
                [packaging_size]
            );

            if (priceRows.length === 0) {
                throw new Error(
                    `Price not found for ${packaging_size} box.`
                );
            }

            const unitPrice = Number(priceRows[0].selling_price);

            if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
                throw new Error(
                    `Please configure the selling price for ${packaging_size} boxes first.`
                );
            }

            const itemTotal = Number(quantity) * unitPrice;

            totalAmount += itemTotal;

            saleItems.push({
                fruit_id,
                packaging_size,
                quantity: Number(quantity),
                unit_price: unitPrice,
                item_total: itemTotal
            });
        }

        // Validate the amount paid
        const paidAmount = Number(amount_paid);

        if (!Number.isFinite(paidAmount) || paidAmount < 0) {
            throw new Error(
                'Amount paid must be a valid non-negative amount.'
            );
        }

        if (paidAmount > totalAmount) {
            throw new Error(
                'Amount paid cannot be greater than the sale total.'
            );
        }

        // Validate payment method
        if (!['CASH', 'MOBILE_MONEY', 'CREDIT'].includes(payment_method)) {
            throw new Error('Invalid payment method.');
        }

        // Calculate payment status
        let paymentStatus = 'UNPAID';

        if (paidAmount >= totalAmount) {
            paymentStatus = 'PAID';
        } else if (paidAmount > 0) {
            paymentStatus = 'PARTIALLY_PAID';
        }

        // Create the main sale record
        const [saleResult] = await connection.query(
            `INSERT INTO sales
             (vendor_id, sale_date, total_amount, amount_paid,
              payment_method, payment_status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                vendor_id,
                sale_date,
                totalAmount,
                paidAmount,
                payment_method,
                paymentStatus
            ]
        );

        const saleId = saleResult.insertId;

        // Save sale items and reduce available stock
        for (const item of saleItems) {
            const [stockRows] = await connection.query(
                `SELECT available_quantity
                 FROM stock
                 WHERE fruit_id = ?
                 AND packaging_size = ?
                 FOR UPDATE`,
                [item.fruit_id, item.packaging_size]
            );

            if (stockRows.length === 0) {
                throw new Error(
                    `No stock record found for this fruit and ${item.packaging_size} boxes.`
                );
            }

            const availableQuantity = Number(
                stockRows[0].available_quantity
            );

            if (availableQuantity < item.quantity) {
                throw new Error(
                    `Insufficient stock. Only ${availableQuantity} boxes are available.`
                );
            }

            // Insert sale details
            await connection.query(
                `INSERT INTO sales_details
                 (sale_id, fruit_id, packaging_size, quantity, unit_price)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    saleId,
                    item.fruit_id,
                    item.packaging_size,
                    item.quantity,
                    item.unit_price
                ]
            );

            // Reduce available stock
            await connection.query(
                `UPDATE stock
                 SET available_quantity = available_quantity - ?
                 WHERE fruit_id = ?
                 AND packaging_size = ?`,
                [
                    item.quantity,
                    item.fruit_id,
                    item.packaging_size
                ]
            );
        }

        // Commit the transaction
        await connection.commit();

        return {
            sale_id: saleId,
            total_amount: totalAmount,
            amount_paid: paidAmount,
            outstanding_balance: totalAmount - paidAmount,
            payment_method,
            payment_status: paymentStatus
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

// Record an additional payment for an existing sale
async function recordPayment(saleId, payment) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            amount_paid,
            payment_method
        } = payment;

        const paymentAmount = Number(amount_paid);

        if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
            throw new Error(
                'Payment amount must be greater than zero.'
            );
        }

        if (!['CASH', 'MOBILE_MONEY'].includes(payment_method)) {
            throw new Error(
                'Additional payments must be made using Cash or Mobile Money.'
            );
        }

        // Retrieve and lock the sale record
        const [saleRows] = await connection.query(
            `SELECT total_amount, amount_paid
             FROM sales
             WHERE sale_id = ?
             FOR UPDATE`,
            [saleId]
        );

        if (saleRows.length === 0) {
            throw new Error('Sale not found.');
        }

        const totalAmount = Number(saleRows[0].total_amount);
        const previousPaid = Number(saleRows[0].amount_paid);

        const outstandingBalance = totalAmount - previousPaid;

        if (paymentAmount > outstandingBalance) {
            throw new Error(
                'Payment exceeds the outstanding balance.'
            );
        }

        const newPaidAmount = previousPaid + paymentAmount;

        // Determine the new payment status
        let paymentStatus = 'UNPAID';

        if (newPaidAmount >= totalAmount) {
            paymentStatus = 'PAID';
        } else if (newPaidAmount > 0) {
            paymentStatus = 'PARTIALLY_PAID';
        }

        // Update the sale payment information
        await connection.query(
            `UPDATE sales
             SET amount_paid = ?,
                 payment_method = ?,
                 payment_status = ?
             WHERE sale_id = ?`,
            [
                newPaidAmount,
                payment_method,
                paymentStatus,
                saleId
            ]
        );

        await connection.commit();

        return {
            sale_id: Number(saleId),
            total_amount: totalAmount,
            amount_paid: newPaidAmount,
            outstanding_balance: totalAmount - newPaidAmount,
            payment_method,
            payment_status: paymentStatus
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

// Get all sales with their vendor names
async function getAllSales() {
    const [rows] = await pool.query(
        `SELECT
            s.sale_id,
            s.vendor_id,
            v.vendor_name,
            s.sale_date,
            s.total_amount,
            s.amount_paid,
            (s.total_amount - s.amount_paid) AS outstanding_balance,
            s.payment_method,
            s.payment_status
         FROM sales s
         INNER JOIN vendors v
            ON s.vendor_id = v.vendor_id
         ORDER BY s.sale_id DESC`
    );

    return rows.map(row => ({
        ...row,
        total_amount: Number(row.total_amount),
        amount_paid: Number(row.amount_paid),
        outstanding_balance: Number(row.outstanding_balance)
    }));
}

// Export all sales model functions
module.exports = {
    getBoxPrices,
    createSale,
    recordPayment,
    getAllSales
};
