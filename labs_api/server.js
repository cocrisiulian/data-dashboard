/*
  Labs API (Express)  MVC Architecture
  - PostgreSQL Database via Prisma ORM
  - JWT Authentication (bcrypt + jsonwebtoken)
  - Strict MVC Pattern: Controllers, Routes, Middleware
  
  Run:
    npm run labs:dev
  
  Env Variables (.env):
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    JWT_SECRET=your_jwt_secret_key
    PORT=4000
*/

require('dotenv/config')
const express = require('express')
const cors = require('cors')
const path = require('path')
const { PORT } = require('./config/env')
const { errorHandler } = require('./middleware/errorHandler')

// Import routes
const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboards')
const planRoutes = require('./routes/plans')
const fileRoutes = require('./routes/files')
const chartRoutes = require('./routes/charts')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/dashboards', dashboardRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/charts', chartRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Cannot ${req.method} ${req.path}`
  })
})

// Error Handler (must be last)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(` Labs API (MVC) running on http://localhost:${PORT}`)
  console.log(` Health check: http://localhost:${PORT}/health`)
  console.log(` Auth endpoints: http://localhost:${PORT}/api/auth/*`)
  console.log(` Dashboard endpoints: http://localhost:${PORT}/api/dashboards/*`)
  console.log(` Plan endpoints: http://localhost:${PORT}/api/plans/*`)
  console.log(` File endpoints: http://localhost:${PORT}/api/files/*`)
  console.log(` Chart endpoints: http://localhost:${PORT}/api/charts/*`)
})

module.exports = app
