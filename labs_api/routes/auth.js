const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const { register, login, getMe, logout, upgradePlan } = require('../controllers/authController')

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', authenticate, getMe)
router.post('/logout', authenticate, logout)
router.patch('/upgrade-plan', authenticate, upgradePlan)

module.exports = router
