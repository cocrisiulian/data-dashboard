/*
  Backend API (Express) - MVC Architecture
  - PostgreSQL Database via Prisma ORM
  - JWT Authentication (bcrypt + jsonwebtoken)
  - Strict MVC Pattern: Controllers, Routes, Middleware
  - Swagger UI for API Documentation: http://localhost:4000/api-docs
  
  Run:
    npm run backend:dev
  
  Env Variables (.env):
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    JWT_SECRET=your_jwt_secret_key
    PORT=4000
*/

require('dotenv/config')
const express = require('express')
const cors = require('cors')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const { PORT } = require('./config/env')
const { errorHandler } = require('./middleware/errorHandler')

// Import routes
const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboards')
const planRoutes = require('./routes/plans')
const fileRoutes = require('./routes/files')
const chartRoutes = require('./routes/charts')
const adminRoutes = require('./routes/admin')

const app = express()

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DataInsight Backend API',
      version: '1.0.0',
      description: 'REST API for DataInsight Dashboard - Complete documentation with interactive testing',
      contact: {
        name: 'API Support',
        email: 'support@datainsight.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./backend-api/routes/*.js', './backend-api/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger UI - Visual Interface for API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DataInsight API Documentation'
}));

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
app.use('/api/admin', adminRoutes)
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
  console.log(`✅ Backend API (Express MVC) running on http://localhost:${PORT}`)
  console.log(`📚 Swagger UI Documentation: http://localhost:${PORT}/api-docs`)
  console.log(`💚 Health check: http://localhost:${PORT}/health`)
  console.log(`\n🔗 API Endpoints:`)
  console.log(`   - Auth: http://localhost:${PORT}/api/auth/*`)
  console.log(`   - Admin: http://localhost:${PORT}/api/admin/*`)
  console.log(`   - Dashboards: http://localhost:${PORT}/api/dashboards/*`)
  console.log(`   - Plans: http://localhost:${PORT}/api/plans/*`)
  console.log(`   - Files: http://localhost:${PORT}/api/files/*`)
  console.log(`   - Charts: http://localhost:${PORT}/api/charts/*`)
  console.log(`\n💡 Open Swagger UI in browser for interactive API testing!`)
})

module.exports = app
