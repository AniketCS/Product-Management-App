const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      })
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7)

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
        return res.status(401).json({
          message: 'Token is valid but user not found.'
        })
      }

      // Add user to request object
      req.user = user
      next()
      
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Invalid token.'
        })
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired.'
        })
      } else {
        return res.status(401).json({
          message: 'Token verification failed.'
        })
      }
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      message: 'Server error in authentication.'
    })
  }
}

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // Continue without user
    }

    const token = authHeader.substring(7)

    if (!token) {
      return next() // Continue without user
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')
      
      if (user) {
        req.user = user
      }
      
      next()
      
    } catch (error) {
      // Continue without user if token is invalid
      next()
    }
    
  } catch (error) {
    // Continue without user on error
    next()
  }
}

module.exports = {
  authMiddleware,
  optionalAuth
} 