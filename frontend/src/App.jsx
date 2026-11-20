
import { useState } from 'react';
import './App.css';

const API_URL = 'https://batloung-farm-backend-fqc4.onrender.com/api';

const provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
];

const requiredFruits = ['Apples', 'Bananas', 'Oranges', 'Mangoes', 'Grapes'];

const packagingSizes = [
    { name: 'Small', weight: 5 },
    { name: 'Medium', weight: 10 },
    { name: 'Large', weight: 20 }
];

function getRecords(result) {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    return [];
}

function App() {
    const [activePage, setActivePage] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);

    const [fruits, setFruits] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [stock, setStock] = useState([]);
    const [sales, setSales] = useState([]);

    // Reports states
    const [vendorBalances, setVendorBalances] = useState([]);
    const [topSellingFruits, setTopSellingFruits] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [topVendor, setTopVendor] = useState(null);
    const [selectedPaymentSale, setSelectedPaymentSale] = useState(null);
const [additionalPayment, setAdditionalPayment] = useState('');
const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('CASH');
const [showPaymentSelection, setShowPaymentSelection] = useState(false);

    // Report date filter
    const [reportStartDate, setReportStartDate] = useState(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`
    );

    const [reportEndDate, setReportEndDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    // Purchase form states
    const [purchaseSupplierId, setPurchaseSupplierId] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [purchaseItems, setPurchaseItems] = useState([
        { fruit_id: '', packaging_size: 'Small', quantity: 1, unit_cost: '' }
    ]);

    // Purchase item popup states
    const [showPurchaseItemModal, setShowPurchaseItemModal] = useState(false);
    const [newPurchaseItem, setNewPurchaseItem] = useState({
        fruit_id: '',
        packaging_size: 'Small',
        quantity: 1,
        unit_cost: ''
    });

    // Fruit form states
    const [fruitName, setFruitName] = useState('');
    const [description, setDescription] = useState('');
    const [fruitStatus, setFruitStatus] = useState('Available');
    const [searchFruit, setSearchFruit] = useState('');
    const [editingFruitId, setEditingFruitId] = useState(null);
    const [selectedFruit, setSelectedFruit] = useState(null);
    const [showFruitModal, setShowFruitModal] = useState(false);

    // Supplier form states
    const [supplierName, setSupplierName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [supplierPhone, setSupplierPhone] = useState('');
    const [supplierEmail, setSupplierEmail] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [province, setProvince] = useState('');
    const [searchSupplier, setSearchSupplier] = useState('');
    const [editingSupplierId, setEditingSupplierId] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [showSupplierModal, setShowSupplierModal] = useState(false);

    // Vendor form states
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [vendorName, setVendorName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [registrationDate, setRegistrationDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    // Sales form states
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [saleVendorId, setSaleVendorId] = useState('');
    const [saleDate, setSaleDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [saleItems, setSaleItems] = useState([
        { fruit_id: '', packaging_size: 'Small', quantity: 1 }
    ]);
    const [boxPrices, setBoxPrices] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('CREDIT');
    const [amountPaid, setAmountPaid] = useState('0');
    const [lastSale, setLastSale] = useState(null);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [savingSale, setSavingSale] = useState(false);

    // Load dashboard information
    async function loadDashboard() {
        try {
            setLoading(true);
            setMessage('');

            const responses = await Promise.all([
                fetch(`${API_URL}/fruits`),
                fetch(`${API_URL}/suppliers`),
                fetch(`${API_URL}/vendors`),
                fetch(`${API_URL}/stock`)
            ]);

            if (responses.some(response => !response.ok)) {
                throw new Error('Failed to load dashboard information.');
            }

            const [fruitData, supplierData, vendorData, stockData] =
                await Promise.all(responses.map(response => response.json()));

            setFruits(getRecords(fruitData));
            setSuppliers(getRecords(supplierData));
            setVendors(getRecords(vendorData));
            setStock(getRecords(stockData));
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Retrieve current stock
    async function fetchStock() {
        try {
            setLoading(true);
            setMessage('');

            const response = await fetch(`${API_URL}/stock`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to retrieve stock.');
            }

            setStock(getRecords(result));
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Retrieve all fruits
    async function fetchFruits() {
        try {
            setLoading(true);
            setMessage('');

            const response = await fetch(`${API_URL}/fruits`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to retrieve fruits.');
            }

            setFruits(getRecords(result));
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Reset fruit form
    function resetFruitForm() {
        setFruitName('');
        setDescription('');
        setFruitStatus('Available');
        setEditingFruitId(null);
        setShowFruitModal(false);
    }

    // Add or update fruit
    async function handleFruitSubmit(event) {
        event.preventDefault();

        try {
            setMessage('');

            const fruitData = {
                fruit_name: fruitName,
                description,
                status: fruitStatus
            };

            const url = editingFruitId
                ? `${API_URL}/fruits/${editingFruitId}`
                : `${API_URL}/fruits`;

            const response = await fetch(url, {
                method: editingFruitId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fruitData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save fruit.');
            }

            setMessage(
                editingFruitId
                    ? 'Fruit updated successfully.'
                    : 'Fruit added successfully.'
            );

            resetFruitForm();
            await fetchFruits();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // Edit fruit
    function handleEditFruit(fruit) {
        setFruitName(fruit.fruit_name);
        setDescription(fruit.description || '');
        setFruitStatus(fruit.status);
        setEditingFruitId(fruit.fruit_id);
        setSelectedFruit(null);
        setShowFruitModal(true);
        setMessage('');
    }

    // Delete fruit
    async function handleDeleteFruit(id) {
        if (!window.confirm('Are you sure you want to delete this fruit?')) return;

        try {
            setMessage('');

            const response = await fetch(`${API_URL}/fruits/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete fruit.');
            }

            setMessage('Fruit deleted successfully.');
            setSelectedFruit(null);
            await fetchFruits();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // View fruit details
    async function handleViewFruit(id) {
        try {
            setMessage('');
            setSelectedFruit(null);

            const response = await fetch(`${API_URL}/fruits/${id}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to retrieve fruit details.'
                );
            }

            setSelectedFruit(result.data || result);
        } catch (error) {
            setMessage(error.message);
        }
    }

    // Retrieve all suppliers
    async function fetchSuppliers() {
        try {
            setLoading(true);
            setMessage('');

            const response = await fetch(`${API_URL}/suppliers`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to retrieve suppliers.'
                );
            }

            setSuppliers(getRecords(result));
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Reset supplier form
    function resetSupplierForm() {
        setSupplierName('');
        setContactPerson('');
        setSupplierPhone('');
        setSupplierEmail('');
        setSupplierAddress('');
        setProvince('');
        setEditingSupplierId(null);
        setShowSupplierModal(false);
    }

    // Add or update supplier
    async function handleSupplierSubmit(event) {
        event.preventDefault();

        try {
            setMessage('');

            const supplierData = {
                business_name: supplierName,
                contact_person: contactPerson,
                phone: supplierPhone,
                email: supplierEmail,
                province,
                address: supplierAddress
            };

            const url = editingSupplierId
                ? `${API_URL}/suppliers/${editingSupplierId}`
                : `${API_URL}/suppliers`;

            const response = await fetch(url, {
                method: editingSupplierId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplierData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save supplier.');
            }

            setMessage(
                editingSupplierId
                    ? 'Supplier updated successfully.'
                    : 'Supplier registered successfully.'
            );

            resetSupplierForm();
            await fetchSuppliers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // View supplier details
    async function handleViewSupplier(id) {
        try {
            setMessage('');

            const response = await fetch(`${API_URL}/suppliers/${id}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to retrieve supplier details.'
                );
            }

            setSelectedSupplier(result.data || result);
        } catch (error) {
            setMessage(error.message);
        }
    }

    // Edit supplier
    function handleEditSupplier(supplier) {
        setSupplierName(
            supplier.business_name || supplier.supplier_name || ''
        );
        setContactPerson(supplier.contact_person || '');
        setSupplierPhone(supplier.phone || '');
        setSupplierEmail(supplier.email || '');
        setSupplierAddress(supplier.address || '');
        setProvince(supplier.province || '');
        setEditingSupplierId(supplier.supplier_id);
        setSelectedSupplier(null);
        setShowSupplierModal(true);
        setMessage('');
    }

    // Delete supplier
    async function handleDeleteSupplier(id) {
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;

        try {
            setMessage('');

            const response = await fetch(`${API_URL}/suppliers/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to delete supplier.'
                );
            }

            setMessage('Supplier deleted successfully.');
            setSelectedSupplier(null);
            await fetchSuppliers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // Retrieve vendors
    async function fetchVendors() {
        try {
            setMessage('');

            const response = await fetch(`${API_URL}/vendors`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to retrieve vendors.'
                );
            }

            setVendors(getRecords(result));
        } catch (error) {
            setMessage(error.message);
        }
    }

    // Reset vendor form
    function resetVendorForm() {
        setVendorName('');
        setPhoneNumber('');
        setLocation('');
        setRegistrationDate(new Date().toISOString().slice(0, 10));
        setShowVendorModal(false);
    }

    // Register a new vendor
    async function handleAddVendor(event) {
        event.preventDefault();

        try {
            setMessage('');

            const response = await fetch(`${API_URL}/vendors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendor_name: vendorName,
                    phone_number: phoneNumber,
                    location,
                    registration_date: registrationDate
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to register vendor.'
                );
            }

            setMessage('Vendor registered successfully.');
            resetVendorForm();
            await fetchVendors();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // Load fruits and suppliers for purchases
    async function loadPurchaseOptions() {
        try {
            setLoading(true);
            setMessage('');

            const [fruitResponse, supplierResponse] = await Promise.all([
                fetch(`${API_URL}/fruits`),
                fetch(`${API_URL}/suppliers`)
            ]);

            const [fruitResult, supplierResult] = await Promise.all([
                fruitResponse.json(),
                supplierResponse.json()
            ]);

            if (!fruitResponse.ok) {
                throw new Error(fruitResult.message || 'Failed to load fruits.');
            }

            if (!supplierResponse.ok) {
                throw new Error(
                    supplierResult.message || 'Failed to load suppliers.'
                );
            }

            setFruits(getRecords(fruitResult));
            setSuppliers(getRecords(supplierResult));
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Open Add Fruit Item popup
    function openPurchaseItemModal() {
        setNewPurchaseItem({
            fruit_id: '',
            packaging_size: 'Small',
            quantity: 1,
            unit_cost: ''
        });
        setShowPurchaseItemModal(true);
        setMessage('');
    }

    // Close Add Fruit Item popup
    function closePurchaseItemModal() {
        setShowPurchaseItemModal(false);
        setNewPurchaseItem({
            fruit_id: '',
            packaging_size: 'Small',
            quantity: 1,
            unit_cost: ''
        });
    }

    // Add fruit item from popup
    function handleAddPurchaseItem(event) {
        event.preventDefault();

        if (!newPurchaseItem.fruit_id) {
            setMessage('Please select a fruit.');
            return;
        }

        if (
            !Number.isInteger(Number(newPurchaseItem.quantity)) ||
            Number(newPurchaseItem.quantity) <= 0
        ) {
            setMessage('Please enter a valid quantity.');
            return;
        }

        if (
            newPurchaseItem.unit_cost === '' ||
            !Number.isFinite(Number(newPurchaseItem.unit_cost)) ||
            Number(newPurchaseItem.unit_cost) < 0
        ) {
            setMessage('Please enter a valid unit cost.');
            return;
        }

        setPurchaseItems(currentItems => [
            ...currentItems,
            {
                fruit_id: newPurchaseItem.fruit_id,
                packaging_size: newPurchaseItem.packaging_size,
                quantity: Number(newPurchaseItem.quantity),
                unit_cost: Number(newPurchaseItem.unit_cost)
            }
        ]);

        closePurchaseItemModal();
        setMessage('Fruit item added to purchase.');
    }

    // Update purchase item
    function updatePurchaseItem(index, field, value) {
        setPurchaseItems(currentItems =>
            currentItems.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            )
        );
    }

    // Remove purchase item
    function removePurchaseItem(index) {
        setPurchaseItems(currentItems =>
            currentItems.length === 1
                ? currentItems
                : currentItems.filter((item, itemIndex) => itemIndex !== index)
        );
    }

    // Calculate purchase total
    const purchaseTotal = purchaseItems.reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 0) *
            (Number(item.unit_cost) || 0),
        0
    );

    // Record a new purchase
    async function handlePurchaseSubmit(event) {
        event.preventDefault();

        if (!purchaseSupplierId) {
            setMessage('Please select a supplier.');
            return;
        }

        const invalidItem = purchaseItems.some(item =>
            !item.fruit_id ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0 ||
            item.unit_cost === '' ||
            !Number.isFinite(Number(item.unit_cost)) ||
            Number(item.unit_cost) < 0
        );

        if (invalidItem) {
            setMessage(
                'Please complete every fruit item with a valid quantity and unit cost.'
            );
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            const purchaseData = {
                supplier_id: Number(purchaseSupplierId),
                purchase_date: purchaseDate,
                items: purchaseItems.map(item => ({
                    fruit_id: Number(item.fruit_id),
                    packaging_size: item.packaging_size,
                    quantity: Number(item.quantity),
                    unit_cost: Number(item.unit_cost)
                }))
            };

            const response = await fetch(`${API_URL}/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchaseData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to record purchase.');
            }

            setMessage(
                `Purchase recorded successfully. Purchase ID: ${result.purchase_id}. Total amount: ${Number(result.total_amount).toFixed(2)}.`
            );

            setPurchaseSupplierId('');
            setPurchaseDate(new Date().toISOString().slice(0, 10));
            setPurchaseItems([
                { fruit_id: '', packaging_size: 'Small', quantity: 1, unit_cost: '' }
            ]);
            closePurchaseItemModal();

            const stockResponse = await fetch(`${API_URL}/stock`);
            const stockResult = await stockResponse.json();

            if (stockResponse.ok) {
                setStock(getRecords(stockResult));
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

// Retrieve all saved sales
async function fetchSales() {
    console.log('Refresh Sales button clicked');

    try {
        const response = await fetch(`${API_URL}/sales`, {
            cache: 'no-store'
        });

        const result = await response.json();

        console.log('Sales received:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Failed to retrieve sales history.');
        }

        setSales(getRecords(result));
        setMessage('Sales history refreshed successfully.');

    } catch (error) {
        console.error('Error refreshing sales:', error);
        setMessage(error.message);
    }
}
// Record an additional payment for an existing sale
async function handleRecordPayment(event) {
    event.preventDefault();

    if (!selectedPaymentSale) {
        setMessage('Please select a sale.');
        return;
    }

    const paymentAmount = Number(additionalPayment);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        setMessage('Please enter a valid payment amount.');
        return;
    }

    if (paymentAmount > Number(selectedPaymentSale.outstanding_balance)) {
        setMessage('Payment cannot exceed the outstanding balance.');
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/sales/${selectedPaymentSale.sale_id}/payment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount_paid: paymentAmount,
                    payment_method: additionalPaymentMethod
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to record payment.');
        }

        setMessage('Payment recorded successfully.');

        setSelectedPaymentSale(null);
        setAdditionalPayment('');
        setAdditionalPaymentMethod('CASH');

        await fetchSales();

    } catch (error) {
        setMessage(error.message);
    }
}

    // Load sales page information
    async function loadSalesOptions() {
        try {
            setLoading(true);
            setMessage('');
            setLastSale(null);

            const [vendorResponse, fruitResponse, stockResponse, priceResponse] =
                await Promise.all([
                    fetch(`${API_URL}/vendors`),
                    fetch(`${API_URL}/fruits`),
                    fetch(`${API_URL}/stock`),
                    fetch(`${API_URL}/sales/prices`)
                ]);

            const [vendorResult, fruitResult, stockResult, priceResult] =
                await Promise.all([
                    vendorResponse.json(),
                    fruitResponse.json(),
                    stockResponse.json(),
                    priceResponse.json()
                ]);

            if (!vendorResponse.ok) {
                throw new Error(
                    vendorResult.message || 'Failed to load vendors.'
                );
            }

            if (!fruitResponse.ok) {
                throw new Error(
                    fruitResult.message || 'Failed to load fruits.'
                );
            }

            if (!stockResponse.ok) {
                throw new Error(
                    stockResult.message || 'Failed to load stock.'
                );
            }

            if (!priceResponse.ok) {
                throw new Error(
                    priceResult.message ||
                    'Failed to load packaging prices. Check the sales price endpoint.'
                );
            }

            const fruitRecords = getRecords(fruitResult)
                .map(fruit => ({
                    ...fruit,
                    fruit_id: fruit.fruit_id ?? fruit.id,
                    fruit_name: fruit.fruit_name ?? fruit.name
                }))
                .filter(fruit =>
                    fruit.fruit_id &&
                    requiredFruits.some(required =>
                        required.toLowerCase() ===
                        String(fruit.fruit_name).trim().toLowerCase()
                    )
                );

            const priceRecords = getRecords(priceResult).map(price => ({
                ...price,
                selling_price: Number(price.selling_price || 0)
            }));

            setVendors(getRecords(vendorResult));
            setFruits(fruitRecords);
            setStock(getRecords(stockResult));
            setBoxPrices(priceRecords);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Load all reports
    async function loadReports() {
        try {
            setLoading(true);
            setMessage('');

            if (!reportStartDate || !reportEndDate) {
                throw new Error('Please select both report dates.');
            }

            if (reportStartDate > reportEndDate) {
                throw new Error('The start date cannot be after the end date.');
            }

            const revenueUrl =
                `${API_URL}/reports/total-revenue?start_date=${reportStartDate}&end_date=${reportEndDate}`;

            const responses = await Promise.all([
                fetch(`${API_URL}/reports/vendor-balances`),
                fetch(`${API_URL}/reports/top-selling-fruits`),
                fetch(revenueUrl),
                fetch(`${API_URL}/reports/top-vendor`)
            ]);

            const results = await Promise.all(
                responses.map(response => response.json())
            );

            if (responses.some(response => !response.ok)) {
                const failedResult = results.find(
                    (result, index) => !responses[index].ok
                );

                throw new Error(
                    failedResult?.message || 'Failed to load reports.'
                );
            }

            setVendorBalances(getRecords(results[0]));
            setTopSellingFruits(getRecords(results[1]));
            setTotalRevenue(results[2].data || results[2]);
            setTopVendor(results[3].data || results[3]);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Get selling price for packaging size
    function getSalePrice(packagingSize) {
        const price = boxPrices.find(item =>
            String(item.size_name).trim().toLowerCase() ===
            String(packagingSize).trim().toLowerCase()
        );

        return price ? Number(price.selling_price) : 0;
    }

    // Get available stock for a fruit and packaging size
    function getAvailableStock(fruitId, packagingSize) {
        return stock
            .filter(item =>
                Number(item.fruit_id) === Number(fruitId) &&
                String(item.packaging_size).trim().toLowerCase() ===
                String(packagingSize).trim().toLowerCase()
            )
            .reduce(
                (total, item) =>
                    total + Number(item.available_quantity || 0),
                0
            );
    }

    // Update a sale item
    function updateSaleItem(index, field, value) {
        setSaleItems(currentItems =>
            currentItems.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [field]: value }
                    : item
            )
        );
    }

    // Add another fruit to a sale
    function addSaleItem() {
        setSaleItems(currentItems => [
            ...currentItems,
            {
                fruit_id: '',
                packaging_size: 'Small',
                quantity: 1
            }
        ]);
    }

    // Remove a fruit from a sale
    function removeSaleItem(index) {
        setSaleItems(currentItems =>
            currentItems.length === 1
                ? currentItems
                : currentItems.filter((item, itemIndex) => itemIndex !== index)
        );
    }

    // Calculate sale total
    const saleTotal = saleItems.reduce((total, item) => {
        return total +
            (Number(item.quantity) || 0) *
            getSalePrice(item.packaging_size);
    }, 0);

    // Calculate outstanding balance
    const outstandingBalance = Math.max(
        0,
        saleTotal - (Number(amountPaid) || 0)
    );

    // Reset sales form without clearing the receipt
    function resetSaleForm() {
        setSaleVendorId('');
        setSaleDate(new Date().toISOString().slice(0, 10));
        setSaleItems([
            { fruit_id: '', packaging_size: 'Small', quantity: 1 }
        ]);
        setPaymentMethod('CREDIT');
        setAmountPaid('0');
    }

    // Open Add Sale popup
    function openSaleModal() {
        resetSaleForm();
        setLastSale(null);
        setMessage('');
        setShowSaleModal(true);
    }

    // Close Add Sale popup
    function closeSaleModal() {
        setShowSaleModal(false);
        resetSaleForm();
        setMessage('');
    }

    // Validate and record a sale
    async function handleSaleSubmit(event) {
        event.preventDefault();

        if (!saleVendorId) {
            setMessage('Please select a vendor.');
            return;
        }

        if (!saleDate) {
            setMessage('Please select a sale date.');
            return;
        }

        for (const item of saleItems) {
            if (!item.fruit_id) {
                setMessage('Please select a fruit for every sale item.');
                return;
            }

            if (
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) <= 0
            ) {
                setMessage('Please enter a valid quantity for every item.');
                return;
            }

            const price = getSalePrice(item.packaging_size);

            if (price <= 0) {
                setMessage(
                    `The selling price for ${item.packaging_size} packaging has not been configured.`
                );
                return;
            }

            const available = getAvailableStock(
                item.fruit_id,
                item.packaging_size
            );

            if (Number(item.quantity) > available) {
                const fruit = fruits.find(currentFruit =>
                    Number(currentFruit.fruit_id) === Number(item.fruit_id)
                );

                setMessage(
                    `Insufficient stock for ${fruit?.fruit_name || 'selected fruit'} (${item.packaging_size}). Available boxes: ${available}.`
                );
                return;
            }
        }

        if (
            amountPaid === '' ||
            !Number.isFinite(Number(amountPaid)) ||
            Number(amountPaid) < 0
        ) {
            setMessage('Please enter a valid payment amount.');
            return;
        }

        if (saleTotal <= 0) {
            setMessage('The sale total must be greater than zero. Please check your box prices.');
            return;
        }

        if (Number(amountPaid) > saleTotal) {
            setMessage('Amount paid cannot be greater than the sale total.');
            return;
        }

        if (paymentMethod === 'CREDIT' && Number(amountPaid) !== 0) {
            setMessage('Credit sales must have an initial payment of zero.');
            return;
        }

        if (
            ['CASH', 'MOBILE_MONEY'].includes(paymentMethod) &&
            Number(amountPaid) <= 0
        ) {
            setMessage('Please enter the amount received.');
            return;
        }

        try {
            setSavingSale(true);
            setMessage('');

            const saleData = {
                vendor_id: Number(saleVendorId),
                sale_date: saleDate,
                payment_method: paymentMethod,
                amount_paid: Number(amountPaid),
                items: saleItems.map(item => ({
                    fruit_id: Number(item.fruit_id),
                    packaging_size: item.packaging_size,
                    quantity: Number(item.quantity)
                }))
            };

            const response = await fetch(`${API_URL}/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    result.message ||
                    'Failed to record sale.'
                );
            }

            const saleReceipt = result.data || result;

            setLastSale(saleReceipt);
            setShowSaleModal(false);
            resetSaleForm();

            setMessage(
                `Sale recorded successfully. Sale ID: ${saleReceipt.sale_id}.`
                
            );
            await fetchSales();
            

            // Refresh stock after a successful sale
            const stockResponse = await fetch(`${API_URL}/stock`);
            const stockResult = await stockResponse.json();

            if (stockResponse.ok) {
                setStock(getRecords(stockResult));
            }

        } catch (error) {
            setMessage(error.message);
        } finally {
            setSavingSale(false);
        }
    }

    // Calculate total boxes
    const totalBoxes = stock.reduce(
        (total, item) => total + Number(item.available_quantity || 0),
        0
    );

    // Search fruits
    const filteredFruits = fruits.filter(fruit =>
        String(fruit.fruit_name || '')
            .toLowerCase()
            .includes(searchFruit.toLowerCase().trim())
    );

    // Search suppliers
    const filteredSuppliers = suppliers.filter(supplier => {
        const name = supplier.business_name || supplier.supplier_name || '';
        const search = searchSupplier.toLowerCase().trim();

        return (
            name.toLowerCase().includes(search) ||
            (supplier.province || '').toLowerCase().includes(search)
        );
    });

    // Open navigation page
    function openPage(page) {
        setActivePage(page);
        setMessage('');
        setSelectedFruit(null);
        setSelectedSupplier(null);
        setShowFruitModal(false);
        setShowSupplierModal(false);
        setShowVendorModal(false);
        setShowPurchaseItemModal(false);
        setShowSaleModal(false);

        if (page === 'Dashboard') loadDashboard();

        if (page === 'Fruits') {
            resetFruitForm();
            setSearchFruit('');
            fetchFruits();
        }

        if (page === 'Suppliers') {
            resetSupplierForm();
            setSearchSupplier('');
            fetchSuppliers();
        }

        if (page === 'Vendors') {
            resetVendorForm();
            fetchVendors();
        }

        if (page === 'Purchases') {
            setPurchaseSupplierId('');
            setPurchaseDate(new Date().toISOString().slice(0, 10));
            setPurchaseItems([
                { fruit_id: '', packaging_size: 'Small', quantity: 1, unit_cost: '' }
            ]);
            setNewPurchaseItem({
                fruit_id: '',
                packaging_size: 'Small',
                quantity: 1,
                unit_cost: ''
            });
            loadPurchaseOptions();
        }

        if (page === 'Stock Management') fetchStock();

        if (page === 'Sales') {
            resetSaleForm();
            loadSalesOptions();
            if (page === 'Sales') {
    resetSaleForm();
    loadSalesOptions();
    fetchSales();
}
        }

        if (page === 'Reports') {
            loadReports();
        }
    }

    return (
        <div className="app">

            {/* WELCOME SCREEN */}
            {showWelcome && (
                <div className="welcome-screen">
                    <div className="welcome-content">
                        <h1>Welcome to Batloung Farm</h1>
                        <h2>Where Quality Meets Freshness!</h2>

                        <button
                            type="button"
                            className="enter-button"
                            onClick={() => {
                                setShowWelcome(false);
                                openPage('Dashboard');
                            }}
                        >
                            Enter Distribution System
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN HEADER */}
            <header className="main-header">
                <div className="brand">
                    <h1>Batloung Farm</h1>
                    <p>Distribution Management System</p>
                </div>

                <nav className="top-navigation">
                    {[
                        'Dashboard',
                        'Fruits',
                        'Suppliers',
                        'Purchases',
                        'Stock Management',
                        'Vendors',
                        'Sales',
                        'Reports'
                    ].map(page => (
                        <button
                            key={page}
                            className={activePage === page ? 'active' : ''}
                            onClick={() => openPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="main-content">

                {activePage && (
                    <div className="page-heading">
                        <h2>
                            {activePage === 'Dashboard'
                                ? 'Welcome to Batloung Farm'
                                : activePage}
                        </h2>

                        <p>
                            {activePage === 'Dashboard'
                                ? 'Where Quality Meets Freshness!'
                                : 'Manage your farm distribution operations.'}
                        </p>
                    </div>
                )}

                {/* DASHBOARD */}
                {activePage === 'Dashboard' && (
                    <section className="dashboard-section">
                        {loading ? (
                            <p>Loading dashboard information...</p>
                        ) : (
                            <>
                                <div className="dashboard-stats">
                                    <div className="stat-item">
                                        <h3>Total Fruits</h3>
                                        <p>{fruits.length}</p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Total Suppliers</h3>
                                        <p>{suppliers.length}</p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Total Vendors</h3>
                                        <p>{vendors.length}</p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Available Boxes</h3>
                                        <p>{totalBoxes}</p>
                                    </div>
                                </div>

                                <div className="dashboard-stock">
                                    <h3>Current Stock</h3>

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Fruit</th>
                                                <th>Packaging Size</th>
                                                <th>Available Quantity</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {stock.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.fruit_name || item.fruit_id}</td>
                                                    <td>{item.packaging_size}</td>
                                                    <td>{item.available_quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {message && <p className="message">{message}</p>}
                    </section>
                )}

                {/* FRUITS */}
                {activePage === 'Fruits' && (
                    <>
                        <section className="table-section">
                            <div className="fruit-page-header">
                                <h3>Fruits List</h3>

                                <button
                                    type="button"
                                    className="submit-button"
                                    onClick={() => {
                                        resetFruitForm();
                                        setShowFruitModal(true);
                                    }}
                                >
                                    Add Fruit
                                </button>
                            </div>

                            <div className="fruit-search">
                                <input
                                    type="text"
                                    value={searchFruit}
                                    onChange={e => setSearchFruit(e.target.value)}
                                    placeholder="Search fruits by name..."
                                />
                            </div>

                            {loading ? (
                                <p>Loading fruits...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fruit ID</th>
                                            <th>Fruit Name</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredFruits.length > 0 ? (
                                            filteredFruits.map(fruit => (
                                                <tr key={fruit.fruit_id}>
                                                    <td>{fruit.fruit_id}</td>
                                                    <td>{fruit.fruit_name}</td>
                                                    <td>{fruit.description}</td>
                                                    <td>{fruit.status}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                type="button"
                                                                className="action-button view-button"
                                                                onClick={() => handleViewFruit(fruit.fruit_id)}
                                                            >
                                                                View
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="action-button edit-button"
                                                                onClick={() => handleEditFruit(fruit)}
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="action-button delete-button"
                                                                onClick={() => handleDeleteFruit(fruit.fruit_id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">No matching fruits found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {message && <p className="message">{message}</p>}
                        </section>

                        {/* ADD AND EDIT FRUIT POPUP */}
                        {showFruitModal && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content">
                                    <h3>
                                        {editingFruitId ? 'Modify Fruit' : 'Add New Fruit'}
                                    </h3>

                                    <form onSubmit={handleFruitSubmit}>
                                        <div className="form-group">
                                            <label>Fruit Name</label>
                                            <input
                                                value={fruitName}
                                                onChange={e => setFruitName(e.target.value)}
                                                placeholder="Enter fruit name"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <input
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                                placeholder="Enter fruit description"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Status</label>
                                            <select
                                                value={fruitStatus}
                                                onChange={e => setFruitStatus(e.target.value)}
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>

                                        <button type="submit" className="submit-button">
                                            {editingFruitId ? 'Save Changes' : 'Add Fruit'}
                                        </button>

                                        <button
                                            type="button"
                                            className="submit-button cancel-button"
                                            onClick={resetFruitForm}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* VIEW FRUIT POPUP */}
                        {selectedFruit && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content">
                                    <h3>Fruit Details</h3>

                                    <p><strong>Fruit ID:</strong> {selectedFruit.fruit_id}</p>
                                    <p><strong>Fruit Name:</strong> {selectedFruit.fruit_name}</p>
                                    <p><strong>Description:</strong> {selectedFruit.description}</p>
                                    <p><strong>Status:</strong> {selectedFruit.status}</p>

                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="action-button edit-button"
                                            onClick={() => handleEditFruit(selectedFruit)}
                                        >
                                            Edit Fruit
                                        </button>

                                        <button
                                            type="button"
                                            className="action-button view-button"
                                            onClick={() => setSelectedFruit(null)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* SUPPLIERS */}
                {activePage === 'Suppliers' && (
                    <>
                        <section className="table-section">
                            <div className="fruit-page-header">
                                <h3>Registered Suppliers</h3>

                                <button
                                    type="button"
                                    className="submit-button"
                                    onClick={() => {
                                        resetSupplierForm();
                                        setShowSupplierModal(true);
                                    }}
                                >
                                    Add Supplier
                                </button>
                            </div>

                            <div className="fruit-search">
                                <input
                                    type="text"
                                    value={searchSupplier}
                                    onChange={e => setSearchSupplier(e.target.value)}
                                    placeholder="Search suppliers by name or province..."
                                />
                            </div>

                            {loading ? (
                                <p>Loading suppliers...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Supplier ID</th>
                                            <th>Supplier Name</th>
                                            <th>Contact Person</th>
                                            <th>Telephone</th>
                                            <th>Email</th>
                                            <th>Province</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredSuppliers.length > 0 ? (
                                            filteredSuppliers.map(supplier => (
                                                <tr key={supplier.supplier_id}>
                                                    <td>{supplier.supplier_id}</td>
                                                    <td>{supplier.business_name || supplier.supplier_name}</td>
                                                    <td>{supplier.contact_person}</td>
                                                    <td>{supplier.phone}</td>
                                                    <td>{supplier.email}</td>
                                                    <td>{supplier.province}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                type="button"
                                                                className="action-button view-button"
                                                                onClick={() => handleViewSupplier(supplier.supplier_id)}
                                                            >
                                                                View
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="action-button edit-button"
                                                                onClick={() => handleEditSupplier(supplier)}
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="action-button delete-button"
                                                                onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7">No suppliers found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {message && <p className="message">{message}</p>}
                        </section>

                        {/* ADD AND EDIT SUPPLIER POPUP */}
                        {showSupplierModal && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content">
                                    <h3>
                                        {editingSupplierId ? 'Edit Supplier' : 'Register New Supplier'}
                                    </h3>

                                    <form onSubmit={handleSupplierSubmit}>
                                        <div className="form-group">
                                            <label>Supplier Name</label>
                                            <input
                                                value={supplierName}
                                                onChange={e => setSupplierName(e.target.value)}
                                                placeholder="Enter supplier name"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Contact Person</label>
                                            <input
                                                value={contactPerson}
                                                onChange={e => setContactPerson(e.target.value)}
                                                placeholder="Enter contact person"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Telephone</label>
                                            <input
                                                type="tel"
                                                value={supplierPhone}
                                                onChange={e => setSupplierPhone(e.target.value)}
                                                placeholder="Enter telephone number"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                value={supplierEmail}
                                                onChange={e => setSupplierEmail(e.target.value)}
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Province</label>
                                            <select
                                                value={province}
                                                onChange={e => setProvince(e.target.value)}
                                                required
                                            >
                                                <option value="">Select province</option>
                                                {provinces.map(item => (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Physical Address</label>
                                            <input
                                                value={supplierAddress}
                                                onChange={e => setSupplierAddress(e.target.value)}
                                                placeholder="Enter physical address"
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="submit-button">
                                            {editingSupplierId ? 'Save Changes' : 'Register Supplier'}
                                        </button>

                                        <button
                                            type="button"
                                            className="submit-button cancel-button"
                                            onClick={resetSupplierForm}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* VIEW SUPPLIER POPUP */}
                        {selectedSupplier && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content">
                                    <h3>Supplier Details</h3>

                                    <p><strong>Supplier ID:</strong> {selectedSupplier.supplier_id}</p>
                                    <p><strong>Supplier Name:</strong> {selectedSupplier.business_name || selectedSupplier.supplier_name}</p>
                                    <p><strong>Contact Person:</strong> {selectedSupplier.contact_person}</p>
                                    <p><strong>Telephone:</strong> {selectedSupplier.phone}</p>
                                    <p><strong>Email:</strong> {selectedSupplier.email}</p>
                                    <p><strong>Province:</strong> {selectedSupplier.province}</p>
                                    <p><strong>Physical Address:</strong> {selectedSupplier.address}</p>

                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="action-button edit-button"
                                            onClick={() => handleEditSupplier(selectedSupplier)}
                                        >
                                            Edit Supplier
                                        </button>

                                        <button
                                            type="button"
                                            className="action-button view-button"
                                            onClick={() => setSelectedSupplier(null)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* VENDORS */}
                {activePage === 'Vendors' && (
                    <>
                        <section className="table-section">
                            <div className="fruit-page-header">
                                <h3>Registered Vendors</h3>

                                <button
                                    type="button"
                                    className="submit-button"
                                    onClick={() => {
                                        resetVendorForm();
                                        setMessage('');
                                        setShowVendorModal(true);
                                    }}
                                >
                                    Add Vendor
                                </button>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Vendor ID</th>
                                        <th>Vendor Name</th>
                                        <th>Phone Number</th>
                                        <th>Location</th>
                                        <th>Registration Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vendors.length > 0 ? (
                                        vendors.map(vendor => (
                                            <tr key={vendor.vendor_id}>
                                                <td>{vendor.vendor_id}</td>
                                                <td>{vendor.vendor_name}</td>
                                                <td>{vendor.phone_number}</td>
                                                <td>{vendor.location}</td>
                                                <td>{String(vendor.registration_date).slice(0, 10)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No vendors registered yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {message && <p className="message">{message}</p>}
                        </section>

                        {/* REGISTER VENDOR POPUP */}
                        {showVendorModal && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content">
                                    <h3>Register New Vendor</h3>

                                    <form onSubmit={handleAddVendor}>
                                        <div className="form-group">
                                            <label>Vendor Name</label>
                                            <input
                                                value={vendorName}
                                                onChange={e => setVendorName(e.target.value)}
                                                placeholder="Enter vendor name"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={e => setPhoneNumber(e.target.value)}
                                                placeholder="Enter phone number"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Location</label>
                                            <input
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                                placeholder="Enter location"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Registration Date</label>
                                            <input
                                                type="date"
                                                value={registrationDate}
                                                onChange={e => setRegistrationDate(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="submit-button">
                                            Register Vendor
                                        </button>

                                        <button
                                            type="button"
                                            className="submit-button cancel-button"
                                            onClick={resetVendorForm}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* PURCHASES */}
                {activePage === 'Purchases' && (
                    <>
                        <section className="form-section">
                            <h3>Record New Purchase</h3>

                            {loading ? (
                                <p>Loading purchase information...</p>
                            ) : (
                                <form onSubmit={handlePurchaseSubmit}>
                                    <div className="form-group">
                                        <label>Supplier</label>
                                        <select
                                            value={purchaseSupplierId}
                                            onChange={e => setPurchaseSupplierId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select supplier</option>
                                            {suppliers.map(supplier => (
                                                <option
                                                    key={supplier.supplier_id}
                                                    value={supplier.supplier_id}
                                                >
                                                    {supplier.business_name || supplier.supplier_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Purchase Date</label>
                                        <input
                                            type="date"
                                            value={purchaseDate}
                                            onChange={e => setPurchaseDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <h3>Fruit Items</h3>

                                    {purchaseItems.map((item, index) => (
                                        <div className="purchase-item" key={index}>
                                            <div className="form-group">
                                                <label>Fruit</label>
                                                <select
                                                    value={item.fruit_id}
                                                    onChange={e =>
                                                        updatePurchaseItem(index, 'fruit_id', e.target.value)
                                                    }
                                                    required
                                                >
                                                    <option value="">Select fruit</option>
                                                    {fruits
                                                        .filter(fruit =>
                                                            requiredFruits.some(required =>
                                                                required.toLowerCase() ===
                                                                String(fruit.fruit_name).trim().toLowerCase()
                                                            )
                                                        )
                                                        .map(fruit => (
                                                            <option
                                                                key={fruit.fruit_id}
                                                                value={fruit.fruit_id}
                                                            >
                                                                {fruit.fruit_name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Packaging Size</label>
                                                <select
                                                    value={item.packaging_size}
                                                    onChange={e =>
                                                        updatePurchaseItem(index, 'packaging_size', e.target.value)
                                                    }
                                                >
                                                    <option value="Small">Small (5 kg)</option>
                                                    <option value="Medium">Medium (10 kg)</option>
                                                    <option value="Large">Large (20 kg)</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Quantity (Boxes)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={item.quantity}
                                                    onChange={e =>
                                                        updatePurchaseItem(index, 'quantity', e.target.value)
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Unit Cost</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_cost}
                                                    onChange={e =>
                                                        updatePurchaseItem(index, 'unit_cost', e.target.value)
                                                    }
                                                    placeholder="Enter cost per box"
                                                    required
                                                />
                                            </div>

                                            {purchaseItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="action-button delete-button"
                                                    onClick={() => removePurchaseItem(index)}
                                                >
                                                    Remove Item
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="submit-button"
                                        onClick={openPurchaseItemModal}
                                    >
                                        Add Another Fruit
                                    </button>

                                    <p className="purchase-total">
                                        <strong>Purchase Total: </strong>
                                        {purchaseTotal.toFixed(2)}
                                    </p>

                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={loading || suppliers.length === 0 || fruits.length === 0}
                                    >
                                        Record Purchase
                                    </button>
                                </form>
                            )}

                            {suppliers.length === 0 && !loading && (
                                <p>Please register a supplier before recording a purchase.</p>
                            )}

                            {fruits.filter(fruit =>
                                requiredFruits.some(required =>
                                    required.toLowerCase() ===
                                    String(fruit.fruit_name).trim().toLowerCase()
                                )
                            ).length === 0 && !loading && (
                                <p>Please make sure the five required fruits are registered.</p>
                            )}

                            {message && <p className="message">{message}</p>}
                        </section>

                        {/* ADD ANOTHER FRUIT POPUP */}
                        {showPurchaseItemModal && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content">
                                    <h3>Add Fruit Item</h3>

                                    <form onSubmit={handleAddPurchaseItem}>
                                        <div className="form-group">
                                            <label>Fruit</label>
                                            <select
                                                value={newPurchaseItem.fruit_id}
                                                onChange={e =>
                                                    setNewPurchaseItem({
                                                        ...newPurchaseItem,
                                                        fruit_id: e.target.value
                                                    })
                                                }
                                                required
                                            >
                                                <option value="">Select fruit</option>
                                                {fruits
                                                    .filter(fruit =>
                                                        requiredFruits.some(required =>
                                                            required.toLowerCase() ===
                                                            String(fruit.fruit_name).trim().toLowerCase()
                                                        )
                                                    )
                                                    .map(fruit => (
                                                        <option
                                                            key={fruit.fruit_id}
                                                            value={fruit.fruit_id}
                                                        >
                                                            {fruit.fruit_name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Packaging Size</label>
                                            <select
                                                value={newPurchaseItem.packaging_size}
                                                onChange={e =>
                                                    setNewPurchaseItem({
                                                        ...newPurchaseItem,
                                                        packaging_size: e.target.value
                                                    })
                                                }
                                            >
                                                <option value="Small">Small (5 kg)</option>
                                                <option value="Medium">Medium (10 kg)</option>
                                                <option value="Large">Large (20 kg)</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Quantity (Boxes)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={newPurchaseItem.quantity}
                                                onChange={e =>
                                                    setNewPurchaseItem({
                                                        ...newPurchaseItem,
                                                        quantity: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Unit Cost</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={newPurchaseItem.unit_cost}
                                                onChange={e =>
                                                    setNewPurchaseItem({
                                                        ...newPurchaseItem,
                                                        unit_cost: e.target.value
                                                    })
                                                }
                                                placeholder="Enter cost per box"
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="submit-button">
                                            Add Fruit
                                        </button>

                                        <button
                                            type="button"
                                            className="submit-button cancel-button"
                                            onClick={closePurchaseItemModal}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* STOCK MANAGEMENT */}
                {activePage === 'Stock Management' && (
                    <section className="table-section">
                        <div className="fruit-page-header">
                            <h3>Current Stock</h3>

                            <button
                                type="button"
                                className="submit-button"
                                onClick={fetchStock}
                                disabled={loading}
                            >
                                Refresh Stock
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading stock information...</p>
                        ) : (
                            <>
                                <div className="dashboard-stats">
                                    <div className="stat-item">
                                        <h3>Total Available Boxes</h3>
                                        <p>{totalBoxes}</p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Stock Records</h3>
                                        <p>{stock.length}</p>
                                    </div>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Stock ID</th>
                                            <th>Fruit</th>
                                            <th>Packaging Size</th>
                                            <th>Available Quantity (Boxes)</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {stock.length > 0 ? (
                                            stock.map((item, index) => (
                                                <tr key={item.stock_id || index}>
                                                    <td>{item.stock_id || '-'}</td>
                                                    <td>
                                                        {item.fruit_name || `Fruit ID: ${item.fruit_id}`}
                                                    </td>
                                                    <td>{item.packaging_size}</td>
                                                    <td>{item.available_quantity}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">No stock records were found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {message && <p className="message">{message}</p>}
                    </section>
                )}

                {/* SALES */}
                {activePage === 'Sales' && (
                    <section className="table-section">

                        <div className="fruit-page-header">
                            <div>
                                <h3>Sales Management</h3>
                                <p>Record sales and manage vendor payments.</p>
                            </div>

                            <button
                                type="button"
                                className="submit-button"
                                onClick={openSaleModal}
                                disabled={loading || vendors.length === 0 || fruits.length === 0}
                            >
                                Add Sale
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading sales information...</p>
                        ) : (
                            <div className="sales-overview">
                                <div className="dashboard-stats">
                                    <div className="stat-item">
                                        <h3>Registered Vendors</h3>
                                        <p>{vendors.length}</p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Available Fruits</h3>
                                        <p>{fruits.length}</p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Available Boxes</h3>
                                        <p>{totalBoxes}</p>
                                    </div>
                                </div>

                                <div className="sales-information">
                                    <h3>Record a Sale</h3>
                                    <p>
                                        Select Add Sale to enter the vendor, fruit items,
                                        quantities and payment information.
                                    </p>
                                </div>
                             
                                <div className="sales-information">
   

   {showPaymentSelection && (
        <div className="fruit-modal">
            <div className="fruit-modal-content">
                <h3>Record Additional Payment</h3>

<div className="form-group">
    <label>Select Sale</label>
    <select
        value={selectedPaymentSale ? selectedPaymentSale.sale_id : ''}
        onChange={(e) => {
            const selectedSale = sales.find(
                sale => String(sale.sale_id) === e.target.value
            );

            setSelectedPaymentSale(selectedSale || null);
        }}
        required
    >
        <option value="">Choose a sale</option>

        {sales
            .filter(sale => Number(sale.outstanding_balance) > 0)
            .map(sale => (
                <option key={sale.sale_id} value={sale.sale_id}>
                    Sale #{sale.sale_id} - {sale.vendor_name} - Outstanding: M
                    {Number(sale.outstanding_balance).toFixed(2)}
                </option>
            ))}
    </select>
</div>

{selectedPaymentSale && (
    <p>
        Outstanding Balance: M
        {Number(selectedPaymentSale.outstanding_balance).toFixed(2)}
    </p>
)}

                <form onSubmit={handleRecordPayment}>
                    <div className="form-group">
                        <label>Payment Amount (M)</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={additionalPayment}
                            onChange={(e) => setAdditionalPayment(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Method</label>
                        <select
                            value={additionalPaymentMethod}
                            onChange={(e) => setAdditionalPaymentMethod(e.target.value)}
                        >
                            <option value="CASH">Cash</option>
                            <option value="MOBILE_MONEY">Mobile Money</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Save Payment
                        </button>

                        <button
    type="button"
    className="cancel-button"
    onClick={() => {
        setShowPaymentSelection(false);
        setSelectedPaymentSale(null);
        setAdditionalPayment('');
        setAdditionalPaymentMethod('CASH');
    }}
>
    Cancel
</button>
                    </div>
                </form>
            </div>
        </div>
    )}<div className="fruit-page-header">
        <div>
            <h3>Sales History</h3>
            <p>View all recorded sales and their payment details.</p>
        </div>
</div>
    

        <button
            type="button"
            className="submit-button"
            onClick={fetchSales}
        >
            Refresh Sales
        </button>
        
        <button
    type="button"
    className="submit-button"
    onClick={() => {
        setSelectedPaymentSale(null);
        setAdditionalPayment('');
        setAdditionalPaymentMethod('CASH');
        setShowPaymentSelection(true);
    }}


>
    Record Payment
</button>
    </div>

    {sales.length === 0 ? (
        <p>No sales have been recorded yet.</p>
    ) : (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Sale ID</th>
                        <th>Vendor</th>
                        <th>Sale Date</th>
                        <th>Total Amount</th>
                        <th>Amount Paid</th>
                        <th>Outstanding Balance</th>
                        <th>Payment Method</th>
                        <th>Payment Status</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.sale_id}>
                            <td>{sale.sale_id}</td>
                            <td>{sale.vendor_name}</td>
                            <td>
                                {new Date(sale.sale_date).toLocaleDateString('en-GB')}
                            </td>
                            <td>M {Number(sale.total_amount).toFixed(2)}</td>
                            <td>M {Number(sale.amount_paid).toFixed(2)}</td>
                            <td>M {Number(sale.outstanding_balance).toFixed(2)}</td>
                            <td>
                                {sale.payment_method.replace(/_/g, ' ')}
                            </td>
                            <td>
                                {sale.payment_status.replace(/_/g, ' ')}
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
</div>
                            
                            
                            
                        )}
                        

                        {vendors.length === 0 && !loading && (
                            <p className="message">
                                Please register a vendor before recording a sale.
                            </p>
                        )}

                        {fruits.length === 0 && !loading && (
                            <p className="message">
                                Please register the five required fruits before recording a sale.
                            </p>
                        )}

                        {boxPrices.length === 0 && !loading && (
                            <p className="message">
                                Packaging prices could not be loaded. Please configure the prices before recording sales.
                            </p>
                        )}

                        {message && <p className="message">{message}</p>}

                        {/* ADD SALE POPUP */}
                        {showSaleModal && (
                            <div className="fruit-modal">
                                <div className="fruit-modal-content sales-modal-content">

                                    <div className="sales-modal-heading">
                                        <div>
                                            <h3>Add New Sale</h3>
                                            <p>Complete the information below to record a sale.</p>
                                        </div>

                                        <button
                                            type="button"
                                            className="sales-close-button"
                                            onClick={closeSaleModal}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaleSubmit}>

                                        {/* SALE INFORMATION */}
                                        <div className="sales-card">
                                            <h4>1. Sale Information</h4>

                                            <div className="sales-grid">
                                                <div className="form-group">
                                                    <label>Vendor</label>

                                                    <select
                                                        value={saleVendorId}
                                                        onChange={e => setSaleVendorId(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select vendor</option>

                                                        {vendors.map(vendor => (
                                                            <option
                                                                key={vendor.vendor_id}
                                                                value={vendor.vendor_id}
                                                            >
                                                                {vendor.vendor_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Sale Date</label>

                                                    <input
                                                        type="date"
                                                        value={saleDate}
                                                        onChange={e => setSaleDate(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* FRUIT ITEMS */}
                                        <div className="sales-card">
                                            <div className="sales-card-heading">
                                                <h4>2. Fruit Items</h4>

                                                <button
                                                    type="button"
                                                    className="submit-button"
                                                    onClick={addSaleItem}
                                                >
                                                    Add Another Fruit
                                                </button>
                                            </div>

                                            {saleItems.map((item, index) => {
                                                const unitPrice = getSalePrice(item.packaging_size);
                                                const quantity = Number(item.quantity) || 0;
                                                const itemTotal = unitPrice * quantity;

                                                const available = item.fruit_id
                                                    ? getAvailableStock(
                                                        item.fruit_id,
                                                        item.packaging_size
                                                    )
                                                    : 0;

                                                return (
                                                    <div className="sales-item" key={index}>
                                                        <div className="sales-item-heading">
                                                            <h5>Fruit Item {index + 1}</h5>

                                                            {saleItems.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="action-button delete-button"
                                                                    onClick={() => removeSaleItem(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="sales-grid">
                                                            <div className="form-group">
                                                                <label>Fruit</label>

                                                                <select
                                                                    value={item.fruit_id}
                                                                    onChange={e =>
                                                                        updateSaleItem(
                                                                            index,
                                                                            'fruit_id',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    required
                                                                >
                                                                    <option value="">Select fruit</option>

                                                                    {fruits.map(fruit => (
                                                                        <option
                                                                            key={fruit.fruit_id}
                                                                            value={fruit.fruit_id}
                                                                        >
                                                                            {fruit.fruit_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Packaging Size</label>

                                                                <select
                                                                    value={item.packaging_size}
                                                                    onChange={e =>
                                                                        updateSaleItem(
                                                                            index,
                                                                            'packaging_size',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                >
                                                                    {packagingSizes.map(size => (
                                                                        <option
                                                                            key={size.name}
                                                                            value={size.name}
                                                                        >
                                                                            {size.name} ({size.weight} kg)
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Quantity (Boxes)</label>

                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    step="1"
                                                                    value={item.quantity}
                                                                    onChange={e =>
                                                                        updateSaleItem(
                                                                            index,
                                                                            'quantity',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Available Stock</label>

                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    value={
                                                                        item.fruit_id
                                                                            ? `${available} boxes`
                                                                            : 'Select a fruit'
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Selling Price per Box</label>

                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    value={
                                                                        unitPrice > 0
                                                                            ? `M ${unitPrice.toFixed(2)}`
                                                                            : 'Price not configured'
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Item Total</label>

                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    value={`M ${itemTotal.toFixed(2)}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* PAYMENT INFORMATION */}
                                        <div className="sales-card">
                                            <h4>3. Payment Information</h4>

                                            <div className="sales-grid">
                                                <div className="form-group">
                                                    <label>Payment Method</label>

                                                    <select
                                                      value={paymentMethod}
onChange={e => {
    setPaymentMethod(e.target.value);
    setAmountPaid('');
}}
                                                    >
                                                        <option value="CASH">Cash</option>
                                                        <option value="MOBILE_MONEY">Mobile Money</option>
                                                        <option value="CREDIT">Credit</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Amount Paid (M)</label>

                                                   <input
    type="number"
    min="0"
    max={saleTotal}
    step="0.01"
    value={amountPaid}
    onChange={e => setAmountPaid(e.target.value)}
    disabled={saleTotal <= 0 || paymentMethod === 'CREDIT'}
    required={paymentMethod !== 'CREDIT'}
/>
                                                </div>
                                            </div>

                                            {paymentMethod === 'CREDIT' && (
                                                <p className="sales-note">
                                                    Credit sales are recorded with no initial payment.
                                                    The outstanding amount will be calculated automatically.
                                                </p>
                                            )}

                                            <div className="sales-summary">
                                                <div>
                                                    <span>Sale Total</span>
                                                    <strong>M {saleTotal.toFixed(2)}</strong>
                                                </div>

                                                <div>
                                                    <span>Amount Paid</span>
                                                    <strong>
                                                        M {(Number(amountPaid) || 0).toFixed(2)}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Outstanding Balance</span>
                                                    <strong>
                                                        M {outstandingBalance.toFixed(2)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>

                                        {message && (
                                            <p className="message">{message}</p>
                                        )}

                                        {/* FORM ACTIONS */}
                                        <div className="sales-form-actions">
                                            <button
                                                type="button"
                                                className="submit-button cancel-button"
                                                onClick={closeSaleModal}
                                                disabled={savingSale}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="submit-button"
                                                disabled={
                                                    savingSale ||
                                                    loading ||
                                                    vendors.length === 0 ||
                                                    fruits.length === 0 ||
                                                    boxPrices.length === 0
                                                }
                                            >
                                                {savingSale ? 'Recording Sale...' : 'Record Sale'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* SALE RECEIPT */}
                        {lastSale && (
                            <div className="sales-receipt">
                                <h3>Sale Recorded Successfully</h3>

                                <p>
                                    <strong>Sale ID:</strong> {lastSale.sale_id}
                                </p>

                                <p>
                                    <strong>Total Amount:</strong> M{' '}
                                    {Number(lastSale.total_amount).toFixed(2)}
                                </p>

                                <p>
                                    <strong>Amount Paid:</strong> M{' '}
                                    {Number(lastSale.amount_paid).toFixed(2)}
                                </p>

                                <p>
                                    <strong>Outstanding Balance:</strong> M{' '}
                                    {Number(lastSale.outstanding_balance).toFixed(2)}
                                </p>

                                <p>
                                    <strong>Payment Method:</strong> {lastSale.payment_method}
                                </p>

                                <p>
                                    <strong>Payment Status:</strong> {lastSale.payment_status}
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* REPORTS */}
                {activePage === 'Reports' && (
                    <section className="dashboard-section">

                        <div className="fruit-page-header">
                            <div>
                                <h3>Distribution Reports</h3>
                                <p>
                                    View sales performance, vendor balances and distribution information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="submit-button"
                                onClick={loadReports}
                                disabled={loading}
                            >
                                {loading ? 'Refreshing...' : 'Refresh Reports'}
                            </button>
                        </div>

                        {/* REVENUE DATE FILTER */}
                        <div className="table-section">
                            <h3>Total Revenue Date Range</h3>

                            <div className="sales-grid">

                                <div className="form-group">
                                    <label>Start Date</label>

                                    <input
                                        type="date"
                                        value={reportStartDate}
                                        max={reportEndDate}
                                        onChange={e => setReportStartDate(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>End Date</label>

                                    <input
                                        type="date"
                                        value={reportEndDate}
                                        min={reportStartDate}
                                        max={new Date().toISOString().slice(0, 10)}
                                        onChange={e => setReportEndDate(e.target.value)}
                                    />
                                </div>

                            </div>

                            <button
                                type="button"
                                className="submit-button"
                                disabled={
                                    loading ||
                                    !reportStartDate ||
                                    !reportEndDate ||
                                    reportStartDate > reportEndDate
                                }
                                onClick={loadReports}
                            >
                                Generate Revenue Report
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading reports...</p>
                        ) : (
                            <>

                                {/* TOTAL REVENUE AND TOP VENDOR SUMMARY */}
                                <div className="dashboard-stats">

                                    <div className="stat-item">
                                        <h3>Total Revenue</h3>

                                        <p>
                                            M {Number(
                                                totalRevenue?.total_revenue || 0
                                            ).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Total Sales</h3>

                                        <p>
                                            {Number(
                                                totalRevenue?.total_sales || 0
                                            )}
                                        </p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Top Vendor</h3>

                                        <p>
                                            {topVendor?.vendor_name || 'No sales yet'}
                                        </p>
                                    </div>

                                    <div className="stat-item">
                                        <h3>Boxes Sold by Top Vendor</h3>

                                        <p>
                                            {Number(
                                                topVendor?.total_boxes_sold || 0
                                            )}
                                        </p>
                                    </div>

                                </div>

                                {/* VENDOR BALANCES REPORT */}
                                <div className="dashboard-stock">

                                    <h3>Vendor Outstanding Balances</h3>

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Vendor ID</th>
                                                <th>Vendor Name</th>
                                                <th>Total Sales (M)</th>
                                                <th>Amount Paid (M)</th>
                                                <th>Outstanding Balance (M)</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {vendorBalances.length > 0 ? (
                                                vendorBalances.map(vendor => (
                                                    <tr key={vendor.vendor_id}>
                                                        <td>{vendor.vendor_id}</td>

                                                        <td>{vendor.vendor_name}</td>

                                                        <td>
                                                            M {Number(
                                                                vendor.total_sales || 0
                                                            ).toFixed(2)}
                                                        </td>

                                                        <td>
                                                            M {Number(
                                                                vendor.amount_paid || 0
                                                            ).toFixed(2)}
                                                        </td>

                                                        <td>
                                                            M {Number(
                                                                vendor.outstanding_balance || 0
                                                            ).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5">
                                                        No vendor balance records found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>

                                {/* TOP SELLING FRUITS REPORT */}
                                <div className="dashboard-stock">

                                    <h3>Top-Selling Fruits</h3>

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Fruit ID</th>
                                                <th>Fruit Name</th>
                                                <th>Total Boxes Sold</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {topSellingFruits.length > 0 ? (
                                                topSellingFruits.map((fruit, index) => (
                                                    <tr key={fruit.fruit_id}>
                                                        <td>{index + 1}</td>

                                                        <td>{fruit.fruit_id}</td>

                                                        <td>{fruit.fruit_name}</td>

                                                        <td>
                                                            {Number(
                                                                fruit.total_quantity_sold || 0
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">
                                                        No fruit sales records found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>

                                {/* TOP VENDOR REPORT */}
                                <div className="dashboard-stock">

                                    <h3>Top Vendor Report</h3>

                                    {topVendor ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Vendor ID</th>
                                                    <th>Vendor Name</th>
                                                    <th>Total Boxes Purchased</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <td>{topVendor.vendor_id}</td>

                                                    <td>{topVendor.vendor_name}</td>

                                                    <td>
                                                        {Number(
                                                            topVendor.total_boxes_sold || 0
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No vendor sales records found.</p>
                                    )}

                                </div>

                            </>
                        )}

                        {message && (
                            <p className="message">{message}</p>
                        )}

                    </section>
                )}

            </main>
        </div>
    );
}

export default App;
