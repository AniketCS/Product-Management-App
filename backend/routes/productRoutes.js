const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { validateProduct, handleValidationErrors } = require('../middleware/validation')

// POST /api/products - Create a new product
router.post('/', validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const product = new Product(req.body)
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

// GET /api/products - Get all products
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

// GET /api/products/:id - Get a single product by ID
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

// PUT /api/products/:id - Update a product
router.put('/:id', validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }
    
    res.status(200).json({
      message: 'Product updated successfully',
      product: product
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

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }
    
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