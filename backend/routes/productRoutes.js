const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { validateProduct, handleValidationErrors } = require('../middleware/validation')
const { authMiddleware } = require('../middleware/authMiddleware')

// POST /api/products - Create a new product (protected)
router.post('/', authMiddleware, validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.user._id // Associate product with user
    })
    const savedProduct = await product.save()
    
    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      message: 'Error creating product',
      error: error.message
    })
  }
})

// GET /api/products - Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    
    res.status(200).json({
      message: 'Products retrieved successfully',
      products: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    })
  }
})

// GET /api/products/my - Get user's products (protected)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 })
    
    res.status(200).json({
      message: 'Your products retrieved successfully',
      products: products
    })
  } catch (error) {
    console.error('Error fetching user products:', error)
    res.status(500).json({
      message: 'Error fetching your products',
      error: error.message
    })
  }
})

// GET /api/products/:id - Get a single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }
    
    res.status(200).json({
      message: 'Product retrieved successfully',
      product: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid product ID'
      })
    }
    
    res.status(500).json({
      message: 'Error fetching product',
      error: error.message
    })
  }
})

// PUT /api/products/:id - Update a product (protected, owner only)
router.put('/:id', authMiddleware, validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }
    
    // Check if user owns the product
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this product'
      })
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid product ID'
      })
    }
    
    res.status(500).json({
      message: 'Error updating product',
      error: error.message
    })
  }
})

// DELETE /api/products/:id - Delete a product (protected, owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }
    
    // Check if user owns the product
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this product'
      })
    }
    
    await Product.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
      message: 'Product deleted successfully',
      product: product
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid product ID'
      })
    }
    
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message
    })
  }
})

module.exports = router 