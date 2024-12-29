const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add a new product
router.post('/add-product', async (req, res) => {
    try {
        const { productId, productName, description, price, lowResImage, highResImage } = req.body;

        if (!productId || !productName || !description || !price || !lowResImage || !highResImage) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newProduct = new Product({
            productId,
            productName,
            description,
            price,
            lowResImage,
            highResImage,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all products (optional)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
