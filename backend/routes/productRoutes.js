const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { validateProduct, handleValidationErrors } = require('../middleware/validation')
const { authMiddleware } = require('../middleware/authMiddleware')

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination, sorting, and filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: '-createdAt'
 *         description: Sort field(s) (prefix with '-' for descending)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for title and description
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *                   properties:
 *                     keyword:
 *                       type: string
 *                     sort:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      keyword = ''
    } = req.query

    // Parse pagination parameters
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    // Build query object for filtering
    const query = {}
    
    // Add keyword search if provided
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    }

    // Build sort object
    let sortObj = {}
    if (sort) {
      const sortFields = sort.split(',')
      sortFields.forEach(field => {
        const order = field.startsWith('-') ? -1 : 1
        const fieldName = field.startsWith('-') ? field.slice(1) : field
        sortObj[fieldName] = order
      })
    }

    // Execute query with pagination and sorting
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email') // Include user info

    // Get total count for pagination
    const total = await Product.countDocuments(query)
    const totalPages = Math.ceil(total / limitNum)

    // Build pagination info
    const pagination = {
      currentPage: pageNum,
      totalPages,
      totalItems: total,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }

    res.status(200).json({
      message: 'Products retrieved successfully',
      products,
      pagination,
      filters: {
        keyword,
        sort
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Product title
 *               image:
 *                 type: string
 *                 format: uri
 *                 description: Product image URL
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 description: Product description
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Product price
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/products/my:
 *   get:
 *     summary: Get current user's products with pagination, sorting, and filtering
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: '-createdAt'
 *         description: Sort field(s) (prefix with '-' for descending)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for title and description
 *     responses:
 *       200:
 *         description: User's products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *                   properties:
 *                     keyword:
 *                       type: string
 *                     sort:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      keyword = ''
    } = req.query

    // Parse pagination parameters
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    // Build query object for filtering
    const query = { user: req.user._id }
    
    // Add keyword search if provided
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    }

    // Build sort object
    let sortObj = {}
    if (sort) {
      const sortFields = sort.split(',')
      sortFields.forEach(field => {
        const order = field.startsWith('-') ? -1 : 1
        const fieldName = field.startsWith('-') ? field.slice(1) : field
        sortObj[fieldName] = order
      })
    }

    // Execute query with pagination and sorting
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)

    // Get total count for pagination
    const total = await Product.countDocuments(query)
    const totalPages = Math.ceil(total / limitNum)

    // Build pagination info
    const pagination = {
      currentPage: pageNum,
      totalPages,
      totalItems: total,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }

    res.status(200).json({
      message: 'Your products retrieved successfully',
      products,
      pagination,
      filters: {
        keyword,
        sort
      }
    })

  } catch (error) {
    console.error('Error fetching user products:', error)
    res.status(500).json({
      message: 'Error fetching your products',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name email') // Include user info
    
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

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (owner only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               image:
 *                 type: string
 *                 format: uri
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *               price:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or invalid product ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not authorized to update this product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (owner only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not authorized to delete this product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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