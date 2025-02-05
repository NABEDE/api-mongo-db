const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// Route to add a product
router.post('/addproduct', authMiddleware, async (req, res) => {
    try {
        const { name, brand, price, stock, category } = req.body;

        // Check if all required fields are provided
        if (!name || !brand || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({ name, brand, price, stock, category });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});




// Route protégée pour récupérer tous les produits (nécessite un token)
router.get('/printproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// Route protégée pour récupérer un produit spécifique
router.get('/printproduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

module.exports = router;
