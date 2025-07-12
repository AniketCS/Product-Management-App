const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Load environment variables FIRST
require('dotenv').config()

const productRoutes = require('./routes/productRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/product-management-app'
    console.log('Attempting to connect to MongoDB...')
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('MongoDB Connected Successfully!')

    
  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message)
    console.error('Make sure MongoDB is running on your system')
    console.error('Check your MONGODB_URI in .env file')
    process.exit(1) // Exit the process on connection failure
  }
}

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  })
})

// Routes
app.use('/api/products', productRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
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
    // Connect to MongoDB first
    await connectDB()
    
    // Then start the Express server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`🌐 API URL: http://localhost:${PORT}`)
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`)
    })
    
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Promise Rejection:', err.message)
  process.exit(1)
})

// Start the application
startServer()
