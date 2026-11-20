
const fruitModel = require('../models/fruitModel');

// Add a new fruit
async function createFruit(req, res) {
    try {
        const { fruit_name, description, status } = req.body;

        if (!fruit_name || !description || !status) {
            return res.status(400).json({
                message: 'Fruit name, description and status are required.'
            });
        }

        const result = await fruitModel.createFruit({
            fruit_name: fruit_name.trim(),
            description: description.trim(),
            status
        });

        return res.status(201).json({
            message: 'Fruit added successfully.',
            fruit_id: result.insertId
        });

    } catch (error) {
        console.error('Create fruit error:', error);

        return res.status(500).json({
            message: error.code === 'ER_DUP_ENTRY'
                ? 'This fruit already exists.'
                : 'Failed to add fruit.'
        });
    }
}

// Retrieve all fruits
async function getAllFruits(req, res) {
    try {
        const fruits = await fruitModel.getAllFruits();

        return res.status(200).json(fruits);

    } catch (error) {
        console.error('Get fruits error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve fruits.'
        });
    }
}

// Retrieve one fruit
async function getFruitById(req, res) {
    try {
        const fruit = await fruitModel.getFruitById(req.params.id);

        if (!fruit) {
            return res.status(404).json({
                message: 'Fruit not found.'
            });
        }

        return res.status(200).json(fruit);

    } catch (error) {
        console.error('Get fruit error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve fruit.'
        });
    }
}

// Update a fruit
async function updateFruit(req, res) {
    try {
        const { fruit_name, description, status } = req.body;

        if (!fruit_name || !description || !status) {
            return res.status(400).json({
                message: 'Fruit name, description and status are required.'
            });
        }

        const existingFruit = await fruitModel.getFruitById(req.params.id);

        if (!existingFruit) {
            return res.status(404).json({
                message: 'Fruit not found.'
            });
        }

        const result = await fruitModel.updateFruit(req.params.id, {
            fruit_name: fruit_name.trim(),
            description: description.trim(),
            status
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Fruit was not updated.'
            });
        }

        return res.status(200).json({
            message: 'Fruit updated successfully.'
        });

    } catch (error) {
        console.error('Update fruit error:', error);

        return res.status(500).json({
            message: error.code === 'ER_DUP_ENTRY'
                ? 'Another fruit already uses that name.'
                : 'Failed to update fruit.'
        });
    }
}

// Permanently delete a fruit
async function deleteFruit(req, res) {
    try {
        const result = await fruitModel.deleteFruit(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Fruit not found.'
            });
        }

        return res.status(200).json({
            message: 'Fruit and its related records permanently deleted.'
        });

    } catch (error) {
        console.error('Delete fruit error:', error);

        if (error.message === 'Fruit not found.') {
            return res.status(404).json({
                message: 'Fruit not found.'
            });
        }

        return res.status(500).json({
            message: 'Failed to permanently delete fruit.'
        });
    }
}

module.exports = {
    createFruit,
    getAllFruits,
    getFruitById,
    updateFruit,
    deleteFruit
};
