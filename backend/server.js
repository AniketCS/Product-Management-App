const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./config/swagger')

// Load environment variables FIRST
require('dotenv').config()

const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

// CORS Configuration - Open for debugging
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Product Management API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true
  }
}))

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-management-app'
    console.log('Attempting to connect to MongoDB...')
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('MongoDB Connected Successfully!')

    
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message)

  }
}

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    documentation: '/api-docs'
  })
})

// Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server function
const startServer = async () => {
  try {
    // Check for required environment variables
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables')
      console.error('Add JWT_SECRET to your .env file')
      process.exit(1)
    }

    // Connect to MongoDB first
    await connectDB()
    
    // Then start the Express server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`API URL: http://localhost:${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`Auth endpoints: /api/auth/register, /api/auth/login`)
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`)
      console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`)
    })
    
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message)
  process.exit(1)
})

// Start the application
startServer()
