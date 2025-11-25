const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const { JWT_SECRET } = require('../config/env')

/**
 * POST /api/auth/register
 * Register a new user with Free plan by default
 */
const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Email and password are required' 
      })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists', 
        message: 'An account with this email already exists' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Get Free plan
    const freePlan = await prisma.plan.findUnique({ where: { name: 'Free' } })
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        planId: freePlan?.id || null
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            maxFiles: true,
            maxCharts: true,
            maxDashboards: true
          }
        }
      }
    })

    // Log registration
    await prisma.usageLog.create({
      data: {
        userId: user.id,
        action: 'user_signup',
        details: { email }
      }
    })

    res.status(201).json({ 
      message: 'User created successfully', 
      user 
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Email and password are required' 
      })
    }

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            maxFiles: true,
            maxCharts: true,
            maxDashboards: true
          }
        }
      }
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials', 
        message: 'Email or password is incorrect' 
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials', 
        message: 'Email or password is incorrect' 
      })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Log login
    await prisma.usageLog.create({
      data: {
        userId: user.id,
        action: 'user_login',
        details: { timestamp: new Date() }
      }
    })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        plan: user.plan
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 * Requires: authenticate middleware
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            maxFiles: true,
            maxCharts: true,
            maxDashboards: true,
            price: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }

    // Transform to snake_case for frontend
    const response = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      plan: user.plan ? {
        id: user.plan.id,
        name: user.plan.name,
        maxFiles: user.plan.maxFiles,
        maxCharts: user.plan.maxCharts,
        maxDashboards: user.plan.maxDashboards,
        price: parseFloat(user.plan.price)
      } : null
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/auth/logout
 * Logout (client-side removes token)
 */
const logout = async (req, res, next) => {
  try {
    // Log logout
    await prisma.usageLog.create({
      data: {
        userId: req.user.id,
        action: 'user_logout',
        details: { timestamp: new Date() }
      }
    })

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/auth/upgrade-plan
 * Upgrade user's subscription plan
 */
const upgradePlan = async (req, res, next) => {
  try {
    const { planId } = req.body
    const userId = req.user.id

    if (!planId) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Plan ID is required' 
      })
    }

    // Verify plan exists
    const plan = await prisma.plan.findUnique({ 
      where: { id: planId },
      select: {
        id: true,
        name: true,
        maxFiles: true,
        maxCharts: true,
        maxDashboards: true,
        price: true
      }
    })

    if (!plan) {
      return res.status(404).json({ 
        error: 'Plan not found', 
        message: 'The selected plan does not exist' 
      })
    }

    // Update user's plan
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { planId },
      select: {
        id: true,
        email: true,
        fullName: true,
        plan: {
          select: {
            id: true,
            name: true,
            maxFiles: true,
            maxCharts: true,
            maxDashboards: true,
            price: true
          }
        }
      }
    })

    // Log the upgrade
    await prisma.usageLog.create({
      data: {
        userId,
        action: 'plan_upgrade',
        details: { 
          planId,
          planName: plan.name,
          timestamp: new Date()
        }
      }
    })

    res.json({ 
      message: 'Plan upgraded successfully', 
      user: updatedUser 
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getMe, logout, upgradePlan }

