
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const supplierRoutes = require('./routes/supplierRoutes');
const fruitRoutes = require('./routes/fruitRoutes');
const stockRoutes = require('./routes/stockRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Batloung Farm Distribution System API is running.');
});

// Supplier routes
app.use('/api/suppliers', supplierRoutes);

// Fruit routes
app.use('/api/fruits', fruitRoutes);

// Stock routes
app.use('/api/stock', stockRoutes);
// Vendor routes
app.use('/api/vendors', vendorRoutes);
// Purchase routes
app.use('/api/purchases', purchaseRoutes);
// Sales routes
app.use('/api/sales', salesRoutes);
// Reports routes
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    testConnection();
});
