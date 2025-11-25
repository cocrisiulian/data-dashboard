const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')

/**
 * Middleware to verify JWT token and attach user to request
 * Usage: Add this middleware to protected routes
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No token provided' 
      })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded // { id, email }
      next()
    } catch (err) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid or expired token' 
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { authenticate }
