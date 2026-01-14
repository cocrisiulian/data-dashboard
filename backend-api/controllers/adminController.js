const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

// ==================== USER MANAGEMENT ====================

// GET /api/admin/users - Get all users with plan info
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        plan: true,
        _count: {
          select: {
            files: { where: { deletedAt: null } },
            dashboards: { where: { deletedAt: null } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Don't send password hashes
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(sanitizedUsers);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id - Get single user with full details
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        plan: true,
        files: {
          where: { deletedAt: null },
          orderBy: { uploadedAt: 'desc' },
          take: 10
        },
        dashboards: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            files: { where: { deletedAt: null } },
            dashboards: { where: { deletedAt: null } }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users - Create new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, planId, isAdmin } = req.body;

    // Validation
    if (!name || !email || !password || !planId) {
      return res.status(400).json({ 
        message: 'Name, email, password and planId are required' 
      });
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already in use' 
      });
    }

    // Verify plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: String(planId) }
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
        planId: String(planId),
        isAdmin: isAdmin === true
      },
      include: { plan: true }
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'USER_CREATED_BY_ADMIN',
        entity: 'User',
        entityId: newUser.id,
        metadata: { email: newUser.email }
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id - Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, planId, isAdmin, password } = req.body;

    // Check user exists
    const existingUser = await prisma.user.findFirst({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from removing their own admin status
    if (id === req.user.id && isAdmin === false) {
      return res.status(403).json({ 
        message: 'Cannot remove your own admin privileges' 
      });
    }

    // Check email uniqueness if changed
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(400).json({ 
          message: 'Email already in use' 
        });
      }
    }

    // Verify plan if changed
    if (planId) {
      const plan = await prisma.plan.findUnique({
        where: { id: String(planId) }
      });

      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
    }

    // Build update data
    const updateData = {};
    if (name) updateData.fullName = name;
    if (email) updateData.email = email;
    if (planId) updateData.planId = String(planId);
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    
    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { plan: true }
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'USER_UPDATED_BY_ADMIN',
        entity: 'User',
        entityId: updatedUser.id,
        metadata: { email: updatedUser.email }
      }
    });

    // Remove password
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id - Soft delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check user exists
    const user = await prisma.user.findFirst({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(403).json({ 
        message: 'Cannot delete your own account' 
      });
    }

    // Delete user (hard delete - User model has no soft delete)
    await prisma.user.delete({
      where: { id }
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'USER_DELETED_BY_ADMIN',
        entity: 'User',
        entityId: id,
        metadata: { email: user.email }
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== ACTIVITY LOGS ====================

// GET /api/admin/logs - Get activity logs with filters
exports.getActivityLogs = async (req, res, next) => {
  try {
    const { 
      action, 
      userId, 
      entityType,
      limit = 100,
      page = 1 
    } = req.query;

    // Build where clause
    const where = {};
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (entityType) where.entity = entityType;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get logs with user info
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.activityLog.count({ where })
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== STATISTICS ====================

// GET /api/admin/stats - Get admin dashboard statistics
exports.getStatistics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalFiles,
      totalDashboards,
      planDistribution,
      recentActivity
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Users active in last 30 days
      prisma.activityLog.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        distinct: ['userId']
      }),
      
      // Total active files
      prisma.file.count({
        where: { deletedAt: null }
      }),
      
      // Total active dashboards
      prisma.dashboard.count({
        where: { deletedAt: null }
      }),
      
      // Plan distribution
      prisma.plan.findMany({
        include: {
          _count: {
            select: {
              users: {
                where: { deletedAt: null }
              }
            }
          }
        }
      }),
      
      // Recent activity (last 10)
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    res.json({
      totalUsers,
      activeUsers: activeUsers.length,
      totalFiles,
      totalDashboards,
      planDistribution: planDistribution.map(plan => ({
        id: plan.id,
        name: plan.name,
        userCount: plan._count.users,
        price: plan.price
      })),
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers: exports.getAllUsers,
  getUser: exports.getUser,
  createUser: exports.createUser,
  updateUser: exports.updateUser,
  deleteUser: exports.deleteUser,
  getActivityLogs: exports.getActivityLogs,
  getStatistics: exports.getStatistics
};
