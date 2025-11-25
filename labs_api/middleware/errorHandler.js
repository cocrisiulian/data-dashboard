/**
 * Centralized error handling middleware
 * Should be registered LAST in Express app
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Duplicate entry',
      message: 'A record with this value already exists',
      field: err.meta?.target?.[0] || 'unknown'
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not found',
      message: 'The requested resource does not exist'
    })
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = { errorHandler }
